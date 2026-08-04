"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/transaction.routes.ts (was admin.routes.ts)
const express_1 = require("express");
const Transaction_1 = __importDefault(require("../models/Transaction"));
const auth_1 = __importDefault(require("../middleware/auth"));
const payment_service_1 = require("../services/payment.service");
const router = (0, express_1.Router)();
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
// GET /api/transactions - List all transactions (paginated)
router.get('/', auth_1.default, adminMiddleware, async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const { status, paymentMethod, source, search, startDate, endDate } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (paymentMethod)
            query.paymentMethod = paymentMethod;
        if (source)
            query.source = source;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = new Date(startDate);
            if (endDate)
                query.createdAt.$lte = new Date(endDate);
        }
        if (search) {
            query.$or = [
                { transactionId: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { mpesaReceipt: { $regex: search, $options: 'i' } },
                { invoiceNumber: { $regex: search, $options: 'i' } }
            ];
        }
        const [transactions, total] = await Promise.all([
            Transaction_1.default.find(query)
                .populate('orderId', 'orderNumber total status')
                .populate('recordedBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Transaction_1.default.countDocuments(query)
        ]);
        res.json({
            transactions,
            pagination: { current: page, pages: Math.ceil(total / limit), total, limit }
        });
    }
    catch (error) {
        console.error('Transactions fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});
// GET /api/transactions/stats - Transaction statistics
router.get('/stats', auth_1.default, adminMiddleware, async (req, res) => {
    try {
        const stats = await Transaction_1.default.aggregate([
            {
                $facet: {
                    summary: [{
                            $group: {
                                _id: null,
                                totalVolume: { $sum: '$amount' },
                                totalTransactions: { $sum: 1 },
                                completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                                pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                                failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
                                refunded: { $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] } }
                            }
                        }],
                    byStatus: [{ $group: { _id: '$status', count: { $sum: 1 }, volume: { $sum: '$amount' } } }],
                    bySource: [{ $group: { _id: '$source', count: { $sum: 1 }, volume: { $sum: '$amount' } } }],
                    byMethod: [{ $group: { _id: '$paymentMethod', count: { $sum: 1 }, volume: { $sum: '$amount' } } }]
                }
            }
        ]);
        res.json(stats[0]);
    }
    catch (error) {
        console.error('Transaction stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});
// GET /api/transactions/:id - Get single transaction
router.get('/:id', auth_1.default, adminMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction_1.default.findById(req.params.id)
            .populate('orderId', 'orderNumber total status')
            .populate('recordedBy', 'name email');
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    }
    catch (error) {
        console.error('Fetch transaction error:', error);
        res.status(500).json({ error: 'Failed to fetch transaction' });
    }
});
// PATCH /api/transactions/:id/status - Update transaction status
router.patch('/:id/status', auth_1.default, adminMiddleware, async (req, res) => {
    try {
        const { status, reason } = req.body;
        const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const transaction = await Transaction_1.default.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        const oldStatus = transaction.status;
        transaction.status = status;
        if (reason) {
            transaction.notes = `${transaction.notes || ''}\nStatus changed from ${oldStatus} to ${status}: ${reason}`.trim();
        }
        if (status === 'completed' && !transaction.paidAt) {
            transaction.paidAt = new Date();
        }
        await transaction.save();
        // Update order payment summary if completed or refunded
        if (status === 'completed' || status === 'refunded') {
            await payment_service_1.PaymentService.updateOrderPaymentSummary(transaction.orderId.toString());
        }
        res.json({ success: true, message: `Status updated from ${oldStatus} to ${status}`, transaction });
    }
    catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});
// GET /api/transactions/export/csv - Export transactions as CSV
router.get('/export/csv', auth_1.default, adminMiddleware, async (req, res) => {
    var _a;
    try {
        const { startDate, endDate, status, paymentMethod } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (paymentMethod)
            query.paymentMethod = paymentMethod;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = new Date(startDate);
            if (endDate)
                query.createdAt.$lte = new Date(endDate);
        }
        const transactions = await Transaction_1.default.find(query)
            .populate('orderId', 'orderNumber')
            .sort({ createdAt: -1 })
            .lean();
        const csvRows = [
            ['Transaction ID', 'Order Number', 'Customer Name', 'Amount', 'Currency', 'Status', 'Payment Method', 'Source', 'Reference', 'Created At', 'Notes']
        ];
        for (const tx of transactions) {
            csvRows.push([
                tx.transactionId,
                ((_a = tx.orderId) === null || _a === void 0 ? void 0 : _a.orderNumber) || 'N/A',
                tx.customerName,
                tx.amount.toString(),
                tx.currency,
                tx.status,
                tx.paymentMethod,
                tx.source,
                tx.reference || tx.mpesaReceipt || '',
                tx.createdAt.toISOString(),
                tx.notes || ''
            ]);
        }
        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=transactions-${Date.now()}.csv`);
        res.send(csvContent);
    }
    catch (error) {
        console.error('Export CSV error:', error);
        res.status(500).json({ error: 'Failed to export transactions' });
    }
});
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map
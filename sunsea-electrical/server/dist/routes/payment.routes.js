"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/paymentRoutes.ts (Updated)
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Order_1 = __importDefault(require("../models/Order"));
const auth_1 = __importDefault(require("../middleware/auth"));
const auditMiddleware_1 = require("../middleware/auditMiddleware");
const router = (0, express_1.Router)();
// Helper function to calculate payment summary
async function getOrderPaymentSummary(orderId) {
    const objectId = typeof orderId === 'string' ? new mongoose_1.default.Types.ObjectId(orderId) : orderId;
    const transactions = await Transaction_1.default.find({
        orderId: objectId,
        status: 'completed'
    }).sort({ createdAt: -1 }).lean();
    const totalPaid = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const order = await Order_1.default.findById(objectId).select('total amountPaid balanceDue orderNumber');
    let orderTotal = 0;
    if (order && typeof order.total === 'number' && !isNaN(order.total)) {
        orderTotal = order.total;
    }
    const calculatedBalance = Math.max(0, orderTotal - totalPaid);
    return {
        transactions,
        totalPaid,
        balanceDue: calculatedBalance,
        orderTotal,
        paymentCount: transactions.length,
        lastPayment: transactions[0] || null,
        orderNumber: (order === null || order === void 0 ? void 0 : order.orderNumber) || 'N/A'
    };
}
// Helper to calculate payment status
function calculatePaymentStatus(totalPaid, orderTotal) {
    if (totalPaid <= 0)
        return 'unpaid';
    if (totalPaid < orderTotal)
        return 'partially_paid';
    if (totalPaid === orderTotal)
        return 'paid';
    return 'overpaid';
}
// Helper to update order payment summary
async function updateOrderPaymentSummary(orderId) {
    const objectId = typeof orderId === 'string' ? new mongoose_1.default.Types.ObjectId(orderId) : orderId;
    const summary = await getOrderPaymentSummary(objectId);
    const order = await Order_1.default.findById(objectId);
    if (!order)
        return null;
    if (!order.total || order.total <= 0) {
        console.error(`Order ${orderId} has invalid total: ${order.total}`);
        return null;
    }
    order.amountPaid = summary.totalPaid;
    order.balanceDue = Math.max(0, summary.balanceDue);
    order.paymentStatus = calculatePaymentStatus(summary.totalPaid, order.total);
    if (summary.transactions.length > 0) {
        const latest = summary.transactions[0];
        order.paymentDetails = {
            transactionId: latest.transactionId,
            mpesaReceipt: latest.mpesaReceipt,
            cardLast4: latest.cardLast4,
            cardBrand: latest.cardBrand,
            paidAt: latest.paidAt,
            phoneNumber: latest.phoneNumber
        };
    }
    await order.save();
    return order;
}
// GET /api/payments/orders/:orderId - Get payment summary for an order
router.get('/orders/:orderId', auth_1.default, async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const { orderId } = req.params;
        let orderQuery = {};
        // Check if orderId is a MongoDB ObjectId or order number
        if (mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            orderQuery = { _id: new mongoose_1.default.Types.ObjectId(orderId) };
        }
        else {
            // Try to find by order number
            orderQuery = { orderNumber: orderId };
        }
        const order = await Order_1.default.findOne(orderQuery);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
        const isSales = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'sales';
        const isOwner = ((_c = order.userId) === null || _c === void 0 ? void 0 : _c.toString()) === ((_d = req.user) === null || _d === void 0 ? void 0 : _d.userId);
        if (!isAdmin && !isSales && !isOwner) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const summary = await getOrderPaymentSummary(order._id);
        const validTotal = order.total && !isNaN(order.total) ? order.total : 0;
        const validAmountPaid = summary.totalPaid || 0;
        const validBalanceDue = Math.max(0, validTotal - validAmountPaid);
        res.json({
            success: true,
            orderId: order._id,
            orderNumber: order.orderNumber || 'N/A',
            invoiceNumber: order.invoiceNumber,
            total: validTotal,
            paymentStatus: order.paymentStatus || 'unpaid',
            amountPaid: validAmountPaid,
            balanceDue: validBalanceDue,
            paymentCount: summary.paymentCount,
            lastPayment: summary.lastPayment,
            transactions: summary.transactions
        });
    }
    catch (error) {
        console.error('Get payment summary error:', error);
        res.status(500).json({ error: error.message });
    }
});
// POST /api/payments/record - Record a manual payment
router.post('/record', auth_1.default, async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        const { orderId, amount, paymentMethod, reference, notes, phoneNumber } = req.body;
        if (!orderId || !amount || !paymentMethod) {
            return res.status(400).json({ error: 'orderId, amount, and paymentMethod are required' });
        }
        // Find order by ID or order number
        let orderQuery = {};
        if (mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            orderQuery = { _id: new mongoose_1.default.Types.ObjectId(orderId) };
        }
        else {
            orderQuery = { orderNumber: orderId };
        }
        const order = await Order_1.default.findOne(orderQuery);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
        const isSales = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'sales';
        if (!isAdmin && !isSales) {
            return res.status(403).json({ error: 'Only admin or sales can record manual payments' });
        }
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number' });
        }
        const currentSummary = await getOrderPaymentSummary(order._id);
        const orderTotal = order.total && !isNaN(order.total) ? order.total : 0;
        const safeBalanceDue = Math.max(0, orderTotal - currentSummary.totalPaid);
        if (numAmount > safeBalanceDue && safeBalanceDue > 0) {
            return res.status(400).json({ error: `Amount cannot exceed balance due of KES ${safeBalanceDue.toLocaleString()}` });
        }
        if (safeBalanceDue === 0) {
            return res.status(400).json({ error: 'Order is already fully paid. Cannot record additional payment.' });
        }
        // Generate transaction ID
        const transactionId = Transaction_1.default.generateTransactionId('MAN', 'manual');
        // Create transaction with order number
        const transaction = await Transaction_1.default.create({
            orderId: order._id,
            orderNumber: order.orderNumber,
            invoiceNumber: order.invoiceNumber,
            quotationNumber: order.quotationNumber,
            amount: numAmount,
            paymentMethod,
            status: 'completed',
            transactionId,
            reference: reference || null,
            notes: notes || null,
            recordedBy: ((_c = req.user) === null || _c === void 0 ? void 0 : _c.userId) ? new mongoose_1.default.Types.ObjectId(req.user.userId) : undefined,
            recordedByName: ((_d = req.user) === null || _d === void 0 ? void 0 : _d.name) || ((_e = req.user) === null || _e === void 0 ? void 0 : _e.email),
            source: 'manual',
            isPartialPayment: numAmount < safeBalanceDue,
            paidAt: new Date(),
            customerName: ((_f = order.shippingAddress) === null || _f === void 0 ? void 0 : _f.fullName) || ((_g = order.guestInfo) === null || _g === void 0 ? void 0 : _g.name) || 'Customer',
            guestEmail: (_h = order.guestInfo) === null || _h === void 0 ? void 0 : _h.email,
            guestPhone: (_j = order.guestInfo) === null || _j === void 0 ? void 0 : _j.phone,
            userId: order.userId,
            phoneNumber: phoneNumber || ((_k = order.guestInfo) === null || _k === void 0 ? void 0 : _k.phone)
        });
        const updatedOrder = await updateOrderPaymentSummary(order._id);
        await (0, auditMiddleware_1.createAuditLog)(req, {
            action: 'record_payment',
            resource: 'order',
            resourceId: order._id.toString(),
            details: `Manual payment of ${numAmount} recorded for order ${order.orderNumber}`,
            skipIfNoUser: false
        });
        const finalSummary = await getOrderPaymentSummary(order._id);
        res.json({
            success: true,
            message: 'Payment recorded successfully',
            transaction,
            order: {
                orderId: order._id,
                orderNumber: order.orderNumber,
                paymentStatus: (updatedOrder === null || updatedOrder === void 0 ? void 0 : updatedOrder.paymentStatus) || 'paid',
                amountPaid: finalSummary.totalPaid,
                balanceDue: finalSummary.balanceDue
            }
        });
    }
    catch (error) {
        console.error('Record payment error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/payments/transactions - List all transactions
router.get('/transactions', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
        const isSales = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'sales';
        if (!isAdmin && !isSales) {
            return res.status(403).json({ error: 'Admin or Sales access required' });
        }
        const { page = '1', limit = '20', status, paymentMethod, source, search, orderNumber } = req.query;
        const p = Number(page);
        const l = Number(limit);
        const skip = (p - 1) * l;
        const query = {};
        if (status)
            query.status = status;
        if (paymentMethod)
            query.paymentMethod = paymentMethod;
        if (source)
            query.source = source;
        // Filter by order number
        if (orderNumber) {
            query.orderNumber = orderNumber;
        }
        if (search) {
            query.$or = [
                { transactionId: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { invoiceNumber: { $regex: search, $options: 'i' } },
                { orderNumber: { $regex: search, $options: 'i' } },
                { mpesaReceipt: { $regex: search, $options: 'i' } }
            ];
        }
        // Sales users can only see their recorded transactions
        if (isSales && !isAdmin) {
            query.recordedBy = req.user.userId;
        }
        const [transactions, total] = await Promise.all([
            Transaction_1.default.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(l)
                .lean(),
            Transaction_1.default.countDocuments(query)
        ]);
        res.json({
            transactions,
            pagination: {
                current: p,
                limit: l,
                total,
                pages: Math.ceil(total / l)
            }
        });
    }
    catch (error) {
        console.error('List transactions error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/payments/transactions/:id - Get single transaction
router.get('/transactions/:id', auth_1.default, async (req, res) => {
    var _a, _b, _c, _d, _e;
    try {
        const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
        const isSales = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'sales';
        if (!isAdmin && !isSales) {
            return res.status(403).json({ error: 'Admin or Sales access required' });
        }
        const transaction = await Transaction_1.default.findById(req.params.id)
            .populate('orderId', 'orderNumber total status')
            .populate('recordedBy', 'name email');
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        // Sales users can only view their own transactions
        if (isSales && !isAdmin && ((_d = (_c = transaction.recordedBy) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString()) !== ((_e = req.user) === null || _e === void 0 ? void 0 : _e.userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json(transaction);
    }
    catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/payments/stats - Payment statistics
router.get('/stats', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
        const isSales = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'sales';
        if (!isAdmin && !isSales) {
            return res.status(403).json({ error: 'Admin or Sales access required' });
        }
        const matchStage = {
            status: 'completed',
            amount: { $gt: 0 }
        };
        // Sales users only see their transactions
        if (isSales && !isAdmin) {
            matchStage.recordedBy = new mongoose_1.default.Types.ObjectId(req.user.userId);
        }
        const stats = await Transaction_1.default.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalVolume: { $sum: '$amount' },
                    totalTransactions: { $sum: 1 },
                    avgTransaction: { $avg: '$amount' },
                    totalRefunds: { $sum: '$refundedAmount' }
                }
            }
        ]);
        const sourceBreakdown = await Transaction_1.default.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 },
                    volume: { $sum: '$amount' }
                }
            }
        ]);
        const methodBreakdown = await Transaction_1.default.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    volume: { $sum: '$amount' }
                }
            }
        ]);
        res.json({
            summary: stats[0] || { totalVolume: 0, totalTransactions: 0, avgTransaction: 0, totalRefunds: 0 },
            sourceBreakdown,
            methodBreakdown
        });
    }
    catch (error) {
        console.error('Payment stats error:', error);
        res.status(500).json({ error: error.message });
    }
});
// POST /api/payments/refund - Process a refund
router.post('/refund', auth_1.default, async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const { transactionId, reason, amount } = req.body;
        if (!transactionId) {
            return res.status(400).json({ error: 'Transaction ID is required' });
        }
        const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
        if (!isAdmin) {
            return res.status(403).json({ error: 'Only admin can process refunds' });
        }
        const originalTransaction = await Transaction_1.default.findOne({ transactionId });
        if (!originalTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        if (originalTransaction.status === 'refunded') {
            return res.status(400).json({ error: 'Transaction already refunded' });
        }
        const refundAmount = amount || originalTransaction.amount;
        // Create refund transaction
        const refundTransaction = await Transaction_1.default.create({
            orderId: originalTransaction.orderId,
            orderNumber: originalTransaction.orderNumber,
            invoiceNumber: originalTransaction.invoiceNumber,
            customerName: originalTransaction.customerName,
            userId: originalTransaction.userId,
            amount: -refundAmount, // Negative amount for refund
            currency: originalTransaction.currency,
            paymentMethod: originalTransaction.paymentMethod,
            status: 'refunded',
            transactionId: Transaction_1.default.generateTransactionId('REF', 'admin'),
            reference: `Refund for ${originalTransaction.transactionId}`,
            notes: reason || `Refund processed for transaction ${originalTransaction.transactionId}`,
            recordedBy: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId) ? new mongoose_1.default.Types.ObjectId(req.user.userId) : undefined,
            recordedByName: ((_c = req.user) === null || _c === void 0 ? void 0 : _c.name) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.email),
            source: 'admin',
            isPartialPayment: false,
            paidAt: new Date(),
            parentTransactionId: originalTransaction.transactionId,
            refundedAmount: refundAmount,
            refundedAt: new Date(),
            refundReason: reason || 'No reason provided'
        });
        // Update original transaction
        originalTransaction.status = 'refunded';
        originalTransaction.refundedAmount = refundAmount;
        originalTransaction.refundedAt = new Date();
        originalTransaction.refundReason = reason || 'No reason provided';
        await originalTransaction.save();
        // Update order payment summary
        if (originalTransaction.orderId) {
            await updateOrderPaymentSummary(originalTransaction.orderId);
        }
        res.json({
            success: true,
            message: 'Refund processed successfully',
            originalTransaction: originalTransaction.transactionId,
            refundTransaction
        });
    }
    catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=payment.routes.js.map
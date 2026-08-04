"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Order_1 = __importDefault(require("../models/Order"));
const auth_1 = __importDefault(require("../middleware/auth"));
const auditMiddleware_1 = require("../middleware/auditMiddleware");
const router = (0, express_1.Router)();
// Helper function to calculate payment summary (FIXED - with absolute safety)
async function getOrderPaymentSummary(orderId) {
    // Get all completed transactions
    const transactions = await Transaction_1.default.find({
        orderId: new mongoose_1.default.Types.ObjectId(orderId),
        status: 'completed'
    }).sort({ createdAt: -1 }).lean();
    // Calculate total paid from transactions
    const totalPaid = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    // Get order with explicit total field
    const order = await Order_1.default.findById(orderId).select('total amountPaid balanceDue');
    // Ensure order total is a valid positive number
    let orderTotal = 0;
    if (order && typeof order.total === 'number' && !isNaN(order.total)) {
        orderTotal = order.total;
    }
    // Calculate balance due - ensure it's never negative
    const calculatedBalance = Math.max(0, orderTotal - totalPaid);
    console.log(`Payment summary for ${orderId}: Total=${orderTotal}, Paid=${totalPaid}, Balance=${calculatedBalance}`);
    return {
        transactions,
        totalPaid,
        balanceDue: calculatedBalance,
        orderTotal,
        paymentCount: transactions.length,
        lastPayment: transactions[0] || null
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
// Helper to update order payment summary (FIXED)
async function updateOrderPaymentSummary(orderId) {
    const summary = await getOrderPaymentSummary(orderId);
    const order = await Order_1.default.findById(orderId);
    if (!order)
        return null;
    // Ensure order.total is set correctly
    if (!order.total || order.total <= 0) {
        console.error(`Order ${orderId} has invalid total: ${order.total}`);
        return null;
    }
    // Use the calculated values from summary
    order.amountPaid = summary.totalPaid;
    order.balanceDue = Math.max(0, summary.balanceDue);
    order.paymentStatus = calculatePaymentStatus(summary.totalPaid, order.total);
    console.log(`Updated order ${orderId}: AmountPaid=${order.amountPaid}, BalanceDue=${order.balanceDue}, Status=${order.paymentStatus}`);
    // Update paymentDetails with latest transaction
    if (summary.transactions.length > 0) {
        const latest = summary.transactions[0];
        order.paymentDetails = {
            transactionId: latest.transactionId,
            mpesaReceipt: latest.mpesaReceipt,
            cardLast4: latest.cardLast4,
            cardBrand: latest.cardBrand,
            paidAt: latest.paidAt,
            phoneNumber: undefined
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
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }
        const order = await Order_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Check permissions
        const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
        const isSales = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'sales';
        const isOwner = ((_c = order.userId) === null || _c === void 0 ? void 0 : _c.toString()) === ((_d = req.user) === null || _d === void 0 ? void 0 : _d.userId);
        if (!isAdmin && !isSales && !isOwner) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const summary = await getOrderPaymentSummary(orderId);
        // Ensure order total is valid
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
// POST /api/payments/record - Record a manual payment (FIXED)
router.post('/record', auth_1.default, async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const { orderId, amount, paymentMethod, reference, notes } = req.body;
        if (!orderId || !amount || !paymentMethod) {
            return res.status(400).json({ error: 'orderId, amount, and paymentMethod are required' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }
        const order = await Order_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Check permissions
        const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
        const isSales = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'sales';
        if (!isAdmin && !isSales) {
            return res.status(403).json({ error: 'Only admin or sales can record manual payments' });
        }
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number' });
        }
        // Get current summary with fresh calculation
        const currentSummary = await getOrderPaymentSummary(orderId);
        // Ensure order total is valid
        const orderTotal = order.total && !isNaN(order.total) ? order.total : 0;
        const safeBalanceDue = Math.max(0, orderTotal - currentSummary.totalPaid);
        console.log(`Recording payment: OrderTotal=${orderTotal}, TotalPaid=${currentSummary.totalPaid}, BalanceDue=${safeBalanceDue}, AttemptAmount=${numAmount}`);
        // Validate amount doesn't exceed balance due
        if (numAmount > safeBalanceDue && safeBalanceDue > 0) {
            return res.status(400).json({ error: `Amount cannot exceed balance due of KES ${safeBalanceDue.toLocaleString()}` });
        }
        // If balanceDue is 0, prevent overpayment
        if (safeBalanceDue === 0) {
            return res.status(400).json({ error: 'Order is already fully paid. Cannot record additional payment.' });
        }
        // Create transaction
        const transaction = await Transaction_1.default.create({
            orderId: order._id,
            invoiceNumber: order.invoiceNumber,
            quotationNumber: order.quotationNumber,
            amount: numAmount,
            paymentMethod,
            status: 'completed',
            transactionId: `MAN-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
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
            userId: order.userId
        });
        // Update order payment summary
        const updatedOrder = await updateOrderPaymentSummary(orderId);
        await (0, auditMiddleware_1.createAuditLog)(req, {
            action: 'record_payment',
            resource: 'order',
            resourceId: orderId,
            details: `Manual payment of ${numAmount} recorded for order ${order.orderNumber}`,
            skipIfNoUser: false
        });
        // Get final updated summary
        const finalSummary = await getOrderPaymentSummary(orderId);
        res.json({
            success: true,
            message: 'Payment recorded successfully',
            transaction,
            order: {
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
// GET /api/payments/transactions - List all transactions (admin only)
router.get('/transactions', auth_1.default, async (req, res) => {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { page = '1', limit = '20', status, paymentMethod, source, search } = req.query;
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
        if (search) {
            query.$or = [
                { transactionId: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { invoiceNumber: { $regex: search, $options: 'i' } }
            ];
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
// GET /api/payments/stats - Payment statistics
router.get('/stats', auth_1.default, async (req, res) => {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const stats = await Transaction_1.default.aggregate([
            {
                $match: { status: 'completed', amount: { $gt: 0 } }
            },
            {
                $group: {
                    _id: null,
                    totalVolume: { $sum: '$amount' },
                    totalTransactions: { $sum: 1 },
                    avgTransaction: { $avg: '$amount' }
                }
            }
        ]);
        const sourceBreakdown = await Transaction_1.default.aggregate([
            {
                $match: { status: 'completed', amount: { $gt: 0 } }
            },
            {
                $group: {
                    _id: '$source',
                    count: { $sum: 1 },
                    volume: { $sum: '$amount' }
                }
            }
        ]);
        res.json({
            summary: stats[0] || { totalVolume: 0, totalTransactions: 0, avgTransaction: 0 },
            sourceBreakdown
        });
    }
    catch (error) {
        console.error('Payment stats error:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=payment.routes.js.map
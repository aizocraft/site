"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Order_1 = __importDefault(require("../models/Order"));
class PaymentService {
    /**
     * Get payment summary for an order
     */
    static async getOrderPaymentSummary(orderId) {
        const transactions = await Transaction_1.default.find({
            orderId: new mongoose_1.default.Types.ObjectId(orderId),
            status: 'completed'
        }).sort({ createdAt: -1 }).lean();
        const totalPaid = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const order = await Order_1.default.findById(orderId).select('total');
        return {
            transactions,
            totalPaid,
            balanceDue: ((order === null || order === void 0 ? void 0 : order.total) || 0) - totalPaid,
            paymentCount: transactions.length,
            lastPayment: transactions[0] || null,
            bySource: {
                checkout: transactions.filter(t => t.source === 'checkout').length,
                quotation: transactions.filter(t => t.source === 'quotation').length,
                admin: transactions.filter(t => t.source === 'admin').length,
                manual: transactions.filter(t => t.source === 'manual').length
            }
        };
    }
    /**
     * Calculate payment status based on total paid
     */
    static calculatePaymentStatus(totalPaid, orderTotal) {
        if (totalPaid === 0)
            return 'unpaid';
        if (totalPaid < orderTotal)
            return 'partially_paid';
        if (totalPaid === orderTotal)
            return 'paid';
        return 'overpaid';
    }
    /**
     * Update order payment summary from transactions
     */
    static async updateOrderPaymentSummary(orderId) {
        const summary = await this.getOrderPaymentSummary(orderId);
        const order = await Order_1.default.findById(orderId);
        if (!order)
            return;
        order.amountPaid = summary.totalPaid;
        order.balanceDue = summary.balanceDue;
        order.paymentStatus = this.calculatePaymentStatus(summary.totalPaid, order.total);
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
    /**
     * Record a payment
     */
    static async recordPayment({ orderId, amount, paymentMethod, reference, notes, source, recordedBy, recordedByName, transactionId: customTransactionId, mpesaReceipt, cardLast4, cardBrand }) {
        var _a, _b, _c, _d;
        const order = await Order_1.default.findById(orderId);
        if (!order)
            throw new Error('Order not found');
        const currentSummary = await this.getOrderPaymentSummary(orderId);
        if (amount <= 0)
            throw new Error('Amount must be positive');
        if (amount > currentSummary.balanceDue && currentSummary.balanceDue > 0) {
            throw new Error(`Payment exceeds balance due of ${currentSummary.balanceDue}`);
        }
        const transaction = await Transaction_1.default.create({
            orderId: order._id,
            invoiceNumber: order.invoiceNumber,
            quotationNumber: order.quotationNumber,
            amount,
            paymentMethod,
            status: 'completed',
            transactionId: customTransactionId || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            reference,
            notes,
            recordedBy: recordedBy ? new mongoose_1.default.Types.ObjectId(recordedBy) : undefined,
            recordedByName,
            source,
            isPartialPayment: amount < currentSummary.balanceDue,
            paidAt: new Date(),
            mpesaReceipt,
            cardLast4,
            cardBrand,
            customerName: ((_a = order.shippingAddress) === null || _a === void 0 ? void 0 : _a.fullName) || ((_b = order.guestInfo) === null || _b === void 0 ? void 0 : _b.name) || 'Customer',
            guestEmail: (_c = order.guestInfo) === null || _c === void 0 ? void 0 : _c.email,
            guestPhone: (_d = order.guestInfo) === null || _d === void 0 ? void 0 : _d.phone,
            userId: order.userId
        });
        await this.updateOrderPaymentSummary(orderId);
        return transaction;
    }
    /**
     * Initialize order payment (called after order creation)
     */
    static async initializeOrderPayment(orderId, paymentMethod) {
        var _a;
        if (paymentMethod === 'cod') {
            await Order_1.default.findByIdAndUpdate(orderId, {
                paymentStatus: 'unpaid',
                amountPaid: 0,
                balanceDue: ((_a = (await Order_1.default.findById(orderId))) === null || _a === void 0 ? void 0 : _a.total) || 0
            });
            return { status: 'unpaid', message: 'COD order created' };
        }
        return { status: 'pending', message: 'Payment pending' };
    }
    /**
     * Update transaction status (for payment callbacks)
     */
    static async updateTransactionStatus(transactionId, status, metadata) {
        const transaction = await Transaction_1.default.findOne({ transactionId });
        if (!transaction)
            throw new Error('Transaction not found');
        transaction.status = status;
        if (metadata === null || metadata === void 0 ? void 0 : metadata.mpesaReceipt)
            transaction.mpesaReceipt = metadata.mpesaReceipt;
        if (metadata === null || metadata === void 0 ? void 0 : metadata.reference)
            transaction.reference = metadata.reference;
        if (status === 'completed')
            transaction.paidAt = new Date();
        await transaction.save();
        // ✅ FIX: Check if orderId exists before updating
        if (status === 'completed' && transaction.orderId) {
            await this.updateOrderPaymentSummary(transaction.orderId.toString());
        }
        return transaction;
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map
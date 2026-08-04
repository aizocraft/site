import mongoose from 'mongoose';
export declare class PaymentService {
    /**
     * Get payment summary for an order
     */
    static getOrderPaymentSummary(orderId: string): Promise<{
        transactions: (mongoose.FlattenMaps<import("../models/Transaction").ITransaction> & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        totalPaid: number;
        balanceDue: number;
        paymentCount: number;
        lastPayment: mongoose.FlattenMaps<import("../models/Transaction").ITransaction> & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        };
        bySource: {
            checkout: number;
            quotation: number;
            admin: number;
            manual: number;
        };
    }>;
    /**
     * Calculate payment status based on total paid
     */
    static calculatePaymentStatus(totalPaid: number, orderTotal: number): "paid" | "unpaid" | "partially_paid" | "overpaid";
    /**
     * Update order payment summary from transactions
     */
    static updateOrderPaymentSummary(orderId: string): Promise<(mongoose.Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    /**
     * Record a payment
     */
    static recordPayment({ orderId, amount, paymentMethod, reference, notes, source, recordedBy, recordedByName, transactionId: customTransactionId, mpesaReceipt, cardLast4, cardBrand }: {
        orderId: string;
        amount: number;
        paymentMethod: string;
        reference?: string;
        notes?: string;
        source: 'checkout' | 'quotation' | 'admin' | 'manual';
        recordedBy?: string;
        recordedByName?: string;
        transactionId?: string;
        mpesaReceipt?: string;
        cardLast4?: string;
        cardBrand?: string;
    }): Promise<mongoose.Document<unknown, {}, import("../models/Transaction").ITransaction, {}, {}> & import("../models/Transaction").ITransaction & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    /**
     * Initialize order payment (called after order creation)
     */
    static initializeOrderPayment(orderId: string, paymentMethod: string): Promise<{
        status: string;
        message: string;
    }>;
    /**
     * Update transaction status (for payment callbacks)
     */
    static updateTransactionStatus(transactionId: string, status: 'completed' | 'failed', metadata?: {
        mpesaReceipt?: string;
        reference?: string;
    }): Promise<mongoose.Document<unknown, {}, import("../models/Transaction").ITransaction, {}, {}> & import("../models/Transaction").ITransaction & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
//# sourceMappingURL=payment.service.d.ts.map
import mongoose, { Document, Model } from 'mongoose';
export interface ITransaction extends Document {
    orderId?: mongoose.Types.ObjectId;
    orderNumber?: string;
    invoiceId?: mongoose.Types.ObjectId;
    invoiceNumber?: string;
    quotationNumber?: string;
    userId?: mongoose.Types.ObjectId;
    guestEmail?: string;
    guestPhone?: string;
    customerName: string;
    amount: number;
    currency: string;
    paymentMethod: 'mpesa' | 'card' | 'cod' | 'cash' | 'bank_transfer' | 'cheque';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId: string;
    mpesaReceipt?: string;
    cardLast4?: string;
    cardBrand?: string;
    reference?: string;
    phoneNumber?: string;
    notes?: string;
    recordedBy?: mongoose.Types.ObjectId;
    recordedByName?: string;
    source: 'checkout' | 'quotation' | 'admin' | 'manual' | 'invoice' | 'order' | 'pos';
    isPartialPayment: boolean;
    paidAt?: Date;
    refundedAmount?: number;
    refundedAt?: Date;
    refundReason?: string;
    parentTransactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}
interface TransactionModel extends Model<ITransaction> {
    generateTransactionId(prefix?: string, source?: string): string;
}
declare const TransactionModel: TransactionModel;
export default TransactionModel;
//# sourceMappingURL=Transaction.d.ts.map
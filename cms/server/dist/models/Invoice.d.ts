import mongoose, { Document } from 'mongoose';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'overpaid';
export interface IInvoiceItem {
    productId: mongoose.Types.ObjectId;
    name: string;
    slug?: string;
    qty: number;
    price: number;
    buyingPrice: number;
    profitPerItem: number;
    totalProfit: number;
    total: number;
    tax?: number;
    taxable?: boolean;
    description?: string;
}
export interface ITransportInfo {
    cost: number;
    description: string;
}
export interface IInvoice extends Document {
    quotationId: mongoose.Types.ObjectId;
    quotationNumber: string;
    orderId?: mongoose.Types.ObjectId;
    orderCreatedAt?: Date;
    customerId: mongoose.Types.ObjectId;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    customerLocation?: string;
    createdBy: mongoose.Types.ObjectId;
    createdByName?: string;
    items: IInvoiceItem[];
    subtotal: number;
    totalCost: number;
    totalProfit: number;
    taxRate: number;
    tax: number;
    taxPerItem?: boolean;
    discount: number;
    discountType: 'percentage' | 'fixed';
    transportInfo?: ITransportInfo;
    transportCost?: number;
    transportDescription?: string;
    total: number;
    invoiceNumber: string;
    status: InvoiceStatus;
    paymentStatus: PaymentStatus;
    amountPaid: number;
    balanceDue: number;
    issueDate: Date;
    dueDate: Date;
    notes?: string;
    terms?: string;
    payments: Array<{
        amount: number;
        method: string;
        reference?: string;
        date: Date;
        recordedBy: mongoose.Types.ObjectId;
        transactionId?: string;
    }>;
    sentAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare function generateInvoiceNumber(date?: Date): Promise<string>;
declare const InvoiceModel: mongoose.Model<IInvoice, {}, {}, {}, mongoose.Document<unknown, {}, IInvoice, {}, {}> & IInvoice & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default InvoiceModel;
//# sourceMappingURL=Invoice.d.ts.map
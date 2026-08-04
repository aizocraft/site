import mongoose, { Document } from 'mongoose';
export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type DiscountType = 'percentage' | 'fixed';
export interface IQuotationItem {
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
    customPrice?: boolean;
    taxable?: boolean;
    image?: string;
    description?: string;
}
export interface ITransportInfo {
    cost: number;
    description: string;
}
export interface IQuotation extends Document {
    customerId: mongoose.Types.ObjectId;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    customerLocation?: string;
    createdBy: mongoose.Types.ObjectId;
    createdByName?: string;
    items: IQuotationItem[];
    subtotal: number;
    totalCost: number;
    totalProfit: number;
    taxRate: number;
    tax: number;
    taxPerItem?: boolean;
    discount: number;
    discountType: DiscountType;
    discountReason?: string;
    transportInfo?: ITransportInfo;
    transportCost?: number;
    transportDescription?: string;
    estimatedDelivery?: string;
    total: number;
    quoteNumber: string;
    status: QuotationStatus;
    validUntil: Date;
    notes?: string;
    terms?: string;
    acceptedAt?: Date;
    sentAt?: Date;
    rejectedAt?: Date;
    rejectedReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare function generateQuoteNumber(date?: Date): Promise<string>;
declare const QuotationModel: mongoose.Model<IQuotation, {}, {}, {}, mongoose.Document<unknown, {}, IQuotation, {}, {}> & IQuotation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default QuotationModel;
//# sourceMappingURL=Quotation.d.ts.map
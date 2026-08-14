import mongoose, { Document, Model } from 'mongoose';
export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    image: string;
    sellingPrice: number;
    buyingPrice: number;
    profit: number;
    qty: number;
    description?: string;
}
export interface IOrder extends Document {
    userId?: mongoose.Types.ObjectId;
    guestInfo?: {
        email: string;
        phone: string;
        name?: string;
    };
    items: IOrderItem[];
    subtotal: number;
    totalCost: number;
    totalProfit: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    paymentMethod: 'cod' | 'mpesa' | 'card' | 'cash' | 'bank_transfer' | 'cheque';
    paymentStatus: 'unpaid' | 'partially_paid' | 'paid' | 'overpaid' | 'refunded';
    amountPaid: number;
    balanceDue: number;
    paymentDetails?: {
        transactionId?: string;
        mpesaReceipt?: string;
        cardLast4?: string;
        cardBrand?: string;
        paidAt?: Date;
        phoneNumber?: string;
    };
    invoiceNumber?: string;
    quotationNumber?: string;
    invoiceDate?: Date;
    dueDate?: Date;
    invoiceSentAt?: Date;
    paymentTerms?: string;
    stripeId?: string;
    selectedShippingArea?: mongoose.Types.ObjectId;
    appliedPromoCode?: mongoose.Types.ObjectId;
    salesCustomerId?: mongoose.Types.ObjectId;
    quotationId?: mongoose.Types.ObjectId;
    invoiceId?: mongoose.Types.ObjectId;
    shippingAddress: {
        fullName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        phone: string;
        email?: string;
    };
    notes?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    createdAt: Date;
    updatedAt: Date;
    orderNumber: string;
    canCancel(): boolean;
    canRefund(): boolean;
}
interface IOrderModel extends Model<IOrder> {
}
declare const OrderModel: IOrderModel;
export default OrderModel;
//# sourceMappingURL=Order.d.ts.map
export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export interface ContactEmailData {
    name: string;
    email: string;
    phone?: string;
    message: string;
}
export interface OrderEmailData {
    orderId: string;
    orderNumber?: string;
    customerName: string;
    customerEmail: string;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    promoCode?: string;
    status: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}
export interface AdminOrderNotificationData {
    orderId: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    promoCode?: string;
    paymentMethod: string;
    status: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    orderDate: Date;
}
export interface WelcomeEmailData {
    email: string;
    name: string;
    template?: 'new-user' | 'sales-team' | 'vip' | 'partner';
}
export interface OrderStatusUpdateData {
    to: string;
    orderNumber: string;
    status: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    notes?: string;
}
export interface PaymentConfirmationData {
    email: string;
    customerName: string;
    orderNumber: string;
    amount: number;
    transactionId?: string;
    paymentMethod: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}
export interface PaymentFailedData {
    email: string;
    customerName: string;
    orderNumber: string;
    amount: number;
    reason?: string;
}
export interface QuotationData {
    to: string;
    customerName: string;
    quoteNumber: string;
    quoteTotal: number;
    validUntil: Date;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        tax?: number;
        description?: string;
    }>;
    taxPerItem?: boolean;
    transportInfo?: {
        cost: number;
        description?: string;
    };
    estimatedDelivery?: string;
    discount?: number;
    discountType?: 'percentage' | 'fixed';
    tax?: number;
    subtotal?: number;
    notes?: string;
    terms?: string;
}
export interface InvoiceData {
    to: string;
    customerName: string;
    invoiceNumber: string;
    invoiceTotal: number;
    dueDate: Date;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        tax?: number;
        description?: string;
    }>;
    taxPerItem?: boolean;
    transportInfo?: {
        cost: number;
        description?: string;
    };
    estimatedDelivery?: string;
    discount?: number;
    discountType?: 'percentage' | 'fixed';
    tax?: number;
    subtotal?: number;
    notes?: string;
    terms?: string;
    amountPaid?: number;
    balanceDue?: number;
}
export declare const sendEmail: (options: EmailOptions) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
export declare const sendEmailWithAttachment: (options: EmailOptions & {
    attachments?: Array<{
        filename: string;
        content: string;
        contentType?: string;
    }>;
}) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
export declare const sendContactEmail: (data: ContactEmailData) => Promise<{
    success: boolean;
    error?: undefined;
} | {
    success: boolean;
    error: any;
}>;
export declare const sendOrderConfirmation: (data: OrderEmailData) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
export declare const sendAdminOrderNotification: (data: AdminOrderNotificationData) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
export declare const sendWelcomeEmail: (email: string, name: string) => Promise<{
    success: boolean;
    error?: undefined;
} | {
    success: boolean;
    error: any;
}>;
export declare const sendPasswordResetEmail: (email: string, resetToken: string) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
export declare const sendOrderStatusUpdate: (data: OrderStatusUpdateData) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
export declare const sendPaymentConfirmation: (data: PaymentConfirmationData) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
export declare const sendPaymentFailedNotification: (data: PaymentFailedData) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
export declare const sendQuotation: (data: QuotationData) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
export declare const sendInvoice: (data: InvoiceData) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
//# sourceMappingURL=email.service.d.ts.map
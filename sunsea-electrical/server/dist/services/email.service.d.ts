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
/**
 * Send general email
 */
export declare const sendEmail: (options: EmailOptions) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
/**
 * Send email with attachment using Resend
 */
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
/**
 * Send contact form email (to admin + auto-reply to user)
 */
export declare const sendContactEmail: (data: ContactEmailData) => Promise<{
    success: boolean;
    adminResult: {
        success: boolean;
        messageId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        messageId?: undefined;
    };
    userResult: {
        success: boolean;
        messageId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        messageId?: undefined;
    };
    error?: undefined;
} | {
    success: boolean;
    error: any;
    adminResult?: undefined;
    userResult?: undefined;
}>;
/**
 * Send order confirmation email to customer
 */
export declare const sendOrderConfirmation: (data: OrderEmailData) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
/**
 * Send admin notification for new order
 */
export declare const sendAdminOrderNotification: (data: AdminOrderNotificationData) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
/**
 * Send welcome email to new user
 */
export declare const sendWelcomeEmail: (email: string, name: string) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
/**
 * Send password reset email
 */
export declare const sendPasswordResetEmail: (email: string, resetToken: string) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
/**
 * Send payment confirmation email
 */
export declare const sendPaymentConfirmation: (data: {
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
}) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
/**
 * Send payment failed notification
 */
export declare const sendPaymentFailedNotification: (data: {
    email: string;
    customerName: string;
    orderNumber: string;
    amount: number;
    reason?: string;
}) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
/**
 * Send quotation email to customer - Premium Professional Design
 */
export declare const sendQuotation: (data: {
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
    shippingInfo?: {
        areaName: string;
        cost: number;
        freeThreshold?: number;
        estimatedDelivery?: string;
    };
    discount?: number;
    discountType?: "percentage" | "fixed";
    tax?: number;
    subtotal?: number;
    notes?: string;
    terms?: string;
}) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
/**
 * Send invoice email to customer - Premium Professional Design
 */
export declare const sendInvoice: (data: {
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
    discountType?: "percentage" | "fixed";
    tax?: number;
    subtotal?: number;
    notes?: string;
    terms?: string;
    amountPaid?: number;
    balanceDue?: number;
}) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
//# sourceMappingURL=email.service.d.ts.map
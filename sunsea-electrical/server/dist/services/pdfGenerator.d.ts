interface QuotationItem {
    name: string;
    description?: string;
    qty: number;
    price: number;
    customPrice?: boolean;
}
interface Quotation {
    _id: any;
    quoteNumber: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    customerLocation?: string;
    items: QuotationItem[];
    subtotal: number;
    discount: number;
    discountType: 'percentage' | 'fixed';
    tax: number;
    taxRate: number;
    total: number;
    shippingInfo?: {
        areaName: string;
        cost: number;
        estimatedDelivery?: string;
        freeThreshold?: number;
    };
    notes?: string;
    terms?: string;
    validUntil: Date;
    createdAt: Date;
    status: string;
}
interface Customer {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
}
interface CompanySettings {
    companyName?: string;
    slogan?: string;
    address?: string;
    phone?: string;
    email?: string;
    logo?: {
        url?: string;
        fileId?: string;
        type?: string;
    };
}
/**
 * Generate PDF buffer for quotation (server-side)
 * Uses puppeteer for reliable PDF generation on the server
 */
export declare function generateQuotationPDFBuffer(quotation: Quotation, customer: Customer, settings: CompanySettings | null): Promise<Buffer>;
export {};
//# sourceMappingURL=pdfGenerator.d.ts.map
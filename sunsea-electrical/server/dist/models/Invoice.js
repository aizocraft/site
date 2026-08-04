"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceNumber = generateInvoiceNumber;
// models/Invoice.ts - Updated with profit tracking
const mongoose_1 = __importStar(require("mongoose"));
const QuoteNumberCounter_1 = __importDefault(require("./QuoteNumberCounter"));
const invoiceItemSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    slug: { type: String },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    buyingPrice: { type: Number, default: 0, min: 0 },
    profitPerItem: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0 },
    taxable: { type: Boolean, default: true },
    description: { type: String }
}, { _id: false });
const transportInfoSchema = new mongoose_1.Schema({
    cost: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, trim: true }
}, { _id: false });
const paymentSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, required: true },
    reference: { type: String },
    date: { type: Date, default: Date.now },
    recordedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    transactionId: { type: String }
});
const invoiceSchema = new mongoose_1.Schema({
    quotationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Quotation', required: true, index: true },
    quotationNumber: { type: String, required: true },
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', index: true },
    orderCreatedAt: { type: Date },
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SalesCustomer', required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, lowercase: true, trim: true },
    customerPhone: { type: String, trim: true },
    customerLocation: { type: String, trim: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: { type: String },
    items: { type: [invoiceItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    totalCost: { type: Number, default: 0, min: 0 },
    totalProfit: { type: Number, default: 0, min: 0 },
    taxRate: { type: Number, required: true, min: 0, max: 1 },
    tax: { type: Number, required: true, min: 0 },
    taxPerItem: { type: Boolean, default: false },
    discount: { type: Number, required: true, min: 0 },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    transportInfo: { type: transportInfoSchema },
    transportCost: { type: Number, default: 0 },
    transportDescription: { type: String },
    total: { type: Number, required: true, min: 0 },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled'],
        default: 'draft',
        index: true
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'partially_paid', 'paid', 'overpaid'],
        default: 'unpaid'
    },
    amountPaid: { type: Number, default: 0, min: 0 },
    balanceDue: { type: Number, default: 0, min: 0 },
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    notes: { type: String, trim: true },
    terms: { type: String, trim: true },
    payments: [paymentSchema],
    sentAt: { type: Date }
}, { timestamps: true });
// Pre-save middleware to calculate totals including profit
invoiceSchema.pre('save', function (next) {
    // Calculate profit metrics for items
    if (this.isModified('items')) {
        this.subtotal = 0;
        this.totalCost = 0;
        this.totalProfit = 0;
        for (const item of this.items) {
            const itemTotal = item.price * item.qty;
            const itemCost = (item.buyingPrice || 0) * item.qty;
            const itemProfit = itemTotal - itemCost;
            item.total = itemTotal;
            item.totalProfit = itemProfit;
            item.profitPerItem = item.price - (item.buyingPrice || 0);
            this.subtotal += itemTotal;
            this.totalCost += itemCost;
            this.totalProfit += itemProfit;
        }
    }
    // Calculate balance due
    if (this.isModified('amountPaid') || this.isModified('total')) {
        this.balanceDue = Math.max(0, this.total - this.amountPaid);
        if (this.amountPaid === 0) {
            this.paymentStatus = 'unpaid';
        }
        else if (this.amountPaid < this.total) {
            this.paymentStatus = 'partially_paid';
        }
        else if (this.amountPaid === this.total) {
            this.paymentStatus = 'paid';
            if (this.status === 'draft' || this.status === 'sent') {
                this.status = 'paid';
            }
        }
        else {
            this.paymentStatus = 'overpaid';
        }
    }
    next();
});
// Generate invoice number
async function generateInvoiceNumber(date = new Date()) {
    const year = date.getFullYear();
    const monthNumber = date.getMonth() + 1;
    const month = String(monthNumber).padStart(2, '0');
    const counter = await QuoteNumberCounter_1.default.findOneAndUpdate({ year, month: monthNumber, type: 'invoice' }, { $inc: { sequence: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    const sequence = String(counter.sequence).padStart(4, '0');
    return `${sequence}-${month}-PSMA/I`;
}
const InvoiceModel = mongoose_1.default.model('Invoice', invoiceSchema);
exports.default = InvoiceModel;
//# sourceMappingURL=Invoice.js.map
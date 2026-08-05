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
exports.generateQuoteNumber = generateQuoteNumber;
const mongoose_1 = __importStar(require("mongoose"));
const QuoteNumberCounter_1 = __importDefault(require("./QuoteNumberCounter"));
const quotationItemSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    slug: { type: String },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    buyingPrice: { type: Number, default: 0, min: 0 },
    profitPerItem: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    customPrice: { type: Boolean, default: false },
    taxable: { type: Boolean, default: true },
    image: { type: String },
    description: { type: String }
}, { _id: false });
const transportInfoSchema = new mongoose_1.Schema({
    cost: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, trim: true }
}, { _id: false });
const quotationSchema = new mongoose_1.Schema({
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SalesCustomer', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, lowercase: true, trim: true },
    customerPhone: { type: String, trim: true },
    customerLocation: { type: String, trim: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: { type: String },
    invoiceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Invoice', required: false },
    invoiceNumber: { type: String, required: false },
    lastInvoiceCreatedAt: { type: Date, required: false },
    items: { type: [quotationItemSchema], required: true, validate: {
            validator: function (items) {
                return items && items.length > 0;
            },
            message: 'At least one item is required'
        } },
    subtotal: { type: Number, required: true, min: 0 },
    totalCost: { type: Number, default: 0, min: 0 },
    totalProfit: { type: Number, default: 0, min: 0 },
    taxRate: { type: Number, required: true, min: 0, max: 1 },
    tax: { type: Number, required: true, min: 0 },
    taxPerItem: { type: Boolean, default: false },
    discount: { type: Number, required: true, min: 0 },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountReason: { type: String },
    transportInfo: { type: transportInfoSchema },
    transportCost: { type: Number, default: 0, min: 0 },
    transportDescription: { type: String, trim: true },
    estimatedDelivery: { type: String, trim: true },
    total: { type: Number, required: true, min: 0 },
    quoteNumber: { type: String, required: true, unique: true }, // unique creates index automatically
    status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
        default: 'draft'
    },
    validUntil: { type: Date, required: true },
    notes: { type: String, trim: true },
    terms: { type: String, trim: true },
    acceptedAt: { type: Date },
    sentAt: { type: Date },
    rejectedAt: { type: Date },
    rejectedReason: { type: String }
}, { timestamps: true });
// Only define NON-unique indexes here
// DO NOT redefine quoteNumber since it already has 'unique: true'
quotationSchema.index({ customerId: 1 });
quotationSchema.index({ createdBy: 1 });
quotationSchema.index({ status: 1 });
quotationSchema.index({ validUntil: 1 });
quotationSchema.index({ createdAt: -1 });
// Pre-save middleware
quotationSchema.pre('save', function (next) {
    var _a;
    if (this.isModified('items') || this.isModified('discount') || this.isModified('discountType') ||
        this.isModified('transportInfo') || this.isModified('taxPerItem')) {
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
        let discountAmount = this.discount;
        if (this.discountType === 'percentage') {
            discountAmount = this.subtotal * (this.discount / 100);
        }
        let tax = 0;
        if (this.taxPerItem) {
            tax = this.items.reduce((sum, item) => sum + (item.tax || 0), 0);
        }
        else {
            const taxableAmount = Math.max(0, this.subtotal - discountAmount);
            tax = taxableAmount * this.taxRate;
        }
        this.tax = tax;
        const transportCost = ((_a = this.transportInfo) === null || _a === void 0 ? void 0 : _a.cost) || this.transportCost || 0;
        this.total = this.subtotal - discountAmount + this.tax + transportCost;
    }
    next();
});
async function generateQuoteNumber(date = new Date()) {
    const year = date.getFullYear();
    const monthNumber = date.getMonth() + 1;
    const month = String(monthNumber).padStart(2, '0');
    const counter = await QuoteNumberCounter_1.default.findOneAndUpdate({ year, month: monthNumber, type: 'quotation' }, { $inc: { sequence: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    const sequence = String(counter.sequence).padStart(4, '0');
    return `${sequence}-${month}-PSMA/Q`;
}
const QuotationModel = mongoose_1.default.model('Quotation', quotationSchema);
exports.default = QuotationModel;
//# sourceMappingURL=Quotation.js.map
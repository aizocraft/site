"use strict";
// src/models/Product.ts - Updated with proper method typing
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSKU = generateSKU;
const mongoose_1 = __importStar(require("mongoose"));
// SKU Generation Function
function generateSKU(category, existingSkus = []) {
    // Get first 3 letters of category (uppercase)
    let prefix = (category || 'GEN').substring(0, 3).toUpperCase();
    // Ensure prefix is exactly 3 characters
    if (prefix.length < 3) {
        prefix = prefix.padEnd(3, 'X');
    }
    // Generate sequential number (3 digits)
    const existingNumbers = existingSkus
        .filter(sku => sku.startsWith(`${prefix}-`))
        .map(sku => parseInt(sku.split('-')[1] || '0'))
        .filter(num => !isNaN(num));
    let nextNumber = 1;
    if (existingNumbers.length > 0) {
        nextNumber = Math.max(...existingNumbers) + 1;
    }
    const paddedNumber = nextNumber.toString().padStart(3, '0');
    return `${prefix}-${paddedNumber}`;
}
const BuyingPriceHistorySchema = new mongoose_1.Schema({
    price: { type: Number, required: true },
    effectiveFrom: { type: Date, default: Date.now },
    effectiveTo: { type: Date },
    changedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String }
});
const ImageSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['url', 'gridfs'],
        default: 'url',
        required: true
    },
    url: { type: String },
    fileId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'fs.files' },
    filename: String,
    mimeType: String
});
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: false, unique: true, sparse: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: false, index: true },
    brand: { type: String, required: false },
    type: { type: String, required: false },
    price: { type: Number, required: true },
    buyingPrice: { type: Number, required: true, default: 0 },
    compareAtPrice: { type: Number, default: null },
    description: { type: String },
    specs: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    stock: { type: Number, default: 0 },
    images: [ImageSchema],
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    tags: { type: [String], default: [] },
    supplier: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Supplier' },
    supplierName: { type: String },
    buyingPriceHistory: [BuyingPriceHistorySchema]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Virtual for profit margin percentage
productSchema.virtual('profitMargin').get(function () {
    if (this.buyingPrice && this.price) {
        return ((this.price - this.buyingPrice) / this.price) * 100;
    }
    return 0;
});
// Virtual for profit amount
productSchema.virtual('profitAmount').get(function () {
    return (this.price || 0) - (this.buyingPrice || 0);
});
// Virtual for margin percentage (based on cost)
productSchema.virtual('marginPercentage').get(function () {
    if (this.buyingPrice && this.price) {
        return ((this.price - this.buyingPrice) / this.buyingPrice) * 100;
    }
    return 0;
});
// Virtual for image URLs
productSchema.virtual('imageUrls').get(function () {
    return this.images.map(img => {
        if (img.type === 'url')
            return img.url;
        if (img.type === 'gridfs' && img.fileId) {
            return `/api/products/image/${img.fileId}`;
        }
        return '';
    }).filter(Boolean);
});
// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function () {
    if (this.compareAtPrice && this.compareAtPrice > this.price) {
        return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
    }
    return 0;
});
// Method to update buying price with history tracking
productSchema.methods.updateBuyingPrice = async function (newPrice, userId, reason) {
    if (this.buyingPrice === newPrice) {
        return false;
    }
    // Close current price history
    const currentHistory = this.buyingPriceHistory.find(h => !h.effectiveTo);
    if (currentHistory) {
        currentHistory.effectiveTo = new Date();
    }
    // Add new price history
    this.buyingPriceHistory.push({
        price: newPrice,
        effectiveFrom: new Date(),
        changedBy: userId,
        reason: reason || 'Price update'
    });
    this.buyingPrice = newPrice;
    await this.save();
    return true;
};
// Pre-save hook to generate SKU if not provided
productSchema.pre('save', async function (next) {
    if (!this.sku) {
        const ProductModel = mongoose_1.default.model('Product');
        // Get existing SKUs for this category
        const existingProducts = await ProductModel.find({
            category: this.category,
            sku: { $regex: `^${(this.category || 'GEN').substring(0, 3).toUpperCase()}-` }
        }).select('sku');
        const existingSkus = existingProducts.map(p => p.sku);
        this.sku = generateSKU(this.category || 'GEN', existingSkus);
    }
    next();
});
// Create and export the model with proper typing
const ProductModel = mongoose_1.default.model('Product', productSchema);
exports.default = ProductModel;
//# sourceMappingURL=Product.js.map
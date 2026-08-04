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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const transactionSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: 'Order',
        required: true,
        index: true
    },
    invoiceNumber: { type: String, index: true },
    quotationNumber: { type: String, index: true },
    userId: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: 'User' },
    guestEmail: String,
    guestPhone: String,
    customerName: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'KES' },
    paymentMethod: {
        type: String,
        enum: ['mpesa', 'card', 'cod', 'cash', 'bank_transfer', 'cheque'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: { type: String, required: true, unique: true },
    mpesaReceipt: String,
    cardLast4: String,
    cardBrand: String,
    reference: String,
    notes: String,
    recordedBy: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: 'User' },
    recordedByName: String,
    source: {
        type: String,
        enum: ['checkout', 'quotation', 'admin', 'manual'],
        required: true,
        default: 'manual'
    },
    isPartialPayment: { type: Boolean, default: false },
    paidAt: { type: Date }
}, { timestamps: true });
// Indexes
transactionSchema.index({ status: 1 });
transactionSchema.index({ paymentMethod: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ orderId: 1, status: 1 });
transactionSchema.index({ invoiceNumber: 1 });
transactionSchema.index({ source: 1 });
const TransactionModel = mongoose_1.default.model('Transaction', transactionSchema);
exports.default = TransactionModel;
//# sourceMappingURL=Transaction.js.map
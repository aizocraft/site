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
// src/models/Transaction.ts
const mongoose_1 = __importStar(require("mongoose"));
const transactionSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        required: false,
        index: true
    },
    orderNumber: {
        type: String,
        index: true,
        trim: true
    },
    invoiceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: false,
        index: true
    },
    invoiceNumber: {
        type: String,
        index: true,
        trim: true
    },
    quotationNumber: {
        type: String,
        index: true,
        trim: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    guestEmail: {
        type: String,
        lowercase: true,
        trim: true,
        index: true
    },
    guestPhone: {
        type: String,
        trim: true,
        index: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'KES'
    },
    paymentMethod: {
        type: String,
        enum: ['mpesa', 'card', 'cod', 'cash', 'bank_transfer', 'cheque'],
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
        index: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    mpesaReceipt: {
        type: String,
        index: true
    },
    cardLast4: String,
    cardBrand: String,
    reference: {
        type: String,
        index: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    recordedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    recordedByName: {
        type: String,
        trim: true
    },
    source: {
        type: String,
        enum: ['checkout', 'quotation', 'admin', 'manual', 'invoice', 'order', 'pos'],
        required: true,
        default: 'manual',
        index: true
    },
    isPartialPayment: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date,
        index: true
    },
    // Refund tracking fields
    refundedAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    refundedAt: Date,
    refundReason: {
        type: String,
        trim: true
    },
    parentTransactionId: {
        type: String,
        index: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Compound indexes for common queries
transactionSchema.index({ orderId: 1, status: 1 });
transactionSchema.index({ orderNumber: 1, status: 1 });
transactionSchema.index({ invoiceNumber: 1, status: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ paymentMethod: 1, status: 1 });
transactionSchema.index({ source: 1, status: 1 });
// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function () {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: this.currency || 'KES'
    }).format(this.amount);
});
// Virtual for isRefund
transactionSchema.virtual('isRefund').get(function () {
    return this.status === 'refunded' || this.amount < 0;
});
// Pre-save middleware to ensure orderNumber is populated
transactionSchema.pre('save', async function (next) {
    // If orderId is present but orderNumber is missing, fetch it
    if (this.orderId && !this.orderNumber) {
        try {
            const OrderModel = mongoose_1.default.model('Order');
            const order = await OrderModel.findById(this.orderId).select('orderNumber');
            if (order && order.orderNumber) {
                this.orderNumber = order.orderNumber;
            }
        }
        catch (error) {
            console.error('Failed to populate orderNumber:', error);
        }
    }
    // Set paidAt if status is completed and not already set
    if (this.status === 'completed' && !this.paidAt) {
        this.paidAt = new Date();
    }
    next();
});
// ✅ Static method to generate transaction ID
transactionSchema.statics.generateTransactionId = function (prefix = 'TXN', source = 'manual') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sourcePrefix = source.substring(0, 3).toUpperCase();
    return `${prefix}-${sourcePrefix}-${timestamp}-${random}`;
};
const TransactionModel = mongoose_1.default.model('Transaction', transactionSchema);
exports.default = TransactionModel;
//# sourceMappingURL=Transaction.js.map
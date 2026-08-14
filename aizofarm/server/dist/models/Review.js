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
const reviewSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Minimum rating is 1'],
        max: [5, 'Maximum rating is 5']
    },
    review: {
        type: String,
        maxlength: [1000, 'Review cannot exceed 1000 characters'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});
// Compound unique index: one review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
// Indexes for dashboard queries
reviewSchema.index({ status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ productId: 1, status: 1 }); // ✅ Added for better query performance
reviewSchema.index({ review: 'text' });
// Virtual property for isApproved (derived from status)
reviewSchema.virtual('isApproved').get(function () {
    return this.status === 'approved';
});
// Ensure virtuals are included in JSON output
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });
reviewSchema.methods.toJSON = function () {
    const review = this.toObject();
    review.id = review._id;
    delete review._id;
    delete review.__v;
    return review;
};
const ReviewModel = mongoose_1.default.model('Review', reviewSchema);
exports.default = ReviewModel;
//# sourceMappingURL=Review.js.map
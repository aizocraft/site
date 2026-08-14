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
exports.Feedback = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const FeedbackSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
        // Removed required
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
        // Removed required
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['product', 'service', 'shipping', 'website', 'customer-support', 'other'],
        default: 'product'
    },
    feedback: {
        type: String,
        required: [true, 'Feedback is required'],
        trim: true,
        maxlength: [2000, 'Feedback cannot exceed 2000 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    userAgent: {
        type: String,
        trim: true
    },
    ipAddress: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});
// Indexes for better query performance
FeedbackSchema.index({ status: 1, createdAt: -1 });
FeedbackSchema.index({ rating: 1 });
FeedbackSchema.index({ category: 1 });
exports.Feedback = mongoose_1.default.models.Feedback || mongoose_1.default.model('Feedback', FeedbackSchema);
//# sourceMappingURL=Feedback.js.map
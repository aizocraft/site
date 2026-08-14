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
exports.Contact = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ContactSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
        // Removed required - either email or phone can be provided
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number']
        // Added phone field
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        maxlength: [5000, 'Message cannot exceed 5000 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'read', 'replied', 'spam'],
        default: 'pending'
    },
    userAgent: {
        type: String,
        trim: true
    },
    ipAddress: {
        type: String,
        trim: true
    },
    repliedAt: {
        type: Date
    },
    repliedBy: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
}, {
    timestamps: true
});
// Validate that either email or phone is provided
ContactSchema.pre('validate', function (next) {
    if (!this.email && !this.phone) {
        next(new Error('Either email or phone number is required'));
    }
    else {
        next();
    }
});
// Indexes
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1 });
ContactSchema.index({ phone: 1 });
ContactSchema.index({ createdAt: -1 });
exports.Contact = mongoose_1.default.models.Contact || mongoose_1.default.model('Contact', ContactSchema);
//# sourceMappingURL=Contact.js.map
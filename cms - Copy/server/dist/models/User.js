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
// server/models/User.ts
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
    },
    password: {
        type: String,
        minlength: 6,
        required: function () {
            return this.provider === 'local';
        }
    },
    role: {
        type: String,
        enum: ['user', 'sales', 'admin'],
        default: 'user'
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number']
    },
    avatar: {
        type: String,
        match: [/^(https?:\/\/.*|[\w\.\-\s]+)$/i, 'Avatar must be valid URL or GridFS filename']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: { type: Date },
    // Google Auth fields
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {
    timestamps: true
});
// Hash password pre-save (only for local provider) - also clear reset fields on password change
userSchema.pre('save', async function (next) {
    // Clear reset fields when password is changed
    if (this.isModified('password')) {
        this.resetPasswordToken = undefined;
        this.resetPasswordExpires = undefined;
    }
    // Only hash password if provider is local and password is modified
    if (this.provider === 'local' && this.isModified('password') && this.password) {
        try {
            const salt = await bcryptjs_1.default.genSalt(12);
            this.password = await bcryptjs_1.default.hash(this.password, salt);
            next();
        }
        catch (error) {
            next(error);
        }
    }
    else {
        next();
    }
});
// Compare password method (only for local provider)
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (this.provider !== 'local' || !this.password)
        return false;
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
const UserModel = mongoose_1.default.model('User', userSchema);
exports.default = UserModel;
//# sourceMappingURL=User.js.map
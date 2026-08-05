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
exports.CompanySettings = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEFAULT_LOGO_URL = process.env.DEFAULT_LOGO_URL || 'https://res.cloudinary.com/duxnsu61a/image/upload/v1775217946/logo_upxr11.png';
// Define sub-schemas to avoid nesting issues
const LogoSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['url', 'gridfs'],
        default: 'url'
    },
    url: {
        type: String,
        default: DEFAULT_LOGO_URL
    },
    fileId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'fs.files'
    },
    filename: String,
    mimeType: String
}, { _id: false });
const FaviconSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['url', 'gridfs']
    },
    url: String,
    fileId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'fs.files'
    },
    filename: String,
    mimeType: String
}, { _id: false });
const companySettingsSchema = new mongoose_1.Schema({
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name too long'],
        default: 'My Company'
    },
    slogan: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    website: { type: String, trim: true, default: '' },
    footerText: { type: String, trim: true, default: '' },
    socialLinks: {
        type: [{
                platform: { type: String, required: true },
                url: { type: String, required: true }
            }],
        default: []
    }, taxRate: {
        type: Number,
        default: 0.16,
        min: [0, 'Tax rate cannot be negative'],
        max: [1, 'Tax rate cannot exceed 100%']
    },
    taxExemptCategories: { type: [String], default: ['Solar Panels', 'Solar Lights', 'Inverters'] },
    logo: {
        type: LogoSchema,
        default: () => ({
            type: 'url',
            url: DEFAULT_LOGO_URL
        })
    },
    favicon: {
        type: FaviconSchema,
        default: null
    },
    themeColors: {
        light: {
            primary: { type: String, default: '#000063', trim: true },
            primaryForeground: { type: String, default: '#ffffff', trim: true },
            primaryMid: { type: String, default: '#0043b3', trim: true },
            primaryLight: { type: String, default: '#009dff', trim: true }
        },
        dark: {
            primary: { type: String, default: '#000063', trim: true },
            primaryForeground: { type: String, default: '#ffffff', trim: true },
            primaryMid: { type: String, default: '#0043b3', trim: true },
            primaryLight: { type: String, default: '#009dff', trim: true }
        }
    }
}, {
    timestamps: true,
    minimize: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
companySettingsSchema.index({ updatedAt: -1 });
companySettingsSchema.statics.getSingleton = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};
// Clear existing model if in development to prevent conflicts
if (process.env.NODE_ENV !== 'production' && mongoose_1.default.models.CompanySettings) {
    delete mongoose_1.default.models.CompanySettings;
}
exports.CompanySettings = (mongoose_1.default.models.CompanySettings ||
    mongoose_1.default.model('CompanySettings', companySettingsSchema));
//# sourceMappingURL=CompanySettings.js.map
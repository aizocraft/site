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
// src/models/ProfitAnalysis.ts
const mongoose_1 = __importStar(require("mongoose"));
const PeriodProfitSchema = new mongoose_1.Schema({
    period: { type: String, required: true },
    unitsSold: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    margin: { type: Number, default: 0 }
});
const ProfitAnalysisSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
    productName: { type: String, required: true },
    productSku: { type: String, required: true },
    category: { type: String, index: true },
    brand: { type: String },
    supplierId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Supplier' },
    supplierName: { type: String },
    totalUnitsSold: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    averageSellingPrice: { type: Number, default: 0 },
    averageBuyingPrice: { type: Number, default: 0 },
    averageProfitMargin: { type: Number, default: 0 },
    averageMarkup: { type: Number, default: 0 },
    daily: [PeriodProfitSchema],
    weekly: [PeriodProfitSchema],
    monthly: [PeriodProfitSchema],
    quarterly: [PeriodProfitSchema],
    lastCalculated: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// Indexes for efficient filtering
ProfitAnalysisSchema.index({ category: 1 });
ProfitAnalysisSchema.index({ supplierId: 1 });
ProfitAnalysisSchema.index({ brand: 1 });
ProfitAnalysisSchema.index({ totalProfit: -1 });
ProfitAnalysisSchema.index({ averageProfitMargin: -1 });
const ProfitAnalysisModel = mongoose_1.default.model('ProfitAnalysis', ProfitAnalysisSchema);
exports.default = ProfitAnalysisModel;
//# sourceMappingURL=ProfitAnalysis.js.map
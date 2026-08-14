import mongoose, { Document } from 'mongoose';
export interface IProfitAnalysis extends Document {
    productId: mongoose.Types.ObjectId;
    productName: string;
    productSku: string;
    category?: string;
    brand?: string;
    supplierId?: mongoose.Types.ObjectId;
    supplierName?: string;
    totalUnitsSold: number;
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    averageSellingPrice: number;
    averageBuyingPrice: number;
    averageProfitMargin: number;
    averageMarkup: number;
    daily: IPeriodProfit[];
    weekly: IPeriodProfit[];
    monthly: IPeriodProfit[];
    quarterly: IPeriodProfit[];
    lastCalculated: Date;
}
export interface IPeriodProfit {
    period: string;
    unitsSold: number;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
}
declare const ProfitAnalysisModel: mongoose.Model<IProfitAnalysis, {}, {}, {}, mongoose.Document<unknown, {}, IProfitAnalysis, {}, {}> & IProfitAnalysis & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ProfitAnalysisModel;
//# sourceMappingURL=ProfitAnalysis.d.ts.map
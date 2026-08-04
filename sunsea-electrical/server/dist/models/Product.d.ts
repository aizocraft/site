import mongoose, { Document, Model } from 'mongoose';
export interface Image {
    type: 'url' | 'gridfs';
    url?: string;
    fileId?: mongoose.Types.ObjectId;
    filename?: string;
    mimeType?: string;
}
export interface IBuyingPriceHistory {
    price: number;
    effectiveFrom: Date;
    effectiveTo?: Date;
    changedBy: mongoose.Types.ObjectId;
    reason?: string;
}
export interface IProduct extends Document {
    name: string;
    slug?: string;
    sku: string;
    category?: string;
    brand?: string;
    type?: string;
    price: number;
    buyingPrice: number;
    compareAtPrice?: number;
    description?: string;
    specs: any;
    stock: number;
    images: Image[];
    featured: boolean;
    rating: number;
    tags: string[];
    supplier?: mongoose.Types.ObjectId;
    supplierName?: string;
    buyingPriceHistory: IBuyingPriceHistory[];
    createdAt: Date;
    updatedAt: Date;
    profitMargin: number;
    profitAmount: number;
    marginPercentage: number;
    imageUrls: string[];
    discountPercent: number;
    updateBuyingPrice(newPrice: number, userId: mongoose.Types.ObjectId, reason?: string): Promise<boolean>;
}
export interface IProductModel extends Model<IProduct> {
    generateSKU(category: string, existingSkus?: string[]): string;
}
export declare function generateSKU(category: string, existingSkus?: string[]): string;
declare const ProductModel: IProductModel;
export default ProductModel;
//# sourceMappingURL=Product.d.ts.map
import { Document, Model } from 'mongoose';
export interface IPromoCode extends Document {
    code: string;
    type: 'percent' | 'fixed';
    value: number;
    maxUses: number;
    usedCount: number;
    minSubtotal: number;
    expiryDate?: Date;
    isActive: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    canUse(subtotal: number): boolean;
}
interface IPromoModel extends Model<IPromoCode> {
}
declare const _default: IPromoModel;
export default _default;
//# sourceMappingURL=PromoCode.d.ts.map
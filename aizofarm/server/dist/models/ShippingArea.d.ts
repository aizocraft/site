import { Document, Model } from 'mongoose';
export interface IShippingArea extends Document {
    name: string;
    regions: string[];
    baseCost: number;
    freeThreshold: number;
    isActive: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
interface IShippingAreaModel extends Model<IShippingArea> {
}
declare const _default: IShippingAreaModel;
export default _default;
//# sourceMappingURL=ShippingArea.d.ts.map
import mongoose, { Document } from 'mongoose';
export interface ISupplier extends Document {
    name: string;
    email?: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
    };
    taxId?: string;
    paymentTerms?: string;
    leadTime?: number;
    notes?: string;
    status: 'active' | 'inactive';
    productsSupplied?: mongoose.Types.ObjectId[];
    totalPurchases: number;
    lastPurchaseDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
}
declare const SupplierModel: mongoose.Model<ISupplier, {}, {}, {}, mongoose.Document<unknown, {}, ISupplier, {}, {}> & ISupplier & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default SupplierModel;
//# sourceMappingURL=Supplier.d.ts.map
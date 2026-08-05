import mongoose, { Document, Model } from 'mongoose';
export interface ISalesCustomer extends Document {
    user?: mongoose.Types.ObjectId;
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    notes?: string;
    totalSpent: number;
    lastOrder?: mongoose.Types.ObjectId;
    status: 'active' | 'inactive';
    createdBy: mongoose.Types.ObjectId;
}
interface SalesCustomerModel extends Model<ISalesCustomer> {
}
declare const SalesCustomerModel: Model<ISalesCustomer>;
export default SalesCustomerModel;
//# sourceMappingURL=SalesCustomer.d.ts.map
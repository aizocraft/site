import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMaterial extends Document {
  materialCode: string;
  name: string;
  category: string;
  site?: mongoose.Types.ObjectId;
  siteName?: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  unitCost: number;
  totalValue: number;
  lastDelivery: Date;
  supplier?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const materialSchema = new Schema<IMaterial>({
  materialCode: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, default: 'Concrete' },
  site: { type: Schema.Types.ObjectId, ref: 'ConstructionSite' },
  siteName: { type: String, trim: true },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: 'Units' },
  reorderLevel: { type: Number, default: 0 },
  unitCost: { type: Number, default: 0 },
  totalValue: { type: Number, default: 0 },
  lastDelivery: { type: Date },
  supplier: { type: String, trim: true },
  status: { type: String, enum: ['in_stock', 'low_stock', 'out_of_stock'], default: 'in_stock' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const MaterialModel: Model<IMaterial> = mongoose.model<IMaterial>('Material', materialSchema);
export default MaterialModel;

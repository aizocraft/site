import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IConstructionSupplier extends Document {
  supplierCode: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: string;
  paymentTerms?: string;
  leadTime?: number; // days
  status: 'active' | 'inactive';
  totalPurchases: number;
  rating?: number; // 1-5
  notes?: string;
  ownedBy: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const constructionSupplierSchema = new Schema<IConstructionSupplier>({
  supplierCode: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  category: { type: String, trim: true },
  paymentTerms: { type: String, trim: true },
  leadTime: { type: Number, default: 7, min: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  totalPurchases: { type: Number, default: 0, min: 0 },
  rating: { type: Number, min: 1, max: 5 },
  notes: { type: String, trim: true },
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

constructionSupplierSchema.index({ ownedBy: 1 });
constructionSupplierSchema.index({ status: 1 });

constructionSupplierSchema.pre('save', function(next) {
  if (!this.supplierCode) {
    this.supplierCode = `SUP${Date.now().toString().slice(-5)}`;
  }
  next();
});

const ConstructionSupplierModel: Model<IConstructionSupplier> = mongoose.models.ConstructionSupplier || mongoose.model<IConstructionSupplier>('ConstructionSupplier', constructionSupplierSchema);
export default ConstructionSupplierModel;

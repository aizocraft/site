import mongoose, { Document, Model, Schema } from 'mongoose';

export type MaterialCategory = 'Concrete' | 'Steel' | 'Aggregate' | 'Masonry' | 'Plumbing' | 'Electrical' | 'Formwork' | 'Roofing' | 'Finishing' | 'Safety' | 'Other';
export type MaterialStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  'Concrete', 'Steel', 'Aggregate', 'Masonry', 'Plumbing', 'Electrical',
  'Formwork', 'Roofing', 'Finishing', 'Safety', 'Other'
];

export interface IConstructionMaterial extends Document {
  materialCode: string; // M001...
  name: string;
  category: MaterialCategory;
  site?: mongoose.Types.ObjectId;
  siteName?: string;
  stock: number;
  unit: string; // Bags, Tonnes, Pieces, Lengths, Metres, Sheets
  reorderLevel: number;
  unitCost: number;
  totalValue: number; // computed
  lastDelivery?: Date;
  supplier?: mongoose.Types.ObjectId;
  supplierName?: string;
  status: MaterialStatus;
  ownedBy: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const constructionMaterialSchema = new Schema<IConstructionMaterial>({
  materialCode: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: MATERIAL_CATEGORIES, required: true },
  site: { type: Schema.Types.ObjectId, ref: 'ConstructionSite' },
  siteName: { type: String, trim: true },
  stock: { type: Number, default: 0, min: 0 },
  unit: { type: String, default: 'pcs' },
  reorderLevel: { type: Number, default: 10, min: 0 },
  unitCost: { type: Number, default: 0, min: 0 },
  totalValue: { type: Number, default: 0, min: 0 },
  lastDelivery: { type: Date },
  supplier: { type: Schema.Types.ObjectId, ref: 'ConstructionSupplier' },
  supplierName: { type: String, trim: true },
  status: { type: String, enum: ['in_stock', 'low_stock', 'out_of_stock'], default: 'in_stock' },
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

constructionMaterialSchema.index({ ownedBy: 1 });
constructionMaterialSchema.index({ site: 1 });
constructionMaterialSchema.index({ status: 1 });
constructionMaterialSchema.index({ category: 1 });

// Compute total value + auto status based on stock vs reorder level
constructionMaterialSchema.pre('save', function(next) {
  this.totalValue = Math.round((this.stock || 0) * (this.unitCost || 0));
  if (this.stock <= 0) {
    this.status = 'out_of_stock';
  } else if (this.stock <= this.reorderLevel) {
    this.status = 'low_stock';
  } else {
    this.status = 'in_stock';
  }
  next();
});

const ConstructionMaterialModel: Model<IConstructionMaterial> = mongoose.models.ConstructionMaterial || mongoose.model<IConstructionMaterial>('ConstructionMaterial', constructionMaterialSchema);
export default ConstructionMaterialModel;

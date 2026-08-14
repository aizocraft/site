import mongoose, { Document, Model, Schema } from 'mongoose';

export type ConstructionQuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type ConstructionInvoiceStatus = 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';

export interface IConstructionDocItem {
  name: string;
  description?: string;
  qty: number;
  unit: string;
  price: number;
  total: number;
}

export interface IConstructionQuote extends Document {
  docNumber: string;
  type: 'quotation' | 'invoice';
  engineer: mongoose.Types.ObjectId;
  ownedBy: mongoose.Types.ObjectId;
  site?: mongoose.Types.ObjectId;
  siteName?: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
  items: IConstructionDocItem[];
  subtotal: number;
  taxRate: number;
  tax: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  transport: number;
  total: number;
  status: ConstructionQuoteStatus | ConstructionInvoiceStatus;
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  amountPaid: number;
  balanceDue: number;
  issueDate: Date;
  dueDate?: Date;
  notes?: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}

const constructionDocItemSchema = new Schema<IConstructionDocItem>({
  name: { type: String, required: true },
  description: { type: String, trim: true },
  qty: { type: Number, required: true, min: 0, default: 1 },
  unit: { type: String, default: 'pcs' },
  price: { type: Number, required: true, min: 0, default: 0 },
  total: { type: Number, default: 0 },
}, { _id: false });

const constructionQuoteSchema = new Schema<IConstructionQuote>({
  docNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ['quotation', 'invoice'], default: 'quotation' },
  engineer: { type: Schema.Types.ObjectId, ref: 'Engineer', required: true },
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  site: { type: Schema.Types.ObjectId, ref: 'ConstructionSite' },
  siteName: { type: String, trim: true },
  clientName: { type: String, required: true },
  clientPhone: { type: String, trim: true },
  clientEmail: { type: String, trim: true, lowercase: true },
  clientAddress: { type: String, trim: true },
  items: { type: [constructionDocItemSchema], required: true, validate: {
    validator: function(items: any[]) { return items && items.length > 0; },
    message: 'At least one item is required'
  } },
  subtotal: { type: Number, default: 0, min: 0 },
  taxRate: { type: Number, default: 0.075, min: 0, max: 1 },
  tax: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  transport: { type: Number, default: 0, min: 0 },
  total: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected', 'expired', 'paid', 'partially_paid', 'overdue', 'cancelled'], default: 'draft' },
  paymentStatus: { type: String, enum: ['unpaid', 'partially_paid', 'paid'], default: 'unpaid' },
  amountPaid: { type: Number, default: 0, min: 0 },
  balanceDue: { type: Number, default: 0, min: 0 },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  notes: { type: String, trim: true },
  terms: { type: String, trim: true },
}, { timestamps: true });

constructionQuoteSchema.index({ engineer: 1 });
constructionQuoteSchema.index({ ownedBy: 1 });
constructionQuoteSchema.index({ type: 1 });
constructionQuoteSchema.index({ status: 1 });

// Pre-save: compute totals
constructionQuoteSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.subtotal = 0;
    for (const item of this.items) {
      item.total = item.qty * item.price;
      this.subtotal += item.total;
    }
  }
  const discountAmount = this.discountType === 'percentage' ? this.subtotal * (this.discount / 100) : this.discount;
  this.tax = (this.subtotal - discountAmount) * this.taxRate;
  this.total = Math.max(0, this.subtotal - discountAmount + this.tax + this.transport);
  this.balanceDue = Math.max(0, this.total - this.amountPaid);
  next();
});

// Generate a sequential doc number per engineer
export async function generateConstructionDocNumber(type: 'quotation' | 'invoice', engineerId: string, prefix: string = 'BC'): Promise<string> {
  const model = mongoose.model<IConstructionQuote>('ConstructionQuote');
  const count = await model.countDocuments({ type, engineer: engineerId });
  const seq = String(count + 1).padStart(4, '0');
  const year = new Date().getFullYear();
  const label = type === 'quotation' ? 'Q' : 'INV';
  return `${prefix}-${label}-${year}-${seq}`;
}

const ConstructionQuoteModel: Model<IConstructionQuote> = mongoose.models.ConstructionQuote || mongoose.model<IConstructionQuote>('ConstructionQuote', constructionQuoteSchema);
export default ConstructionQuoteModel;

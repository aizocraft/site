import mongoose, { Document, Model, Schema } from 'mongoose';

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';
export type PaymentType = 'worker_wage' | 'engineer_salary' | 'material' | 'supplier' | 'other';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'mpesa' | 'cheque' | 'card';

export interface IConstructionPayment extends Document {
  paymentRef: string;
  type: PaymentType;
  recipientType: 'worker' | 'engineer' | 'supplier' | 'other';
  recipient?: mongoose.Types.ObjectId;
  recipientName: string;
  site?: mongoose.Types.ObjectId;
  siteName?: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  period?: string; // e.g. "Jan 1–15, 2025"
  payDate?: Date;
  dueDate?: Date;
  reference?: string;
  notes?: string;
  recordedBy: mongoose.Types.ObjectId;
  ownedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const constructionPaymentSchema = new Schema<IConstructionPayment>({
  paymentRef: { type: String, required: true },
  type: { type: String, enum: ['worker_wage', 'engineer_salary', 'material', 'supplier', 'other'], default: 'worker_wage' },
  recipientType: { type: String, enum: ['worker', 'engineer', 'supplier', 'other'], default: 'worker' },
  recipient: { type: Schema.Types.ObjectId },
  recipientName: { type: String, required: true, trim: true },
  site: { type: Schema.Types.ObjectId, ref: 'ConstructionSite' },
  siteName: { type: String, trim: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['paid', 'pending', 'overdue', 'cancelled'], default: 'pending' },
  method: { type: String, enum: ['cash', 'bank_transfer', 'mpesa', 'cheque', 'card'], default: 'cash' },
  period: { type: String, trim: true },
  payDate: { type: Date },
  dueDate: { type: Date },
  reference: { type: String, trim: true },
  notes: { type: String, trim: true },
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

constructionPaymentSchema.index({ ownedBy: 1 });
constructionPaymentSchema.index({ status: 1 });
constructionPaymentSchema.index({ recipient: 1 });
constructionPaymentSchema.index({ site: 1 });

constructionPaymentSchema.pre('save', function(next) {
  if (!this.paymentRef) {
    this.paymentRef = `PAY-${Date.now().toString().slice(-6)}`;
  }
  next();
});

const ConstructionPaymentModel: Model<IConstructionPayment> = mongoose.models.ConstructionPayment || mongoose.model<IConstructionPayment>('ConstructionPayment', constructionPaymentSchema);
export default ConstructionPaymentModel;

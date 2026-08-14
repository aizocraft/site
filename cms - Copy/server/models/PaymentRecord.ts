import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPaymentRecord extends Document {
  reference: string;
  recipientType: 'worker' | 'engineer' | 'supplier';
  recipient?: mongoose.Types.ObjectId;
  recipientName: string;
  site?: mongoose.Types.ObjectId;
  siteName?: string;
  amount: number;
  currency: string;
  periodStart: Date;
  periodEnd: Date;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: string;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const paymentRecordSchema = new Schema<IPaymentRecord>({
  reference: { type: String, required: true, unique: true },
  recipientType: { type: String, enum: ['worker', 'engineer', 'supplier'], required: true },
  recipient: { type: Schema.Types.ObjectId },
  recipientName: { type: String, required: true, trim: true },
  site: { type: Schema.Types.ObjectId, ref: 'ConstructionSite' },
  siteName: { type: String, trim: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'NGN' },
  periodStart: { type: Date },
  periodEnd: { type: Date },
  status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
  paymentMethod: { type: String, default: 'Cash' },
  notes: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const PaymentRecordModel: Model<IPaymentRecord> = mongoose.model<IPaymentRecord>('PaymentRecord', paymentRecordSchema);
export default PaymentRecordModel;

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEngineerSettings extends Document {
  engineer: mongoose.Types.ObjectId; // the engineer this belongs to
  ownedBy: mongoose.Types.ObjectId; // the user account
  companyName: string;
  slogan: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxRate: number;
  currency: string;
  // Quotation/invoice defaults
  quotePrefix: string;
  invoicePrefix: string;
  terms: string;
  notes: string;
  // Bank & payment details shown on PDFs
  bankName: string;
  accountName: string;
  accountNumber: string;
  tillNumber: string;
  mpesaNumber: string;
  signatureName: string;
  createdAt: Date;
  updatedAt: Date;
}

const engineerSettingsSchema = new Schema<IEngineerSettings>({
  engineer: { type: Schema.Types.ObjectId, ref: 'Engineer' },
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, trim: true, default: 'BuildCorp Construction' },
  slogan: { type: String, trim: true, default: 'Building Trust, Delivering Excellence' },
  logo: { type: String, default: '' },
  address: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, lowercase: true, default: '' },
  website: { type: String, trim: true, default: '' },
  taxRate: { type: Number, default: 0.075, min: 0, max: 1 },
  currency: { type: String, default: 'KES' },
  quotePrefix: { type: String, default: 'BC-Q' },
  invoicePrefix: { type: String, default: 'BC-INV' },
  terms: { type: String, default: 'Payment due within 30 days of invoice date.' },
  notes: { type: String, default: 'Thank you for your business.' },
  bankName: { type: String, default: '' },
  accountName: { type: String, default: '' },
  accountNumber: { type: String, default: '' },
  tillNumber: { type: String, default: '' },
  mpesaNumber: { type: String, default: '' },
  signatureName: { type: String, default: '' },
}, { timestamps: true });

// One settings per owner
engineerSettingsSchema.index({ ownedBy: 1 }, { unique: true });

const EngineerSettingsModel: Model<IEngineerSettings> = mongoose.model<IEngineerSettings>('EngineerSettings', engineerSettingsSchema);
export default EngineerSettingsModel;

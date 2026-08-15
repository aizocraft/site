import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IConstructionEngineer extends Document {
  engineerCode: string; // E001...
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  experienceYears: number;
  licenseNo?: string;
  monthlySalary: number;
  status: 'active' | 'inactive';
  assignedSites: mongoose.Types.ObjectId[];
  notes?: string;
  user?: mongoose.Types.ObjectId; // linked auth user account
  ownedBy: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const constructionEngineerSchema = new Schema<IConstructionEngineer>({
  engineerCode: { type: String, required: true, unique: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  experienceYears: { type: Number, default: 0, min: 0 },
  licenseNo: { type: String, trim: true },
  monthlySalary: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  assignedSites: [{ type: Schema.Types.ObjectId, ref: 'ConstructionSite' }],
  notes: { type: String, trim: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

constructionEngineerSchema.index({ ownedBy: 1 });
constructionEngineerSchema.index({ status: 1 });

constructionEngineerSchema.pre('save', async function(next) {
  if (!this.engineerCode) {
    const lastEngineer = await mongoose.models.ConstructionEngineer
      ?.findOne({}).sort({ createdAt: -1 }).lean();
    const lastNum = lastEngineer ? Number((lastEngineer.engineerCode || 'E000').replace(/\D/g, '')) || 0 : 0;
    this.engineerCode = `E${String(lastNum + 1).padStart(3, '0')}`;
  }
  next();
});

const ConstructionEngineerModel: Model<IConstructionEngineer> = mongoose.models.ConstructionEngineer || mongoose.model<IConstructionEngineer>('ConstructionEngineer', constructionEngineerSchema);
export default ConstructionEngineerModel;

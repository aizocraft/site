import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEngineer extends Document {
  engineerCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  experienceYears: number;
  licenseNo?: string;
  assignedSite?: mongoose.Types.ObjectId;
  assignedSiteName?: string;
  monthlySalary: number;
  status: 'active' | 'inactive';
  notes?: string;
  user?: mongoose.Types.ObjectId; // Link to auth user
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const engineerSchema = new Schema<IEngineer>({
  engineerCode: { type: String, required: true, unique: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  specialty: { type: String, default: 'Civil Engineering' },
  experienceYears: { type: Number, default: 0 },
  licenseNo: { type: String, trim: true },
  assignedSite: { type: Schema.Types.ObjectId, ref: 'ConstructionSite' },
  assignedSiteName: { type: String, trim: true },
  monthlySalary: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  notes: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Auto-generate engineer code
engineerSchema.pre('save', async function(next) {
  if (!this.engineerCode) {
    const lastEngineer = await mongoose.models.Engineer?.findOne()
      .sort({ createdAt: -1 })
      .lean() as { engineerCode?: string } | null;
    
    const lastNum = lastEngineer?.engineerCode 
      ? parseInt(lastEngineer.engineerCode.replace(/\D/g, ''), 10) 
      : 100;
    
    this.engineerCode = `E${String(lastNum + 1).padStart(3, '0')}`;
  }
  next();
});

// Indexes
engineerSchema.index({ createdBy: 1 });
engineerSchema.index({ email: 1 });
engineerSchema.index({ status: 1 });
engineerSchema.index({ assignedSite: 1 });

const EngineerModel: Model<IEngineer> = mongoose.models.Engineer || 
  mongoose.model<IEngineer>('Engineer', engineerSchema);

export default EngineerModel;
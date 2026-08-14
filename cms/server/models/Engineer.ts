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
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const EngineerModel: Model<IEngineer> = mongoose.model<IEngineer>('Engineer', engineerSchema);
export default EngineerModel;

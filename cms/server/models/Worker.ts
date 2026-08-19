import mongoose, { Document, Model, Schema } from 'mongoose';

export type WorkerRole = 'Mason' | 'Electrician' | 'Welder' | 'Plumber' | 'Labourer' | 
  'Carpenter' | 'Foreman' | 'Painter' | 'Scaffolder' | 'Site Clerk' | 'Steel Fixer' | 
  'Tiler' | 'Other';

export const WORKER_ROLES: WorkerRole[] = [
  'Mason', 'Electrician', 'Welder', 'Plumber', 'Labourer', 'Carpenter',
  'Foreman', 'Painter', 'Scaffolder', 'Site Clerk', 'Steel Fixer', 'Tiler', 'Other'
];

export interface IWorker extends Document {
  workerCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: WorkerRole;
  site?: mongoose.Types.ObjectId;
  siteName?: string;
  dailyRate: number;
  attendanceRate: number;
  totalEarned: number;
  daysWorked: number;
  status: 'active' | 'inactive';
  joinedDate?: Date;
  idNumber?: string;
  nextOfKin?: string;
  nextOfKinPhone?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const workerSchema = new Schema<IWorker>({
  workerCode: { type: String, required: true, unique: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: WORKER_ROLES, required: true },
  site: { type: Schema.Types.ObjectId, ref: 'ConstructionSite' },
  siteName: { type: String, trim: true },
  dailyRate: { type: Number, default: 0, min: 0 },
  attendanceRate: { type: Number, default: 0, min: 0, max: 100 },
  totalEarned: { type: Number, default: 0, min: 0 },
  daysWorked: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  joinedDate: { type: Date },
  idNumber: { type: String, trim: true },
  nextOfKin: { type: String, trim: true },
  nextOfKinPhone: { type: String, trim: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Indexes
workerSchema.index({ createdBy: 1 });
workerSchema.index({ site: 1 });
workerSchema.index({ role: 1 });
workerSchema.index({ status: 1 });

// Auto-generate worker code
workerSchema.pre('save', async function(next) {
  if (!this.workerCode) {
    const lastWorker = await mongoose.models.Worker?.findOne()
      .sort({ createdAt: -1 })
      .lean() as { workerCode?: string } | null;
    
    const lastNum = lastWorker?.workerCode 
      ? parseInt(lastWorker.workerCode.replace(/\D/g, ''), 10) 
      : 100;
    
    this.workerCode = `W${String(lastNum + 1).padStart(3, '0')}`;
  }
  next();
});

const WorkerModel: Model<IWorker> = mongoose.models.Worker || 
  mongoose.model<IWorker>('Worker', workerSchema);

export default WorkerModel;
import mongoose, { Document, Model, Schema } from 'mongoose';

export type WorkerRole = 'Mason' | 'Electrician' | 'Welder' | 'Plumber' | 'Labourer' | 'Carpenter' | 'Foreman' | 'Painter' | 'Scaffolder' | 'Site Clerk' | 'Steel Fixer' | 'Tiler' | 'Other';

export const WORKER_ROLES: WorkerRole[] = [
  'Mason', 'Electrician', 'Welder', 'Plumber', 'Labourer', 'Carpenter',
  'Foreman', 'Painter', 'Scaffolder', 'Site Clerk', 'Steel Fixer', 'Tiler', 'Other'
];

export interface IConstructionWorker extends Document {
  workerCode: string; // W001...
  firstName: string;
  lastName: string;
  phone: string;
  role: WorkerRole;
  site?: mongoose.Types.ObjectId;
  siteName?: string;
  dailyRate: number;
  attendanceRate: number; // computed %
  totalEarned: number; // computed
  daysWorked: number;
  status: 'active' | 'inactive';
  joinedDate?: Date;
  idNumber?: string;
  nextOfKin?: string;
  nextOfKinPhone?: string;
  ownedBy: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const constructionWorkerSchema = new Schema<IConstructionWorker>({
  workerCode: { type: String, required: true },
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
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

constructionWorkerSchema.index({ ownedBy: 1 });
constructionWorkerSchema.index({ site: 1 });
constructionWorkerSchema.index({ role: 1 });
constructionWorkerSchema.index({ status: 1 });

constructionWorkerSchema.pre('save', function(next) {
  if (!this.workerCode) {
    this.workerCode = `W${Date.now().toString().slice(-4)}`;
  }
  next();
});

const ConstructionWorkerModel: Model<IConstructionWorker> = mongoose.models.ConstructionWorker || mongoose.model<IConstructionWorker>('ConstructionWorker', constructionWorkerSchema);
export default ConstructionWorkerModel;

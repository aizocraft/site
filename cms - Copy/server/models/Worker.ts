import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWorker extends Document {
  workerCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  site?: mongoose.Types.ObjectId;
  siteName?: string;
  dailyRate: number;
  attendanceRate: number;
  totalEarned: number;
  status: 'active' | 'inactive';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const workerSchema = new Schema<IWorker>({
  workerCode: { type: String, required: true, unique: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  role: { type: String, default: 'Labourer' },
  site: { type: Schema.Types.ObjectId, ref: 'ConstructionSite' },
  siteName: { type: String, trim: true },
  dailyRate: { type: Number, default: 0 },
  attendanceRate: { type: Number, default: 0, min: 0, max: 100 },
  totalEarned: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const WorkerModel: Model<IWorker> = mongoose.model<IWorker>('Worker', workerSchema);
export default WorkerModel;

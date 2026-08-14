import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAttendance extends Document {
  worker: mongoose.Types.ObjectId;
  workerName: string;
  site?: mongoose.Types.ObjectId;
  siteName?: string;
  date: Date;
  status: 'present' | 'absent' | 'half_day' | 'late';
  hoursWorked: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>({
  worker: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
  workerName: { type: String, required: true, trim: true },
  site: { type: Schema.Types.ObjectId, ref: 'ConstructionSite' },
  siteName: { type: String, trim: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'half_day', 'late'], default: 'present' },
  hoursWorked: { type: Number, default: 8 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Unique per worker per day to prevent duplicates
attendanceSchema.index({ worker: 1, date: 1 }, { unique: true });

const AttendanceModel: Model<IAttendance> = mongoose.model<IAttendance>('Attendance', attendanceSchema);
export default AttendanceModel;

import mongoose, { Document, Model, Schema } from 'mongoose';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'leave';

export interface IAttendanceRecord extends Document {
  worker: mongoose.Types.ObjectId;
  workerName: string;
  site?: mongoose.Types.ObjectId;
  siteName?: string;
  date: Date;
  status: AttendanceStatus;
  checkIn?: Date;
  checkOut?: Date;
  hours?: number;
  note?: string;
  recordedBy: mongoose.Types.ObjectId;
  ownedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceRecordSchema = new Schema<IAttendanceRecord>({
  worker: { type: Schema.Types.ObjectId, ref: 'ConstructionWorker', required: true },
  workerName: { type: String, trim: true },
  site: { type: Schema.Types.ObjectId, ref: 'ConstructionSite' },
  siteName: { type: String, trim: true },
  date: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half_day', 'leave'],
    default: 'present'
  },
  checkIn: { type: Date },
  checkOut: { type: Date },
  hours: { type: Number, min: 0, max: 24 },
  note: { type: String, trim: true },
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// One attendance per worker per day
attendanceRecordSchema.index({ worker: 1, date: 1, ownedBy: 1 }, { unique: true });
attendanceRecordSchema.index({ ownedBy: 1 });
attendanceRecordSchema.index({ site: 1 });
attendanceRecordSchema.index({ date: 1 });

// Helper: compute hours from checkIn/checkOut if not set
attendanceRecordSchema.pre('save', function(next) {
  if (!this.hours && this.checkIn && this.checkOut) {
    this.hours = (this.checkOut.getTime() - this.checkIn.getTime()) / (1000 * 60 * 60);
  }
  next();
});

const AttendanceRecordModel: Model<IAttendanceRecord> = mongoose.models.AttendanceRecord || mongoose.model<IAttendanceRecord>('AttendanceRecord', attendanceRecordSchema);
export default AttendanceRecordModel;

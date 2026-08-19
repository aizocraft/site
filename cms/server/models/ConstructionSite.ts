import mongoose, { Document, Model, Schema } from 'mongoose';

export type SiteStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type SiteType = 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'mixed';

export interface ISiteBudget {
  total: number;
  spent: number;
  remaining: number;
}

export interface IConstructionSite extends Document {
  siteCode: string;
  name: string;
  type: SiteType;
  location: string;
  description?: string;
  status: SiteStatus;
  progress: number;
  startDate?: Date;
  expectedEndDate?: Date;
  completedAt?: Date;
  budget: ISiteBudget;
  engineer?: mongoose.Types.ObjectId;
  engineerName?: string;
  clientName?: string;
  clientPhone?: string;
  workerCount: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const siteBudgetSchema = new Schema<ISiteBudget>({
  total: { type: Number, default: 0, min: 0 },
  spent: { type: Number, default: 0, min: 0 },
  remaining: { type: Number, default: 0, min: 0 },
}, { _id: false });

const constructionSiteSchema = new Schema<IConstructionSite>({
  siteCode: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'infrastructure', 'mixed'],
    default: 'commercial'
  },
  location: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  startDate: { type: Date },
  expectedEndDate: { type: Date },
  completedAt: { type: Date },
  budget: { type: siteBudgetSchema, default: () => ({ total: 0, spent: 0, remaining: 0 }) },
  engineer: { type: Schema.Types.ObjectId, ref: 'Engineer' },
  engineerName: { type: String, trim: true },
  clientName: { type: String, trim: true },
  clientPhone: { type: String, trim: true },
  workerCount: { type: Number, default: 0, min: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Indexes
constructionSiteSchema.index({ createdBy: 1 });
constructionSiteSchema.index({ status: 1 });
constructionSiteSchema.index({ engineer: 1 });
constructionSiteSchema.index({ siteCode: 1 });

// Auto-generate site code
constructionSiteSchema.pre('save', async function(next) {
  if (!this.siteCode) {
    const lastSite = await mongoose.models.ConstructionSite?.findOne()
      .sort({ createdAt: -1 })
      .lean() as { siteCode?: string } | null;
    
    const lastNum = lastSite?.siteCode 
      ? parseInt(lastSite.siteCode.replace(/\D/g, ''), 10) 
      : 100;
    
    this.siteCode = `S${String(lastNum + 1).padStart(3, '0')}`;
  }
  
  // Keep budget.remaining in sync
  this.budget.remaining = Math.max(0, (this.budget.total || 0) - (this.budget.spent || 0));
  
  // Auto-complete if progress reaches 100
  if (this.progress >= 100) {
    this.status = 'completed';
    if (!this.completedAt) this.completedAt = new Date();
  }
  
  next();
});

const ConstructionSiteModel: Model<IConstructionSite> = 
  mongoose.models.ConstructionSite || 
  mongoose.model<IConstructionSite>('ConstructionSite', constructionSiteSchema);

export default ConstructionSiteModel;
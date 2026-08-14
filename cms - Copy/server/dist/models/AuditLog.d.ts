import mongoose, { Document, Model } from 'mongoose';
export interface IAuditLog extends Document {
    action: string;
    resource: string;
    resourceId?: string;
    userId: mongoose.Types.ObjectId;
    userEmail?: string;
    userName?: string;
    userRole?: string;
    userAgent: string;
    ipAddress: string;
    location?: {
        country?: string;
        city?: string;
        timezone?: string;
    };
    details: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    status: 'success' | 'failed' | 'pending';
    severity: 'info' | 'warning' | 'error' | 'critical';
    duration?: number;
    sessionId?: string;
    requestId?: string;
    createdAt: Date;
}
declare const AuditLog: Model<IAuditLog>;
export default AuditLog;
//# sourceMappingURL=AuditLog.d.ts.map
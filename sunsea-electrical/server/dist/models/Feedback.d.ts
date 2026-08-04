import mongoose, { Document } from 'mongoose';
export interface IFeedback extends Document {
    name?: string;
    email?: string;
    rating: number;
    category: string;
    feedback: string;
    status: 'pending' | 'reviewed' | 'resolved';
    isPublic: boolean;
    userAgent?: string;
    ipAddress?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Feedback: mongoose.Model<any, {}, {}, {}, any, any>;
//# sourceMappingURL=Feedback.d.ts.map
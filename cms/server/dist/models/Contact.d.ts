import mongoose, { Document } from 'mongoose';
export interface IContact extends Document {
    name: string;
    email?: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'pending' | 'read' | 'replied' | 'spam';
    userAgent?: string;
    ipAddress?: string;
    repliedAt?: Date;
    repliedBy?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Contact: mongoose.Model<any, {}, {}, {}, any, any>;
//# sourceMappingURL=Contact.d.ts.map
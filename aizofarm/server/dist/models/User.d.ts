import { Document, Model } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'sales' | 'admin';
    stripeCustomerId?: string;
    phone?: string;
    avatar?: string;
    isActive: boolean;
    lastLogin?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    googleId?: string;
    provider: 'local' | 'google';
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const UserModel: Model<IUser>;
export default UserModel;
//# sourceMappingURL=User.d.ts.map
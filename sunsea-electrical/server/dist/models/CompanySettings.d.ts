import mongoose, { Document } from 'mongoose';
export interface ICompanySettings extends Document {
    companyName: string;
    logo: {
        type: 'url' | 'gridfs';
        url?: string;
        fileId?: mongoose.Types.ObjectId;
        filename?: string;
        mimeType?: string;
    };
    favicon: {
        type: 'url' | 'gridfs';
        url?: string;
        fileId?: mongoose.Types.ObjectId;
        filename?: string;
        mimeType?: string;
    } | null;
    slogan: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    footerText: string;
    socialLinks: Array<{
        platform: string;
        url: string;
    }>;
    taxRate: number;
    taxExemptCategories: string[];
    themeColors: {
        light: {
            primary: string;
            primaryForeground: string;
            primaryMid: string;
            primaryLight: string;
        };
        dark: {
            primary: string;
            primaryForeground: string;
            primaryMid: string;
            primaryLight: string;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const CompanySettings: mongoose.Model<any, {}, {}, {}, any, any>;
//# sourceMappingURL=CompanySettings.d.ts.map
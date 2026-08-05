import { Request, Response, NextFunction } from 'express';
interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}
export declare const compressImage: (options?: CompressionOptions) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=imageCompression.d.ts.map
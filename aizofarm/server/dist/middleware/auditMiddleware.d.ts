import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
interface AuditRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
    requestId?: string;
    auditStartTime?: number;
}
interface AuditLogOptions {
    action: string;
    resource: string;
    resourceId?: string;
    details: string;
    severity?: 'info' | 'warning' | 'error' | 'critical';
    status?: 'success' | 'failed' | 'pending';
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    skipIfNoUser?: boolean;
    duration?: number;
    message?: string;
}
export declare const createAuditLog: (req: AuditRequest, options: AuditLogOptions) => Promise<(import("mongoose").Document<unknown, {}, import("../models/AuditLog").IAuditLog, {}, {}> & import("../models/AuditLog").IAuditLog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const auditContextMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const autoAuditMiddleware: (options?: {
    excludePaths?: string[];
    includeBody?: boolean;
}) => (req: Request, res: Response, next: NextFunction) => void;
export declare const auditLog: (options: Omit<AuditLogOptions, "details"> & {
    details?: string | ((result: any, req: AuditRequest) => string);
}) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export {};
//# sourceMappingURL=auditMiddleware.d.ts.map
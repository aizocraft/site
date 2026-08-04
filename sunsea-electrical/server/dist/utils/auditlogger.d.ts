interface AuditLogOptions {
    userId: string;
    userEmail?: string;
    userName?: string;
    userRole?: string;
    action: string;
    resource: string;
    resourceId?: string;
    details: string;
    oldValues?: any;
    newValues?: any;
    status?: 'success' | 'failed' | 'pending';
    severity?: 'info' | 'warning' | 'error' | 'critical';
    req?: any;
}
export declare function logAuditEvent(options: AuditLogOptions): Promise<(import("mongoose").Document<unknown, {}, import("../models/AuditLog").IAuditLog, {}, {}> & import("../models/AuditLog").IAuditLog & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export {};
//# sourceMappingURL=auditlogger.d.ts.map
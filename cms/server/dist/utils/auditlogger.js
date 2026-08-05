"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuditEvent = logAuditEvent;
// server/utils/auditLogger.ts
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
async function logAuditEvent(options) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const auditLog = new AuditLog_1.default({
            ...options,
            userAgent: ((_a = options.req) === null || _a === void 0 ? void 0 : _a.get('User-Agent')) || 'system',
            ipAddress: ((_b = options.req) === null || _b === void 0 ? void 0 : _b.ip) || ((_d = (_c = options.req) === null || _c === void 0 ? void 0 : _c.socket) === null || _d === void 0 ? void 0 : _d.remoteAddress) || 'system',
            location: (_e = options.req) === null || _e === void 0 ? void 0 : _e.location,
            sessionId: (_f = options.req) === null || _f === void 0 ? void 0 : _f.sessionId,
            requestId: (_g = options.req) === null || _g === void 0 ? void 0 : _g.requestId
        });
        await auditLog.save();
        return auditLog;
    }
    catch (error) {
        console.error('Failed to log audit event:', error);
        return null;
    }
}
// Usage example in routes:
// await logAuditEvent({
//   userId: req.user.userId,
//   userEmail: req.user.email,
//   userName: req.user.name,
//   action: 'approve',
//   resource: 'order',
//   resourceId: orderId,
//   details: `Approved order #${orderId}`,
//   severity: 'info',
//   req
// })
//# sourceMappingURL=auditlogger.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = exports.autoAuditMiddleware = exports.auditContextMiddleware = exports.createAuditLog = void 0;
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = require("mongoose");
// Map URL paths to valid resource enum values
const mapPathToResource = (path) => {
    const segment = path.split('/')[1];
    const resourceMap = {
        'api': 'unknown',
        'auth': 'user',
        'users': 'user',
        'products': 'product',
        'orders': 'order',
        'reviews': 'review',
        'categories': 'category',
        'company': 'settings',
        'feedback': 'feedback',
        'contact': 'contact',
        'email': 'email',
        'audit': 'settings',
        'health': 'unknown',
        'uploads': 'unknown'
    };
    return resourceMap[segment] || 'unknown';
};
// Generate unique request ID
const generateRequestId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};
// Get location info from IP (simplified)
const getLocationFromIp = async (ip) => {
    return {};
};
// Main audit logging function
const createAuditLog = async (req, options) => {
    var _a, _b;
    try {
        const { action, resource, resourceId, details, severity = 'info', status = 'success', oldValues, newValues, skipIfNoUser = false, duration } = options;
        if (!skipIfNoUser && !req.user) {
            console.warn('Audit log skipped: No authenticated user');
            return null;
        }
        const userAgent = req.get('User-Agent') || 'unknown';
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const location = await getLocationFromIp(ipAddress);
        let userEmail = undefined;
        let userName = undefined;
        if (req.user) {
            try {
                const user = await User_1.default.findById(req.user.userId).select('email name');
                if (user) {
                    userEmail = user.email;
                    userName = user.name || user.email;
                }
            }
            catch (err) {
                console.error('Failed to fetch user for audit:', err);
            }
        }
        const validResources = ['user', 'product', 'order', 'review', 'category', 'settings', 'feedback', 'contact', 'email', 'company', 'payment', 'shipping', 'inventory', 'unknown'];
        const validResource = validResources.includes(resource) ? resource : 'unknown';
        const auditLog = new AuditLog_1.default({
            action,
            resource: validResource,
            resourceId,
            userId: req.user ? new mongoose_1.Types.ObjectId(req.user.userId) : new mongoose_1.Types.ObjectId(),
            userEmail,
            userName,
            userRole: (_a = req.user) === null || _a === void 0 ? void 0 : _a.role,
            userAgent,
            ipAddress,
            location,
            details,
            oldValues,
            newValues,
            status,
            severity,
            duration: duration || (req.auditStartTime ? Date.now() - req.auditStartTime : undefined),
            sessionId: ((_b = req.session) === null || _b === void 0 ? void 0 : _b.id) || req.get('x-session-id'),
            requestId: req.requestId,
            createdAt: new Date()
        });
        await auditLog.save();
        return auditLog;
    }
    catch (error) {
        console.error('Failed to create audit log:', error);
        return null;
    }
};
exports.createAuditLog = createAuditLog;
// ✅ FIX: Properly typed Express middleware
const auditContextMiddleware = (req, res, next) => {
    // Generate unique request ID
    req.requestId = generateRequestId();
    // Set audit start time for duration calculation
    req.auditStartTime = Date.now();
    // Add request ID to response headers
    res.setHeader('X-Request-ID', req.requestId);
    next();
};
exports.auditContextMiddleware = auditContextMiddleware;
// ✅ FIX: Properly typed Express middleware factory
const autoAuditMiddleware = (options) => {
    const excludePaths = (options === null || options === void 0 ? void 0 : options.excludePaths) || ['/health', '/metrics', '/static'];
    const includeBody = (options === null || options === void 0 ? void 0 : options.includeBody) || false;
    // Return properly typed Express middleware
    return (req, res, next) => {
        // Skip excluded paths
        if (excludePaths.some(path => req.path.includes(path))) {
            return next();
        }
        // Skip if no authenticated user
        if (!req.user) {
            return next();
        }
        // Store original send function
        const originalSend = res.json;
        let responseBody;
        // Override json method to capture response
        res.json = function (body) {
            responseBody = body;
            return originalSend.call(this, body);
        };
        // Determine action based on HTTP method
        let action = 'view';
        switch (req.method) {
            case 'POST':
                action = 'create';
                break;
            case 'PUT':
            case 'PATCH':
                action = 'update';
                break;
            case 'DELETE':
                action = 'delete';
                break;
            case 'GET':
                action = 'view';
                break;
        }
        const resource = mapPathToResource(req.path);
        // Extract resource ID from path if exists
        const pathParts = req.path.split('/');
        const resourceId = pathParts[2] && pathParts[2].match(/^[0-9a-fA-F]{24}$/) ? pathParts[2] : undefined;
        // Determine status based on response code
        let status = 'pending';
        let severity = 'info';
        // Listen for response finish
        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                status = 'success';
                severity = 'info';
            }
            else if (res.statusCode >= 400 && res.statusCode < 500) {
                status = 'failed';
                severity = 'warning';
            }
            else if (res.statusCode >= 500) {
                status = 'failed';
                severity = 'error';
            }
            // Prepare details
            let details = `${req.method} ${req.path} - ${res.statusCode}`;
            let oldValues, newValues;
            if (includeBody && req.body && Object.keys(req.body).length > 0) {
                if (action === 'update') {
                    oldValues = req.body;
                }
                else if (action === 'create') {
                    newValues = req.body;
                }
                details += ` - Body: ${JSON.stringify(req.body).substring(0, 200)}`;
            }
            if (responseBody && responseBody.error) {
                details += ` - Error: ${responseBody.error}`;
            }
            // Create audit log
            await (0, exports.createAuditLog)(req, {
                action,
                resource,
                resourceId,
                details,
                severity,
                status,
                oldValues,
                newValues,
                skipIfNoUser: true
            });
        });
        next();
    };
};
exports.autoAuditMiddleware = autoAuditMiddleware;
// Manual audit logging decorator
const auditLog = (options) => {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const req = args.find(arg => arg && arg.user);
            const startTime = Date.now();
            let result;
            let error;
            let status = 'success';
            try {
                result = await originalMethod.apply(this, args);
                return result;
            }
            catch (err) {
                error = err;
                status = 'failed';
                throw err;
            }
            finally {
                let detailsString = options.details || `${options.action} ${options.resource}`;
                if (typeof options.details === 'function') {
                    detailsString = options.details(result, req);
                }
                if (req && req.user) {
                    await (0, exports.createAuditLog)(req, {
                        ...options,
                        details: `${detailsString}${error ? ` - Error: ${error.message || 'Unknown error'}` : ''}`,
                        status,
                        severity: error ? 'error' : (options.severity || 'info'),
                        duration: Date.now() - startTime
                    });
                }
            }
        };
        return descriptor;
    };
};
exports.auditLog = auditLog;
//# sourceMappingURL=auditMiddleware.js.map
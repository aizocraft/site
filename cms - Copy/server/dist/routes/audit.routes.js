"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Get audit logs with filters and pagination
router.get('/logs', auth_1.default, async (req, res) => {
    try {
        const { page = 1, limit = 50, action, resource, userId, status, search, startDate, endDate } = req.query;
        const query = {};
        if (action)
            query.action = action;
        if (resource)
            query.resource = resource;
        if (userId)
            query.userId = userId;
        if (status)
            query.status = status;
        if (search) {
            query.$or = [
                { details: { $regex: search, $options: 'i' } },
                { ipAddress: { $regex: search, $options: 'i' } }
            ];
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = new Date(startDate);
            if (endDate)
                query.createdAt.$lte = new Date(endDate);
        }
        const skip = ((Number(page) - 1) * Number(limit));
        const [logs, total] = await Promise.all([
            AuditLog_1.default.find(query)
                .populate('userId', 'name email role')
                .sort({ createdAt: -1 })
                .limit(Number(limit))
                .skip(skip),
            AuditLog_1.default.countDocuments(query)
        ]);
        const stats = await AuditLog_1.default.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json({
            logs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            },
            stats: Object.fromEntries(stats.map((s) => [s._id, s.count]))
        });
    }
    catch (error) {
        console.error('Audit log fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});
// Get audit log stats
router.get('/stats', auth_1.default, async (req, res) => {
    var _a, _b, _c;
    try {
        const matchQuery = {};
        // Apply filters if provided
        const { period = '30d' } = req.query;
        const now = new Date();
        let startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (period === '7d')
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (period === '24h')
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        matchQuery.createdAt = { $gte: startDate };
        const [summary, recentActions] = await Promise.all([
            AuditLog_1.default.aggregate([
                { $match: matchQuery },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        uniqueUsers: { $addToSet: '$userId' }
                    }
                }
            ]),
            AuditLog_1.default.aggregate([
                { $match: matchQuery },
                {
                    $group: {
                        _id: { action: '$action', resource: '$resource' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ])
        ]);
        res.json({
            totalEvents: ((_a = summary[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            uniqueUsers: ((_c = (_b = summary[0]) === null || _b === void 0 ? void 0 : _b.uniqueUsers) === null || _c === void 0 ? void 0 : _c.length) || 0,
            recentActions,
            period: period
        });
    }
    catch (error) {
        console.error('Audit stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});
// Create audit log (internal use)
router.post('/', async (req, res) => {
    try {
        const auditLog = new AuditLog_1.default({
            ...req.body,
            ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
            userAgent: req.get('User-Agent') || 'unknown'
        });
        const saved = await auditLog.save();
        await saved.populate('userId', 'name email role');
        res.json(saved);
    }
    catch (error) {
        console.error('Create audit log error:', error);
        res.status(500).json({ error: 'Failed to create audit log' });
    }
});
// Get audit analytics
router.get('/analytics', auth_1.default, async (req, res) => {
    try {
        const { period = '30d', groupBy = 'day' } = req.query;
        const now = new Date();
        let startDate = new Date(now.getTime() - (parseInt(period) * 24 * 60 * 60 * 1000));
        const [timeline, topUsers, topActions, statusBreakdown, resourceBreakdown] = await Promise.all([
            // Timeline data
            AuditLog_1.default.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: groupBy === 'day'
                            ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                            : { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                        count: { $sum: 1 },
                        uniqueUsers: { $addToSet: '$userId' }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            // Top active users
            AuditLog_1.default.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: '$userId',
                        userName: { $first: '$userName' },
                        userEmail: { $first: '$userEmail' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            // Most common actions
            AuditLog_1.default.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { action: '$action', resource: '$resource' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            // Status breakdown
            AuditLog_1.default.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]),
            // Resource breakdown
            AuditLog_1.default.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: '$resource',
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);
        res.json({
            timeline,
            topUsers,
            topActions,
            statusBreakdown,
            resourceBreakdown,
            period,
            groupBy
        });
    }
    catch (error) {
        console.error('Audit analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});
// Get user activity timeline
router.get('/user/:userId', auth_1.default, async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50 } = req.query;
        const logs = await AuditLog_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();
        res.json({ logs, count: logs.length });
    }
    catch (error) {
        console.error('User activity error:', error);
        res.status(500).json({ error: 'Failed to fetch user activity' });
    }
});
// Get security alerts
router.get('/alerts', auth_1.default, async (req, res) => {
    try {
        const alerts = await AuditLog_1.default.find({
            severity: { $in: ['error', 'critical'] },
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('userId', 'name email')
            .lean();
        res.json({ alerts, count: alerts.length });
    }
    catch (error) {
        console.error('Security alerts error:', error);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});
// Export logs
router.get('/export', auth_1.default, async (req, res) => {
    try {
        const { startDate, endDate, format = 'csv' } = req.query;
        const query = {};
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = new Date(startDate);
            if (endDate)
                query.createdAt.$lte = new Date(endDate);
        }
        const logs = await AuditLog_1.default.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .lean();
        if (format === 'csv') {
            const csv = convertToCSV(logs);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
            res.send(csv);
        }
        else {
            res.json(logs);
        }
    }
    catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to export logs' });
    }
});
function convertToCSV(logs) {
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address', 'Status', 'Severity'];
    const rows = logs.map(log => [
        new Date(log.createdAt).toISOString(),
        log.userName || log.userId,
        log.action,
        log.resource,
        log.details,
        log.ipAddress,
        log.status,
        log.severity
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}
exports.default = router;
//# sourceMappingURL=audit.routes.js.map
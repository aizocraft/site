"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_service_1 = require("../services/notification.service");
const auth_1 = __importDefault(require("../middleware/auth"));
const Notification_1 = __importDefault(require("../models/Notification"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = require("mongoose");
const router = (0, express_1.Router)();
// Helper to check if user is admin
const isAdmin = async (userId) => {
    const user = await User_1.default.findById(userId).select('role');
    return (user === null || user === void 0 ? void 0 : user.role) === 'admin';
};
// GET /api/notifications - Get user notifications (paginated)
router.get('/', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.user.userId) === null || _b === void 0 ? void 0 : _b.toString());
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { read, type, page = '1', limit = '20' } = req.query;
        const query = {};
        if (read !== undefined) {
            query.read = read === 'true';
        }
        if (type) {
            query.type = type;
        }
        query.page = parseInt(page);
        query.limit = parseInt(limit);
        const notifications = await (0, notification_service_1.getUserNotifications)(userId, query);
        res.json({
            success: true,
            data: notifications
        });
    }
    catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch notifications' });
    }
});
// GET /api/notifications/unread-count
router.get('/unread-count', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.user.userId) === null || _b === void 0 ? void 0 : _b.toString());
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const count = await (0, notification_service_1.getUnreadCount)(userId);
        res.json({
            success: true,
            data: { unreadCount: count }
        });
    }
    catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch unread count' });
    }
});
// GET /api/notifications/types/:type - Get notifications by type
router.get('/types/:type', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.user.userId) === null || _b === void 0 ? void 0 : _b.toString());
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { type } = req.params;
        const { limit = '50', read } = req.query;
        const notifications = await (0, notification_service_1.getNotificationsByType)(userId, type, parseInt(limit), read === 'true' ? true : read === 'false' ? false : undefined);
        res.json({
            success: true,
            data: notifications
        });
    }
    catch (error) {
        console.error('Get notifications by type error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch notifications' });
    }
});
// PATCH /api/notifications/:id/read - Mark single as read
router.patch('/:id/read', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const notificationId = req.params.id;
        const userId = ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.user.userId) === null || _b === void 0 ? void 0 : _b.toString());
        if (!mongoose_1.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ error: 'Invalid notification ID' });
        }
        // Verify user owns notification BEFORE updating
        const notification = await Notification_1.default.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        if (String(notification.userId) !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const updatedNotification = await (0, notification_service_1.markAsRead)(notificationId);
        res.json({
            success: true,
            data: updatedNotification
        });
    }
    catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ error: error.message || 'Failed to mark as read' });
    }
});
// POST /api/notifications/mark-all-read - Mark all as read
router.post('/mark-all-read', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.user.userId) === null || _b === void 0 ? void 0 : _b.toString());
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const result = await (0, notification_service_1.markAllAsRead)(userId);
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ error: error.message || 'Failed to mark all as read' });
    }
});
// DELETE /api/notifications/:id - Delete single notification
router.delete('/:id', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const notificationId = req.params.id;
        const userId = ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.user.userId) === null || _b === void 0 ? void 0 : _b.toString());
        if (!mongoose_1.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ error: 'Invalid notification ID' });
        }
        // Verify user owns notification BEFORE deleting
        const notification = await Notification_1.default.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        if (String(notification.userId) !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const deleted = await (0, notification_service_1.deleteNotification)(notificationId);
        res.json({
            success: true,
            data: { deleted: true, message: 'Notification deleted' }
        });
    }
    catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ error: error.message || 'Failed to delete notification' });
    }
});
// DELETE /api/notifications/delete-read - Delete all read notifications
router.delete('/delete-read', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.user.userId) === null || _b === void 0 ? void 0 : _b.toString());
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const result = await (0, notification_service_1.deleteAllRead)(userId);
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error('Delete read notifications error:', error);
        res.status(500).json({ error: error.message || 'Failed to delete read notifications' });
    }
});
// DELETE /api/notifications/delete-all - Delete ALL notifications for user (admin only)
router.delete('/delete-all', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.user.userId) === null || _b === void 0 ? void 0 : _b.toString());
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Check if user is admin
        const user = await User_1.default.findById(userId).select('role');
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const result = await Notification_1.default.deleteMany({});
        res.json({
            success: true,
            data: { deletedCount: result.deletedCount, message: 'All notifications deleted' }
        });
    }
    catch (error) {
        console.error('Delete all notifications error:', error);
        res.status(500).json({ error: error.message || 'Failed to delete notifications' });
    }
});
// DELETE /api/notifications/cleanup/old - Delete old read notifications (admin only)
router.delete('/cleanup/old', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.user.userId) === null || _b === void 0 ? void 0 : _b.toString());
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Check if user is admin
        const user = await User_1.default.findById(userId).select('role');
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { days = '90' } = req.query;
        const daysOld = parseInt(days);
        const result = await (0, notification_service_1.deleteOldNotifications)(daysOld);
        res.json({
            success: true,
            data: { deletedCount: result.deletedCount, message: `Deleted notifications older than ${daysOld} days` }
        });
    }
    catch (error) {
        console.error('Cleanup old notifications error:', error);
        res.status(500).json({ error: error.message || 'Failed to cleanup notifications' });
    }
});
// POST /api/notifications/broadcast - Send notification to all users (admin only)
router.post('/broadcast', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.user.userId) === null || _b === void 0 ? void 0 : _b.toString());
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Check if user is admin
        const adminUser = await User_1.default.findById(userId).select('role name email');
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { title, message, type, actionUrl, metadata, userRole } = req.body;
        if (!title || !message) {
            return res.status(400).json({ error: 'Title and message are required' });
        }
        // Build user filter
        const filter = { isActive: true };
        if (userRole && userRole !== 'all') {
            filter.role = userRole;
        }
        const users = await User_1.default.find(filter).select('_id');
        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found to broadcast to' });
        }
        const notifications = [];
        for (const user of users) {
            notifications.push({
                userId: user._id,
                type: type || 'system',
                title,
                message,
                actionUrl: actionUrl || null,
                metadata: {
                    ...metadata,
                    broadcastBy: adminUser.email,
                    broadcastAt: new Date().toISOString()
                }
            });
        }
        const result = await Notification_1.default.insertMany(notifications);
        res.json({
            success: true,
            data: {
                broadcastCount: result.length,
                message: `Broadcast sent to ${result.length} user(s) successfully`
            }
        });
    }
    catch (error) {
        console.error('Broadcast notification error:', error);
        res.status(500).json({ error: error.message || 'Failed to broadcast notifications' });
    }
});
// GET /api/notifications/admin/stats - Get notification statistics (admin only)
router.get('/admin/stats', auth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = req.user.userId) === null || _b === void 0 ? void 0 : _b.toString());
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Check if user is admin
        const user = await User_1.default.findById(userId).select('role');
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const stats = await Notification_1.default.aggregate([
            {
                $facet: {
                    totalStats: [
                        {
                            $group: {
                                _id: null,
                                totalNotifications: { $sum: 1 },
                                unreadCount: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } },
                                readCount: { $sum: { $cond: [{ $eq: ['$read', true] }, 1, 0] } }
                            }
                        }
                    ],
                    byType: [
                        {
                            $group: {
                                _id: '$type',
                                count: { $sum: 1 },
                                unread: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } }
                            }
                        }
                    ],
                    last30Days: [
                        {
                            $match: {
                                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                                },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ]
                }
            }
        ]);
        res.json({
            success: true,
            data: {
                total: stats[0].totalStats[0] || { totalNotifications: 0, unreadCount: 0, readCount: 0 },
                byType: stats[0].byType,
                last30Days: stats[0].last30Days
            }
        });
    }
    catch (error) {
        console.error('Get notification stats error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch statistics' });
    }
});
exports.default = router;
//# sourceMappingURL=notification.routes.js.map
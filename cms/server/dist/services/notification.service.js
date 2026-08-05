"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_TEMPLATES = exports.deleteOldNotifications = exports.deleteAllRead = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getUnreadCount = exports.getNotificationsByType = exports.getUserNotifications = exports.createBulkNotifications = exports.createNotification = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
/**
 * Create notification for user
 */
const createNotification = async (input) => {
    const notification = new Notification_1.default(input);
    await notification.save();
    return notification;
};
exports.createNotification = createNotification;
/**
 * Create multiple notifications at once
 */
const createBulkNotifications = async (inputs) => {
    const notifications = await Notification_1.default.insertMany(inputs);
    return notifications;
};
exports.createBulkNotifications = createBulkNotifications;
/**
 * Get user notifications (paginated)
 */
const getUserNotifications = async (userId, query = {}) => {
    const { read = undefined, type, limit = 20, page = 1, sort = '-createdAt' } = query;
    const filter = { userId };
    if (read !== undefined) {
        filter.read = read;
    }
    if (type) {
        filter.type = type;
    }
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
        Notification_1.default.find(filter)
            .populate('userId', 'name email')
            .sort(sort)
            .limit(limit)
            .skip(skip),
        Notification_1.default.countDocuments(filter)
    ]);
    return {
        notifications,
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit
        }
    };
};
exports.getUserNotifications = getUserNotifications;
/**
 * Get notifications by type
 */
const getNotificationsByType = async (userId, type, limit = 50, read) => {
    const filter = { userId, type };
    if (read !== undefined) {
        filter.read = read;
    }
    return Notification_1.default.find(filter)
        .sort('-createdAt')
        .limit(limit)
        .populate('userId', 'name email');
};
exports.getNotificationsByType = getNotificationsByType;
/**
 * Get unread notifications count
 */
const getUnreadCount = async (userId) => {
    return Notification_1.default.countDocuments({
        userId,
        read: false
    });
};
exports.getUnreadCount = getUnreadCount;
/**
 * Mark single notification as read
 */
const markAsRead = async (notificationId) => {
    return Notification_1.default.findByIdAndUpdate(notificationId, { read: true }, { new: true }).populate('userId', 'name email');
};
exports.markAsRead = markAsRead;
/**
 * Mark all user notifications as read
 */
const markAllAsRead = async (userId) => {
    const result = await Notification_1.default.updateMany({ userId, read: false }, { read: true });
    return { markedCount: result.modifiedCount };
};
exports.markAllAsRead = markAllAsRead;
/**
 * Delete single notification
 */
const deleteNotification = async (notificationId) => {
    const result = await Notification_1.default.findByIdAndDelete(notificationId);
    return !!result;
};
exports.deleteNotification = deleteNotification;
/**
 * Delete all read notifications for user
 */
const deleteAllRead = async (userId) => {
    const result = await Notification_1.default.deleteMany({
        userId,
        read: true
    });
    return { deletedCount: result.deletedCount };
};
exports.deleteAllRead = deleteAllRead;
/**
 * Delete old notifications (older than specified days)
 */
const deleteOldNotifications = async (daysOld = 90) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const result = await Notification_1.default.deleteMany({
        createdAt: { $lt: cutoffDate },
        read: true
    });
    return { deletedCount: result.deletedCount };
};
exports.deleteOldNotifications = deleteOldNotifications;
/**
 * Preset notification templates
 */
exports.NOTIFICATION_TEMPLATES = {
    newOrder: (orderNumber, customerName, total) => ({
        title: `🛍️ New Order #${orderNumber}`,
        message: `${customerName} placed an order worth KES ${total.toFixed(2)}`,
        type: 'order',
        actionUrl: `/dashboard/orders`
    }),
    orderStatus: (orderNumber, status) => ({
        title: `📦 Order #${orderNumber} Updated`,
        message: `Your order status has been updated to: ${status.toUpperCase()}`,
        type: 'order',
        actionUrl: `/orders/${orderNumber}`
    }),
    lowStock: (productName, stock) => ({
        title: '⚠️ Low Stock Alert',
        message: `${productName} only has ${stock} units left. Please restock soon.`,
        type: 'stock',
        actionUrl: `/dashboard/products`
    }),
    paymentReceived: (orderNumber, amount) => ({
        title: '💰 Payment Received',
        message: `KES ${amount.toFixed(2)} payment received for order #${orderNumber}`,
        type: 'payment',
        actionUrl: `/orders/${orderNumber}`
    }),
    paymentFailed: (orderNumber, reason) => ({
        title: '❌ Payment Failed',
        message: `Payment failed for order #${orderNumber}. Reason: ${reason}`,
        type: 'payment',
        actionUrl: `/orders/${orderNumber}/payment`
    }),
    orderShipped: (orderNumber, trackingNumber) => ({
        title: '🚚 Order Shipped',
        message: `Your order #${orderNumber} has been shipped${trackingNumber ? ` with tracking #${trackingNumber}` : ''}`,
        type: 'shipping',
        actionUrl: `/orders/${orderNumber}`
    }),
    orderDelivered: (orderNumber) => ({
        title: '✅ Order Delivered',
        message: `Your order #${orderNumber} has been delivered. Thank you for shopping with us!`,
        type: 'shipping',
        actionUrl: `/orders/${orderNumber}`
    }),
    reviewRequest: (orderNumber, productName) => ({
        title: '📝 Review Request',
        message: `How was your experience with ${productName}? Leave a review for order #${orderNumber}`,
        type: 'review',
        actionUrl: `/products/review`
    }),
    welcome: (userName) => ({
        title: '👋 Welcome to Our Store!',
        message: `Hi ${userName}, thank you for joining us. Start exploring our products!`,
        type: 'user',
        actionUrl: `/products`
    }),
    promoCode: (code, discount) => ({
        title: '🎉 Special Offer!',
        message: `Use code ${code} to get ${discount} off your next purchase`,
        type: 'system',
        actionUrl: `/promo/${code}`
    })
};
//# sourceMappingURL=notification.service.js.map
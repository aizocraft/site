import { CreateNotificationInput, INotificationDocument } from '../types/notification';
import { GetNotificationsQuery, NotificationListResponse } from '../types/notification';
/**
 * Create notification for user
 */
export declare const createNotification: (input: CreateNotificationInput) => Promise<INotificationDocument>;
/**
 * Create multiple notifications at once
 */
export declare const createBulkNotifications: (inputs: CreateNotificationInput[]) => Promise<INotificationDocument[]>;
/**
 * Get user notifications (paginated)
 */
export declare const getUserNotifications: (userId: string, query?: GetNotificationsQuery) => Promise<NotificationListResponse>;
/**
 * Get notifications by type
 */
export declare const getNotificationsByType: (userId: string, type: string, limit?: number, read?: boolean) => Promise<INotificationDocument[]>;
/**
 * Get unread notifications count
 */
export declare const getUnreadCount: (userId: string) => Promise<number>;
/**
 * Mark single notification as read
 */
export declare const markAsRead: (notificationId: string) => Promise<INotificationDocument | null>;
/**
 * Mark all user notifications as read
 */
export declare const markAllAsRead: (userId: string) => Promise<{
    markedCount: number;
}>;
/**
 * Delete single notification
 */
export declare const deleteNotification: (notificationId: string) => Promise<boolean>;
/**
 * Delete all read notifications for user
 */
export declare const deleteAllRead: (userId: string) => Promise<{
    deletedCount: number;
}>;
/**
 * Delete old notifications (older than specified days)
 */
export declare const deleteOldNotifications: (daysOld?: number) => Promise<{
    deletedCount: number;
}>;
/**
 * Preset notification templates
 */
export declare const NOTIFICATION_TEMPLATES: {
    readonly newOrder: (orderNumber: string, customerName: string, total: number) => {
        title: string;
        message: string;
        type: "order";
        actionUrl: string;
    };
    readonly orderStatus: (orderNumber: string, status: string) => {
        title: string;
        message: string;
        type: "order";
        actionUrl: string;
    };
    readonly lowStock: (productName: string, stock: number) => {
        title: string;
        message: string;
        type: "stock";
        actionUrl: string;
    };
    readonly paymentReceived: (orderNumber: string, amount: number) => {
        title: string;
        message: string;
        type: "payment";
        actionUrl: string;
    };
    readonly paymentFailed: (orderNumber: string, reason: string) => {
        title: string;
        message: string;
        type: "payment";
        actionUrl: string;
    };
    readonly orderShipped: (orderNumber: string, trackingNumber?: string) => {
        title: string;
        message: string;
        type: "shipping";
        actionUrl: string;
    };
    readonly orderDelivered: (orderNumber: string) => {
        title: string;
        message: string;
        type: "shipping";
        actionUrl: string;
    };
    readonly reviewRequest: (orderNumber: string, productName: string) => {
        title: string;
        message: string;
        type: "review";
        actionUrl: string;
    };
    readonly welcome: (userName: string) => {
        title: string;
        message: string;
        type: "user";
        actionUrl: string;
    };
    readonly promoCode: (code: string, discount: string) => {
        title: string;
        message: string;
        type: "system";
        actionUrl: string;
    };
};
//# sourceMappingURL=notification.service.d.ts.map
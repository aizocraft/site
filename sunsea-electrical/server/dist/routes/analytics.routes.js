"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/analytics.routes.ts
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const CompanySettings_1 = require("../models/CompanySettings");
const SalesCustomer_1 = __importDefault(require("../models/SalesCustomer"));
const Quotation_1 = __importDefault(require("../models/Quotation"));
const Order_1 = __importDefault(require("../models/Order"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// Helper functions
const isAdmin = (user) => user && user.role === 'admin';
const isSales = (user) => user && user.role === 'sales';
const isAdminOrSales = (user) => isAdmin(user) || isSales(user);
// ==================== HELPER FUNCTIONS ====================
function getDateRange(period) {
    const now = new Date();
    const start = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    switch (period) {
        case 'week':
            start.setDate(now.getDate() - 7);
            break;
        case 'month':
            start.setMonth(now.getMonth() - 1);
            break;
        case 'quarter':
            start.setMonth(now.getMonth() - 3);
            break;
        case 'year':
            start.setFullYear(now.getFullYear() - 1);
            break;
        default:
            start.setMonth(now.getMonth() - 1);
    }
    start.setHours(0, 0, 0, 0);
    return { start, end };
}
function getDateFilter(period) {
    const { start } = getDateRange(period);
    return { createdAt: { $gte: start } };
}
function getPreviousPeriodRange(period) {
    const { start, end } = getDateRange(period);
    const duration = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - duration);
    prevStart.setHours(0, 0, 0, 0);
    prevEnd.setHours(23, 59, 59, 999);
    return { start: prevStart, end: prevEnd };
}
// ==================== ADMIN ANALYTICS ====================
router.get('/admin/overview', auth_1.default, async (req, res) => {
    var _a, _b, _c;
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        // Get date range from query
        const { period = 'month' } = req.query;
        const dateFilter = getDateFilter(period);
        const { start: periodStart, end: periodEnd } = getDateRange(period);
        const previousPeriod = getPreviousPeriodRange(period);
        // Parallel queries for better performance
        const [ordersAgg, txAgg, quotationsAgg, salesCustomersAgg, productsAgg, usersAgg, dailySales, topProducts, topCustomers, companySettings, revenueByDay, ordersByDay, quotationTrends, paymentMethodBreakdown, previousPeriodRevenue, categorySales] = await Promise.all([
            // Orders summary
            Order_1.default.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$total' },
                        avgOrderValue: { $avg: '$total' },
                        paidOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] } },
                        pendingOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } },
                        failedPayments: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] } },
                        refundedOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, 1, 0] } }
                    }
                }
            ]),
            // Transactions summary
            Transaction_1.default.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: null,
                        totalTransactions: { $sum: 1 },
                        totalVolume: { $sum: '$amount' },
                        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                        failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
                        refunded: { $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] } },
                        mpesaCount: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'mpesa'] }, 1, 0] } },
                        cardCount: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'card'] }, 1, 0] } },
                        codCount: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'cod'] }, 1, 0] } },
                        mpesaVolume: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'mpesa'] }, '$amount', 0] } },
                        cardVolume: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'card'] }, '$amount', 0] } },
                        codVolume: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'cod'] }, '$amount', 0] } }
                    }
                }
            ]),
            // Quotations summary
            Quotation_1.default.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: null,
                        totalQuotations: { $sum: 1 },
                        convertedCount: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } },
                        acceptedCount: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
                        draftCount: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
                        sentCount: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
                        rejectedCount: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                        expiredCount: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } },
                        totalQuotationValue: { $sum: '$total' }
                    }
                }
            ]),
            // Sales customers summary
            SalesCustomer_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        totalCustomers: { $sum: 1 },
                        activeCustomers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                        inactiveCustomers: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
                        totalCustomerSpent: { $sum: '$totalSpent' },
                        avgCustomerSpent: { $avg: '$totalSpent' }
                    }
                }
            ]),
            // Products summary
            Product_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        totalProducts: { $sum: 1 },
                        lowStockProducts: { $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] } },
                        outOfStockProducts: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } },
                        totalStockValue: { $sum: { $multiply: ['$price', '$stock'] } }
                    }
                }
            ]),
            // Users summary
            User_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        totalUsers: { $sum: 1 },
                        adminUsers: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
                        salesUsers: { $sum: { $cond: [{ $eq: ['$role', 'sales'] }, 1, 0] } },
                        regularUsers: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } },
                        activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } }
                    }
                }
            ]),
            // Daily sales for charts (last 30 days)
            Order_1.default.aggregate([
                {
                    $match: {
                        createdAt: { $gte: periodStart },
                        paymentStatus: 'completed'
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        revenue: { $sum: '$total' },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            // Top 10 products by revenue
            Order_1.default.aggregate([
                { $match: { createdAt: { $gte: periodStart } } },
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.productId',
                        name: { $first: '$items.name' },
                        revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
                        quantity: { $sum: '$items.qty' },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { revenue: -1 } },
                { $limit: 10 }
            ]),
            // Top 10 customers by spending
            Order_1.default.aggregate([
                { $match: { createdAt: { $gte: periodStart } } },
                {
                    $group: {
                        _id: {
                            customerId: { $ifNull: ['$userId', '$guestInfo.email'] },
                            customerName: { $ifNull: ['$shippingAddress.fullName', 'Guest'] }
                        },
                        totalSpent: { $sum: '$total' },
                        orderCount: { $sum: 1 }
                    }
                },
                { $sort: { totalSpent: -1 } },
                { $limit: 10 }
            ]),
            CompanySettings_1.CompanySettings.findOne(),
            // Revenue by day for line chart
            Order_1.default.aggregate([
                {
                    $match: {
                        createdAt: { $gte: periodStart, $lte: periodEnd },
                        paymentStatus: 'completed'
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        revenue: { $sum: '$total' },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            // Orders by day
            Order_1.default.aggregate([
                {
                    $match: {
                        createdAt: { $gte: periodStart, $lte: periodEnd }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        count: { $sum: 1 },
                        paid: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            // Quotation trends by status over time
            Quotation_1.default.aggregate([
                {
                    $match: {
                        createdAt: { $gte: periodStart, $lte: periodEnd }
                    }
                },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                            status: '$status'
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.date': 1 } }
            ]),
            // Payment method breakdown
            Transaction_1.default.aggregate([
                {
                    $match: {
                        createdAt: { $gte: periodStart, $lte: periodEnd },
                        status: 'completed'
                    }
                },
                {
                    $group: {
                        _id: '$paymentMethod',
                        count: { $sum: 1 },
                        volume: { $sum: '$amount' }
                    }
                }
            ]),
            // Previous period revenue for growth calculation
            Order_1.default.aggregate([
                {
                    $match: {
                        createdAt: { $gte: previousPeriod.start, $lte: previousPeriod.end },
                        paymentStatus: 'completed'
                    }
                },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            // Sales by category
            Order_1.default.aggregate([
                { $match: { createdAt: { $gte: periodStart }, paymentStatus: 'completed' } },
                { $unwind: '$items' },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'items.productId',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                { $unwind: '$product' },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'product.categoryId',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $group: {
                        _id: { $ifNull: [{ $arrayElemAt: ['$category.name', 0] }, 'Uncategorized'] },
                        revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
                        quantity: { $sum: '$items.qty' }
                    }
                },
                { $sort: { revenue: -1 } },
                { $limit: 10 }
            ])
        ]);
        // Format responses
        const orders = ordersAgg[0] || {
            totalOrders: 0, totalRevenue: 0, avgOrderValue: 0,
            paidOrders: 0, pendingOrders: 0, failedPayments: 0, refundedOrders: 0
        };
        const transactions = txAgg[0] || {
            totalTransactions: 0, totalVolume: 0, completed: 0,
            pending: 0, failed: 0, refunded: 0,
            mpesaCount: 0, cardCount: 0, codCount: 0,
            mpesaVolume: 0, cardVolume: 0, codVolume: 0
        };
        const quotations = quotationsAgg[0] || {
            totalQuotations: 0, convertedCount: 0, acceptedCount: 0,
            draftCount: 0, sentCount: 0, rejectedCount: 0, expiredCount: 0,
            totalQuotationValue: 0
        };
        const customers = salesCustomersAgg[0] || {
            totalCustomers: 0, activeCustomers: 0, inactiveCustomers: 0,
            totalCustomerSpent: 0, avgCustomerSpent: 0
        };
        const products = productsAgg[0] || {
            totalProducts: 0, lowStockProducts: 0, outOfStockProducts: 0, totalStockValue: 0
        };
        const users = usersAgg[0] || {
            totalUsers: 0, adminUsers: 0, salesUsers: 0, regularUsers: 0, activeUsers: 0
        };
        const taxRate = (_a = companySettings === null || companySettings === void 0 ? void 0 : companySettings.taxRate) !== null && _a !== void 0 ? _a : 0.16;
        // Calculate growth rates
        const currentRevenue = orders.totalRevenue;
        const previousRevenueTotal = ((_b = previousPeriodRevenue[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
        const revenueGrowth = previousRevenueTotal > 0
            ? ((currentRevenue - previousRevenueTotal) / previousRevenueTotal) * 100
            : 0;
        // Calculate order growth
        const previousOrdersAgg = await Order_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousPeriod.start, $lte: previousPeriod.end }
                }
            },
            { $group: { _id: null, total: { $sum: 1 } } }
        ]);
        const previousOrdersTotal = ((_c = previousOrdersAgg[0]) === null || _c === void 0 ? void 0 : _c.total) || 0;
        const orderGrowth = previousOrdersTotal > 0
            ? ((orders.totalOrders - previousOrdersTotal) / previousOrdersTotal) * 100
            : 0;
        // Format daily sales for all dates in range
        const dateMap = new Map();
        let currentDate = new Date(periodStart);
        while (currentDate <= periodEnd) {
            const dateStr = currentDate.toISOString().split('T')[0];
            dateMap.set(dateStr, { revenue: 0, orders: 0 });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        revenueByDay.forEach((day) => {
            if (dateMap.has(day._id)) {
                dateMap.set(day._id, { revenue: day.revenue, orders: day.orders });
            }
        });
        const dailySalesChart = Array.from(dateMap.entries()).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders
        }));
        // Format quotation trends
        const quotationTrendsMap = new Map();
        quotationTrends.forEach((item) => {
            const key = item._id.date;
            if (!quotationTrendsMap.has(key)) {
                quotationTrendsMap.set(key, {});
            }
            quotationTrendsMap.get(key)[item._id.status] = item.count;
        });
        const quotationTrendsChart = Array.from(quotationTrendsMap.entries()).map(([date, statuses]) => ({
            date,
            ...statuses
        }));
        // Format payment method breakdown
        const paymentMethodData = {
            labels: paymentMethodBreakdown.map((p) => p._id.toUpperCase()),
            datasets: [
                {
                    label: 'Transaction Count',
                    data: paymentMethodBreakdown.map((p) => p.count)
                },
                {
                    label: 'Volume (KES)',
                    data: paymentMethodBreakdown.map((p) => p.volume)
                }
            ]
        };
        // Calculate conversion funnels
        const conversionFunnel = {
            quotations: quotations.totalQuotations,
            accepted: quotations.acceptedCount,
            converted: quotations.convertedCount,
            ordered: orders.totalOrders,
            paid: orders.paidOrders,
            rates: {
                quoteToAccepted: quotations.totalQuotations > 0 ? (quotations.acceptedCount / quotations.totalQuotations) * 100 : 0,
                acceptedToConverted: quotations.acceptedCount > 0 ? (quotations.convertedCount / quotations.acceptedCount) * 100 : 0,
                convertedToOrder: quotations.convertedCount > 0 ? (orders.totalOrders / quotations.convertedCount) * 100 : 0,
                orderToPayment: orders.totalOrders > 0 ? (orders.paidOrders / orders.totalOrders) * 100 : 0,
                overall: quotations.totalQuotations > 0 ? (orders.paidOrders / quotations.totalQuotations) * 100 : 0
            }
        };
        // Calculate hourly sales distribution
        const hourlyDistribution = await Order_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: periodStart, $lte: periodEnd },
                    paymentStatus: 'completed'
                }
            },
            {
                $group: {
                    _id: { $hour: '$createdAt' },
                    orders: { $sum: 1 },
                    revenue: { $sum: '$total' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const hourlyChart = Array.from({ length: 24 }, (_, i) => {
            const hour = hourlyDistribution.find((h) => h._id === i);
            return {
                hour: i,
                orders: (hour === null || hour === void 0 ? void 0 : hour.orders) || 0,
                revenue: (hour === null || hour === void 0 ? void 0 : hour.revenue) || 0
            };
        });
        // Get recent orders for activity feed
        const recentOrders = await Order_1.default.find({ createdAt: { $gte: periodStart } })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('orderNumber total paymentStatus status createdAt shippingAddress.fullName');
        return res.json({
            success: true,
            data: {
                period: {
                    from: periodStart,
                    to: periodEnd,
                    label: period
                },
                overview: {
                    totalRevenue: orders.totalRevenue,
                    totalOrders: orders.totalOrders,
                    averageOrderValue: orders.avgOrderValue,
                    revenueGrowth: revenueGrowth.toFixed(1),
                    orderGrowth: orderGrowth.toFixed(1),
                    conversionRate: conversionFunnel.rates.overall.toFixed(1),
                    totalCustomers: customers.totalCustomers,
                    activeCustomers: customers.activeCustomers,
                    totalProducts: products.totalProducts
                },
                orders: {
                    ...orders,
                    completionRate: orders.totalOrders > 0 ? (orders.paidOrders / orders.totalOrders) * 100 : 0
                },
                transactions: {
                    ...transactions,
                    successRate: transactions.totalTransactions > 0
                        ? (transactions.completed / transactions.totalTransactions) * 100
                        : 0,
                    averageValue: transactions.totalTransactions > 0
                        ? transactions.totalVolume / transactions.totalTransactions
                        : 0,
                    methodBreakdown: {
                        mpesa: { count: transactions.mpesaCount, volume: transactions.mpesaVolume },
                        card: { count: transactions.cardCount, volume: transactions.cardVolume },
                        cod: { count: transactions.codCount, volume: transactions.codVolume }
                    }
                },
                quotations: {
                    ...quotations,
                    conversionRate: quotations.totalQuotations > 0
                        ? (quotations.convertedCount / quotations.totalQuotations) * 100
                        : 0
                },
                customers,
                products,
                users,
                charts: {
                    dailySales: dailySalesChart,
                    ordersByDay: ordersByDay.map((day) => ({
                        date: day._id,
                        total: day.count,
                        paid: day.paid,
                        pending: day.pending
                    })),
                    quotationTrends: quotationTrendsChart,
                    paymentMethods: paymentMethodData,
                    hourlyDistribution: hourlyChart,
                    categorySales: categorySales.map((cat) => ({
                        category: cat._id,
                        revenue: cat.revenue,
                        quantity: cat.quantity
                    }))
                },
                topProducts: topProducts.map(p => ({
                    id: p._id,
                    name: p.name,
                    revenue: p.revenue,
                    quantity: p.quantity,
                    orders: p.orders
                })),
                topCustomers: topCustomers.map(c => ({
                    id: c._id.customerId,
                    name: c._id.customerName,
                    totalSpent: c.totalSpent,
                    orderCount: c.orderCount
                })),
                conversionFunnel,
                recentActivities: {
                    orders: recentOrders
                },
                company: { taxRate }
            }
        });
    }
    catch (error) {
        console.error('Admin analytics error:', error);
        return res.status(500).json({ error: 'Failed to fetch admin analytics', details: error.message });
    }
});
// ==================== SALES ANALYTICS ====================
router.get('/sales/overview', auth_1.default, async (req, res) => {
    var _a;
    try {
        if (!isSales(req.user)) {
            return res.status(403).json({ error: 'Sales access required' });
        }
        const salesUserId = req.user.userId;
        const { period = 'month' } = req.query;
        const dateFilter = getDateFilter(period);
        const { start: periodStart, end: periodEnd } = getDateRange(period);
        const previousPeriod = getPreviousPeriodRange(period);
        // Get sales rep details
        const salesRep = await User_1.default.findById(salesUserId).select('name email');
        // Parallel queries for sales person
        const [quotationsAgg, ordersAgg, transactionsAgg, customersAgg, dailyPerformance, topProducts, recentActivities, previousPeriodRevenue, quotationTrends, conversionMetrics] = await Promise.all([
            // My quotations
            Quotation_1.default.aggregate([
                { $match: { ...dateFilter, createdBy: salesUserId } },
                {
                    $group: {
                        _id: null,
                        totalQuotations: { $sum: 1 },
                        convertedCount: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } },
                        acceptedCount: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
                        draftCount: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
                        sentCount: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
                        rejectedCount: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                        totalQuotationValue: { $sum: '$total' }
                    }
                }
            ]),
            // My orders (through customers I created)
            Order_1.default.aggregate([
                { $match: { createdAt: { $gte: periodStart } } },
                {
                    $lookup: {
                        from: 'salescustomers',
                        localField: 'salesCustomerId',
                        foreignField: '_id',
                        as: 'sc'
                    }
                },
                { $unwind: '$sc' },
                { $match: { 'sc.createdBy': salesUserId } },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$total' },
                        paidOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] } },
                        pendingOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } },
                        cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
                        averageOrderValue: { $avg: '$total' }
                    }
                }
            ]),
            // My transactions
            Transaction_1.default.aggregate([
                {
                    $lookup: {
                        from: 'orders',
                        localField: 'orderId',
                        foreignField: '_id',
                        as: 'o'
                    }
                },
                { $unwind: '$o' },
                {
                    $lookup: {
                        from: 'salescustomers',
                        localField: 'o.salesCustomerId',
                        foreignField: '_id',
                        as: 'sc'
                    }
                },
                { $unwind: '$sc' },
                { $match: { 'sc.createdBy': salesUserId, 'o.createdAt': { $gte: periodStart } } },
                {
                    $group: {
                        _id: null,
                        totalTransactions: { $sum: 1 },
                        totalVolume: { $sum: '$amount' },
                        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                        failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
                        refunded: { $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] } }
                    }
                }
            ]),
            // My customers
            SalesCustomer_1.default.aggregate([
                { $match: { createdBy: salesUserId } },
                {
                    $group: {
                        _id: null,
                        totalCustomers: { $sum: 1 },
                        activeCustomers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                        totalCustomerValue: { $sum: '$totalSpent' },
                        avgCustomerValue: { $avg: '$totalSpent' }
                    }
                }
            ]),
            // Daily performance for charts
            Order_1.default.aggregate([
                {
                    $lookup: {
                        from: 'salescustomers',
                        localField: 'salesCustomerId',
                        foreignField: '_id',
                        as: 'sc'
                    }
                },
                { $unwind: '$sc' },
                { $match: { 'sc.createdBy': salesUserId, createdAt: { $gte: periodStart }, paymentStatus: 'completed' } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        revenue: { $sum: '$total' },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            // My top products
            Order_1.default.aggregate([
                {
                    $lookup: {
                        from: 'salescustomers',
                        localField: 'salesCustomerId',
                        foreignField: '_id',
                        as: 'sc'
                    }
                },
                { $unwind: '$sc' },
                { $match: { 'sc.createdBy': salesUserId, createdAt: { $gte: periodStart } } },
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.productId',
                        name: { $first: '$items.name' },
                        revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
                        quantity: { $sum: '$items.qty' },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { revenue: -1 } },
                { $limit: 5 }
            ]),
            // Recent activities
            Promise.all([
                Quotation_1.default.find({ createdBy: salesUserId })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .select('quoteNumber customerName total status createdAt'),
                Order_1.default.aggregate([
                    {
                        $lookup: {
                            from: 'salescustomers',
                            localField: 'salesCustomerId',
                            foreignField: '_id',
                            as: 'sc'
                        }
                    },
                    { $unwind: '$sc' },
                    { $match: { 'sc.createdBy': salesUserId } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 5 },
                    { $project: { orderNumber: 1, total: 1, status: 1, paymentStatus: 1, createdAt: 1, customerName: '$sc.name' } }
                ])
            ]),
            // Previous period revenue for growth
            Order_1.default.aggregate([
                {
                    $lookup: {
                        from: 'salescustomers',
                        localField: 'salesCustomerId',
                        foreignField: '_id',
                        as: 'sc'
                    }
                },
                { $unwind: '$sc' },
                {
                    $match: {
                        'sc.createdBy': salesUserId,
                        createdAt: { $gte: previousPeriod.start, $lte: previousPeriod.end },
                        paymentStatus: 'completed'
                    }
                },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            // Quotation trends over time
            Quotation_1.default.aggregate([
                {
                    $match: {
                        createdBy: salesUserId,
                        createdAt: { $gte: periodStart, $lte: periodEnd }
                    }
                },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                            status: '$status'
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.date': 1 } }
            ]),
            // Conversion metrics by customer segment
            SalesCustomer_1.default.aggregate([
                { $match: { createdBy: salesUserId } },
                {
                    $lookup: {
                        from: 'orders',
                        localField: '_id',
                        foreignField: 'salesCustomerId',
                        as: 'orders'
                    }
                },
                {
                    $project: {
                        name: 1,
                        totalSpent: 1,
                        status: 1,
                        orderCount: { $size: '$orders' },
                        hasOrder: { $gt: [{ $size: '$orders' }, 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalCustomers: { $sum: 1 },
                        convertedCustomers: { $sum: { $cond: ['$hasOrder', 1, 0] } },
                        avgOrderValue: { $avg: '$totalSpent' }
                    }
                }
            ])
        ]);
        const quotes = quotationsAgg[0] || {
            totalQuotations: 0, convertedCount: 0, acceptedCount: 0,
            draftCount: 0, sentCount: 0, rejectedCount: 0,
            totalQuotationValue: 0
        };
        const orders = ordersAgg[0] || {
            totalOrders: 0, totalRevenue: 0, paidOrders: 0,
            pendingOrders: 0, cancelledOrders: 0, averageOrderValue: 0
        };
        const transactions = transactionsAgg[0] || {
            totalTransactions: 0, totalVolume: 0, completed: 0,
            pending: 0, failed: 0, refunded: 0
        };
        const customers = customersAgg[0] || {
            totalCustomers: 0, activeCustomers: 0, totalCustomerValue: 0, avgCustomerValue: 0
        };
        const conversionData = conversionMetrics[0] || {
            totalCustomers: 0,
            convertedCustomers: 0,
            avgOrderValue: 0
        };
        // Calculate conversion rate
        const conversionRate = quotes.totalQuotations > 0
            ? (quotes.convertedCount / quotes.totalQuotations) * 100
            : 0;
        // Calculate revenue growth
        const currentRevenue = orders.totalRevenue;
        const previousRevenueTotal = ((_a = previousPeriodRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        const revenueGrowth = previousRevenueTotal > 0
            ? ((currentRevenue - previousRevenueTotal) / previousRevenueTotal) * 100
            : 0;
        // Calculate customer conversion rate
        const customerConversionRate = customers.totalCustomers > 0
            ? (conversionData.convertedCustomers / customers.totalCustomers) * 100
            : 0;
        // Monthly target (you can make this configurable per sales rep)
        const monthlyTarget = 500000;
        const targetProgress = (currentRevenue / monthlyTarget) * 100;
        const remainingTarget = Math.max(0, monthlyTarget - currentRevenue);
        // Format daily performance chart
        const dateMap = new Map();
        let currentDate = new Date(periodStart);
        while (currentDate <= periodEnd) {
            const dateStr = currentDate.toISOString().split('T')[0];
            dateMap.set(dateStr, { revenue: 0, orders: 0 });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        dailyPerformance.forEach((day) => {
            if (dateMap.has(day._id)) {
                dateMap.set(day._id, { revenue: day.revenue, orders: day.orders });
            }
        });
        const dailyPerformanceChart = Array.from(dateMap.entries()).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders
        }));
        // Format quotation trends
        const quotationTrendsMap = new Map();
        quotationTrends.forEach((item) => {
            const key = item._id.date;
            if (!quotationTrendsMap.has(key)) {
                quotationTrendsMap.set(key, {});
            }
            quotationTrendsMap.get(key)[item._id.status] = item.count;
        });
        const quotationTrendsChart = Array.from(quotationTrendsMap.entries()).map(([date, statuses]) => ({
            date,
            ...statuses
        }));
        const [recentQuotations, recentOrders] = recentActivities;
        return res.json({
            success: true,
            data: {
                period: {
                    from: periodStart,
                    to: periodEnd,
                    label: period
                },
                salesRep: {
                    name: salesRep === null || salesRep === void 0 ? void 0 : salesRep.name,
                    email: salesRep === null || salesRep === void 0 ? void 0 : salesRep.email
                },
                overview: {
                    totalRevenue: orders.totalRevenue,
                    totalOrders: orders.totalOrders,
                    averageOrderValue: orders.averageOrderValue,
                    conversionRate: conversionRate.toFixed(1),
                    customerConversionRate: customerConversionRate.toFixed(1),
                    revenueGrowth: revenueGrowth.toFixed(1),
                    totalCustomers: customers.totalCustomers,
                    activeCustomers: customers.activeCustomers,
                    totalQuotations: quotes.totalQuotations,
                    successRate: transactions.totalTransactions > 0
                        ? (transactions.completed / transactions.totalTransactions) * 100
                        : 0
                },
                quotations: {
                    ...quotes,
                    conversionRate: conversionRate.toFixed(1),
                    acceptanceRate: quotes.totalQuotations > 0
                        ? (quotes.acceptedCount / quotes.totalQuotations) * 100
                        : 0
                },
                orders: {
                    ...orders,
                    completionRate: orders.totalOrders > 0
                        ? (orders.paidOrders / orders.totalOrders) * 100
                        : 0
                },
                transactions: {
                    ...transactions,
                    successRate: transactions.totalTransactions > 0
                        ? (transactions.completed / transactions.totalTransactions) * 100
                        : 0,
                    averageValue: transactions.totalTransactions > 0
                        ? transactions.totalVolume / transactions.totalTransactions
                        : 0
                },
                customers: {
                    ...customers,
                    conversionRate: customerConversionRate,
                    convertedCustomers: conversionData.convertedCustomers
                },
                monthlyTarget: {
                    target: monthlyTarget,
                    current: currentRevenue,
                    remaining: remainingTarget,
                    progress: Math.min(targetProgress, 100)
                },
                charts: {
                    dailyPerformance: dailyPerformanceChart,
                    quotationTrends: quotationTrendsChart
                },
                topProducts: topProducts.map(p => ({
                    id: p._id,
                    name: p.name,
                    revenue: p.revenue,
                    quantity: p.quantity,
                    orders: p.orders
                })),
                recentActivities: {
                    quotations: recentQuotations,
                    orders: recentOrders
                }
            }
        });
    }
    catch (error) {
        console.error('Sales analytics error:', error);
        return res.status(500).json({ error: 'Failed to fetch sales analytics', details: error.message });
    }
});
// ==================== PERFORMANCE METRICS ====================
router.get('/performance', auth_1.default, async (req, res) => {
    try {
        if (!isAdminOrSales(req.user)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const isAdminUser = isAdmin(req.user);
        const salesUserId = !isAdminUser ? req.user.userId : null;
        const { period = 'month' } = req.query;
        const { start: periodStart } = getDateRange(period);
        // Sales rep performance (admin only)
        let salesRepPerformance = [];
        let teamSummary = null;
        if (isAdminUser) {
            const salesReps = await User_1.default.find({ role: 'sales', isActive: true });
            const performanceData = await Promise.all(salesReps.map(async (rep) => {
                const [quoteStats, orderStats, customerStats] = await Promise.all([
                    Quotation_1.default.aggregate([
                        { $match: { createdBy: rep._id, createdAt: { $gte: periodStart } } },
                        {
                            $group: {
                                _id: null,
                                totalQuotes: { $sum: 1 },
                                convertedQuotes: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } },
                                acceptedQuotes: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
                                totalValue: { $sum: '$total' }
                            }
                        }
                    ]),
                    Order_1.default.aggregate([
                        {
                            $lookup: {
                                from: 'salescustomers',
                                localField: 'salesCustomerId',
                                foreignField: '_id',
                                as: 'sc'
                            }
                        },
                        { $unwind: '$sc' },
                        { $match: { 'sc.createdBy': rep._id, createdAt: { $gte: periodStart } } },
                        {
                            $group: {
                                _id: null,
                                totalOrders: { $sum: 1 },
                                totalRevenue: { $sum: '$total' },
                                paidOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] } },
                                pendingOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } }
                            }
                        }
                    ]),
                    SalesCustomer_1.default.aggregate([
                        { $match: { createdBy: rep._id } },
                        {
                            $group: {
                                _id: null,
                                totalCustomers: { $sum: 1 },
                                activeCustomers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                                totalValue: { $sum: '$totalSpent' }
                            }
                        }
                    ])
                ]);
                const quotes = quoteStats[0] || { totalQuotes: 0, convertedQuotes: 0, acceptedQuotes: 0, totalValue: 0 };
                const orders = orderStats[0] || { totalOrders: 0, totalRevenue: 0, paidOrders: 0, pendingOrders: 0 };
                const customers = customerStats[0] || { totalCustomers: 0, activeCustomers: 0, totalValue: 0 };
                return {
                    id: rep._id,
                    name: rep.name,
                    email: rep.email,
                    avatar: rep.avatar,
                    metrics: {
                        quotes: {
                            total: quotes.totalQuotes,
                            converted: quotes.convertedQuotes,
                            accepted: quotes.acceptedQuotes,
                            conversionRate: quotes.totalQuotes > 0 ? (quotes.convertedQuotes / quotes.totalQuotes) * 100 : 0,
                            acceptanceRate: quotes.totalQuotes > 0 ? (quotes.acceptedQuotes / quotes.totalQuotes) * 100 : 0,
                            totalValue: quotes.totalValue
                        },
                        orders: {
                            total: orders.totalOrders,
                            revenue: orders.totalRevenue,
                            paid: orders.paidOrders,
                            pending: orders.pendingOrders,
                            averageValue: orders.totalOrders > 0 ? orders.totalRevenue / orders.totalOrders : 0,
                            completionRate: orders.totalOrders > 0 ? (orders.paidOrders / orders.totalOrders) * 100 : 0
                        },
                        customers: {
                            total: customers.totalCustomers,
                            active: customers.activeCustomers,
                            totalValue: customers.totalValue,
                            avgValue: customers.totalCustomers > 0 ? customers.totalValue / customers.totalCustomers : 0
                        }
                    }
                };
            }));
            salesRepPerformance = performanceData;
            // Calculate team summary
            teamSummary = {
                totalRevenue: salesRepPerformance.reduce((sum, rep) => sum + rep.metrics.orders.revenue, 0),
                totalOrders: salesRepPerformance.reduce((sum, rep) => sum + rep.metrics.orders.total, 0),
                totalQuotes: salesRepPerformance.reduce((sum, rep) => sum + rep.metrics.quotes.total, 0),
                totalCustomers: salesRepPerformance.reduce((sum, rep) => sum + rep.metrics.customers.total, 0),
                avgConversionRate: salesRepPerformance.reduce((sum, rep) => sum + rep.metrics.quotes.conversionRate, 0) / (salesRepPerformance.length || 1),
                topPerformer: salesRepPerformance.length > 0
                    ? salesRepPerformance.reduce((prev, current) => prev.metrics.orders.revenue > current.metrics.orders.revenue ? prev : current)
                    : null
            };
        }
        else {
            // For sales users, get their own ranking
            const allSalesReps = await User_1.default.find({ role: 'sales', isActive: true });
            const allPerformance = await Promise.all(allSalesReps.map(async (rep) => {
                var _a;
                const orderStats = await Order_1.default.aggregate([
                    {
                        $lookup: {
                            from: 'salescustomers',
                            localField: 'salesCustomerId',
                            foreignField: '_id',
                            as: 'sc'
                        }
                    },
                    { $unwind: '$sc' },
                    { $match: { 'sc.createdBy': rep._id, createdAt: { $gte: periodStart }, paymentStatus: 'completed' } },
                    { $group: { _id: null, total: { $sum: '$total' } } }
                ]);
                return {
                    id: rep._id,
                    name: rep.name,
                    revenue: ((_a = orderStats[0]) === null || _a === void 0 ? void 0 : _a.total) || 0
                };
            }));
            const sortedByRevenue = allPerformance.sort((a, b) => b.revenue - a.revenue);
            const currentRepRank = sortedByRevenue.findIndex(r => r.id === salesUserId) + 1;
            salesRepPerformance = [{
                    rank: currentRepRank,
                    totalReps: allSalesReps.length,
                    topPerformers: sortedByRevenue.slice(0, 5)
                }];
        }
        return res.json({
            success: true,
            data: {
                salesRepPerformance,
                teamSummary,
                period
            }
        });
    }
    catch (error) {
        console.error('Performance metrics error:', error);
        return res.status(500).json({ error: 'Failed to fetch performance metrics' });
    }
});
// ==================== EXPORT ANALYTICS ====================
router.get('/export', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { period = 'month', type = 'all' } = req.query;
        const { start: periodStart, end: periodEnd } = getDateRange(period);
        let exportData = {};
        if (type === 'orders' || type === 'all') {
            const orders = await Order_1.default.find({
                createdAt: { $gte: periodStart, $lte: periodEnd }
            }).sort({ createdAt: -1 }).lean();
            exportData.orders = orders;
        }
        if (type === 'transactions' || type === 'all') {
            const transactions = await Transaction_1.default.find({
                createdAt: { $gte: periodStart, $lte: periodEnd }
            }).sort({ createdAt: -1 }).lean();
            exportData.transactions = transactions;
        }
        if (type === 'quotations' || type === 'all') {
            const quotations = await Quotation_1.default.find({
                createdAt: { $gte: periodStart, $lte: periodEnd }
            }).sort({ createdAt: -1 }).lean();
            exportData.quotations = quotations;
        }
        if (type === 'customers' || type === 'all') {
            const customers = await SalesCustomer_1.default.find().lean();
            exportData.customers = customers;
        }
        res.json({
            success: true,
            data: exportData,
            metadata: {
                period,
                from: periodStart,
                to: periodEnd,
                exportedAt: new Date(),
                type
            }
        });
    }
    catch (error) {
        console.error('Export analytics error:', error);
        return res.status(500).json({ error: 'Failed to export analytics' });
    }
});
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map
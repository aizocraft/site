"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/orderRoutes.ts
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Order_1 = __importDefault(require("../models/Order"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = __importDefault(require("../middleware/auth"));
const optionalAuth_1 = __importDefault(require("../middleware/optionalAuth"));
const email_service_1 = require("../services/email.service");
const ShippingArea_1 = __importDefault(require("../models/ShippingArea"));
const PromoCode_1 = __importDefault(require("../models/PromoCode"));
const CompanySettings_1 = require("../models/CompanySettings");
const notification_service_1 = require("../services/notification.service");
const router = (0, express_1.Router)();
// Helper function to validate email
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
// Helper function to validate phone (Kenyan format)
const isValidPhone = (phone) => {
    return /^(07|\+2547|2547)\d{8}$/.test(phone);
};
// Helper function to get product image URL
const getImageUrl = (image) => {
    if (!image)
        return '';
    if (image.url)
        return image.url;
    if (image.fileId)
        return `${process.env.API_URL || 'http://localhost:4000/api'}/products/image/${image.fileId}`;
    return '';
};
// POST /api/orders - Create order (supports both auth and guest)
router.post('/', optionalAuth_1.default, async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const { items, shippingAddress, paymentMethod, guestInfo, notes, shippingAreaId, promoCode } = req.body;
        // Validation
        if (!items || !items.length) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address1) {
            return res.status(400).json({ error: 'Complete shipping address is required' });
        }
        if (!paymentMethod || !['cod', 'mpesa', 'card', 'cash', 'bank_transfer', 'cheque'].includes(paymentMethod)) {
            return res.status(400).json({ error: 'Valid payment method is required' });
        }
        if (!shippingAreaId) {
            return res.status(400).json({ error: 'Shipping area is required' });
        }
        // Handle user identification
        let userId;
        let guestInfoData = undefined;
        if (req.user && req.user.userId) {
            userId = req.user.userId;
            console.log('✅ Authenticated user creating order:', userId);
        }
        else {
            console.log('👤 Guest user creating order');
            if (!guestInfo || (!guestInfo.email && !guestInfo.phone)) {
                return res.status(400).json({
                    error: 'Guest email or phone is required for unregistered users'
                });
            }
            if (guestInfo.email && !isValidEmail(guestInfo.email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            if (guestInfo.phone && !isValidPhone(guestInfo.phone)) {
                return res.status(400).json({ error: 'Invalid phone number format. Use 07XXXXXXXX or +2547XXXXXXXX' });
            }
            guestInfoData = {
                email: guestInfo.email,
                phone: guestInfo.phone,
                name: guestInfo.name || shippingAddress.fullName
            };
        }
        // Process items and verify stock with profit tracking
        let calculatedSubtotal = 0;
        let totalCost = 0;
        let totalProfit = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await Product_1.default.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item.productId}` });
            }
            if (product.stock < item.qty) {
                return res.status(400).json({
                    error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                });
            }
            const sellingPrice = parseFloat(product.price.toString());
            const buyingPrice = parseFloat(((_a = product.buyingPrice) === null || _a === void 0 ? void 0 : _a.toString()) || '0');
            const profitPerItem = sellingPrice - buyingPrice;
            const itemTotal = sellingPrice * item.qty;
            const itemCost = buyingPrice * item.qty;
            const itemProfit = profitPerItem * item.qty;
            calculatedSubtotal += itemTotal;
            totalCost += itemCost;
            totalProfit += itemProfit;
            orderItems.push({
                productId: item.productId,
                name: product.name,
                slug: product.slug,
                image: getImageUrl((_b = product.images) === null || _b === void 0 ? void 0 : _b[0]),
                sellingPrice: sellingPrice,
                buyingPrice: buyingPrice,
                profit: profitPerItem,
                qty: item.qty,
                description: product.description || ''
            });
            // Update stock
            product.stock -= item.qty;
            await product.save();
        }
        console.log('Subtotal:', calculatedSubtotal);
        console.log('Total Cost:', totalCost);
        console.log('Total Profit:', totalProfit);
        // Calculate shipping, tax, discount
        const shippingArea = await ShippingArea_1.default.findOne({ _id: shippingAreaId, isActive: true });
        if (!shippingArea) {
            return res.status(400).json({ error: 'Invalid shipping area' });
        }
        let discount = 0;
        let appliedPromo = null;
        let promoCodeStr = promoCode;
        if (promoCode) {
            const promo = await PromoCode_1.default.findOne({ code: promoCode.toUpperCase(), isActive: true });
            if (promo && promo.canUse(calculatedSubtotal)) {
                discount = promo.type === 'percent'
                    ? calculatedSubtotal * (promo.value / 100)
                    : Math.min(promo.value, calculatedSubtotal);
                appliedPromo = promo._id;
                promoCodeStr = promo.code;
                promo.usedCount += 1;
                await promo.save();
            }
            else {
                console.log('Promo not valid');
                promoCodeStr = undefined;
            }
        }
        // In src/routes/orderRoutes.ts, replace the tax calculation section
        const shippingCost = (shippingArea.freeThreshold > 0 && calculatedSubtotal >= shippingArea.freeThreshold) ? 0 : shippingArea.baseCost;
        // Get company settings for tax calculation
        const settings = await CompanySettings_1.CompanySettings.findOne();
        const taxRate = (_c = settings === null || settings === void 0 ? void 0 : settings.taxRate) !== null && _c !== void 0 ? _c : 0.16;
        const taxExemptCategories = (_d = settings === null || settings === void 0 ? void 0 : settings.taxExemptCategories) !== null && _d !== void 0 ? _d : [];
        // Calculate tax based on product categories
        let taxableSubtotal = 0;
        let taxExemptSubtotal = 0;
        for (const item of orderItems) {
            const product = await Product_1.default.findById(item.productId);
            if (product) {
                const categoryName = product.category || '';
                const isTaxExempt = taxExemptCategories.some((cat) => categoryName.toLowerCase().includes(cat.toLowerCase()));
                if (isTaxExempt) {
                    taxExemptSubtotal += item.sellingPrice * item.qty;
                }
                else {
                    taxableSubtotal += item.sellingPrice * item.qty;
                }
            }
            else {
                taxableSubtotal += item.sellingPrice * item.qty;
            }
        }
        const tax = taxableSubtotal * taxRate;
        const finalTotal = calculatedSubtotal + shippingCost - discount + tax;
        console.log('Order Tax Calculation:', {
            calculatedSubtotal,
            taxableSubtotal,
            taxExemptSubtotal,
            taxRate,
            tax,
            taxExemptCategories,
            finalTotal
        });
        // Create order
        const orderData = {
            items: orderItems,
            subtotal: calculatedSubtotal,
            totalCost: totalCost,
            totalProfit: totalProfit,
            shippingCost,
            tax,
            discount,
            total: finalTotal,
            selectedShippingArea: shippingArea._id,
            appliedPromoCode: appliedPromo,
            shippingAddress: {
                ...shippingAddress,
                email: shippingAddress.email || (guestInfoData === null || guestInfoData === void 0 ? void 0 : guestInfoData.email)
            },
            paymentMethod,
            // ✅ Accept paymentStatus from request, default to 'unpaid'
            paymentStatus: req.body.paymentStatus || 'unpaid',
            // ✅ Accept status from request, default based on payment method
            status: req.body.status || (paymentMethod === 'cod' ? 'pending' : 'processing'),
            notes: notes || null
        };
        if (userId) {
            orderData.userId = userId;
        }
        else {
            orderData.guestInfo = guestInfoData;
        }
        const order = new Order_1.default(orderData);
        await order.save();
        // Get customer information for emails
        let customerName = shippingAddress.fullName;
        let customerEmail = shippingAddress.email || '';
        let customerPhone = shippingAddress.phone;
        if (userId) {
            const user = await User_1.default.findById(userId);
            if (user) {
                customerName = user.name || customerName;
                customerEmail = user.email || customerEmail;
            }
        }
        else if (guestInfoData) {
            customerName = guestInfoData.name || customerName;
            customerEmail = guestInfoData.email || customerEmail;
            customerPhone = guestInfoData.phone || customerPhone;
        }
        // Format shipping address for email
        const formattedAddress = `${shippingAddress.address1}${shippingAddress.address2 ? ', ' + shippingAddress.address2 : ''}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}, ${shippingAddress.country}`;
        // Prepare email items
        const emailItems = orderItems.map(item => ({
            name: item.name,
            quantity: item.qty,
            price: item.sellingPrice
        }));
        // Send order confirmation to customer
        (0, email_service_1.sendOrderConfirmation)({
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            customerName: customerName,
            customerEmail: customerEmail,
            subtotal: calculatedSubtotal,
            shippingCost: shippingCost,
            discount: discount,
            tax: tax,
            total: finalTotal,
            promoCode: promoCodeStr,
            status: order.status,
            items: emailItems
        }).catch(err => console.error('Failed to send customer confirmation:', err));
        // Send admin notification
        if (process.env.ADMIN_EMAIL) {
            (0, email_service_1.sendAdminOrderNotification)({
                orderId: order._id.toString(),
                orderNumber: order.orderNumber,
                customerName: customerName,
                customerEmail: customerEmail,
                customerPhone: customerPhone,
                shippingAddress: formattedAddress,
                subtotal: calculatedSubtotal,
                shippingCost: shippingCost,
                discount: discount,
                tax: tax,
                total: finalTotal,
                promoCode: promoCodeStr,
                paymentMethod: paymentMethod,
                status: order.status,
                items: emailItems,
                orderDate: order.createdAt || new Date()
            }).catch(err => console.error('Failed to send admin notification:', err));
        }
        // Create order notifications
        try {
            const adminUsers = await User_1.default.find({ role: 'admin', isActive: true });
            if (adminUsers.length > 0) {
                const notificationPromises = adminUsers.map(admin => (0, notification_service_1.createNotification)({
                    userId: admin._id.toString(),
                    type: 'order',
                    title: `🛍️ New Order #${order.orderNumber}`,
                    message: `Order placed by ${customerName} (Total: KES ${finalTotal.toFixed(2)}, Profit: KES ${totalProfit.toFixed(2)})`,
                    actionUrl: `/dashboard/orders/${order._id}`,
                    metadata: {
                        orderId: order._id.toString(),
                        orderNumber: order.orderNumber,
                        customerName: customerName,
                        customerEmail: customerEmail,
                        paymentMethod: paymentMethod,
                        total: finalTotal,
                        profit: totalProfit
                    }
                }));
                await Promise.all(notificationPromises);
            }
            if (userId) {
                await (0, notification_service_1.createNotification)({
                    userId: userId.toString(),
                    type: 'order',
                    title: `✅ Order Confirmed #${order.orderNumber}`,
                    message: `Your order has been confirmed. Total: KES ${finalTotal.toFixed(2)}`,
                    actionUrl: `/orders/${order._id}`,
                    metadata: {
                        orderId: order._id.toString(),
                        orderNumber: order.orderNumber,
                        total: finalTotal,
                        status: order.status
                    }
                });
            }
        }
        catch (notificationErr) {
            console.error('Failed to create order notifications:', notificationErr);
        }
        // Return response
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            _id: order._id,
            orderNumber: order.orderNumber,
            total: Number(order.total),
            subtotal: Number(order.subtotal),
            shippingCost: Number(order.shippingCost),
            tax: Number(order.tax),
            discount: Number(order.discount),
            totalProfit: Number(order.totalProfit),
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
                _id: item._id,
                productId: item.productId,
                name: item.name,
                image: item.image,
                sellingPrice: Number(item.sellingPrice),
                buyingPrice: Number(item.buyingPrice),
                profit: Number(item.profit),
                qty: item.qty
            })),
            shippingAddress: order.shippingAddress
        });
    }
    catch (error) {
        console.error('Order creation error:', error);
        res.status(400).json({
            error: error.message || 'Failed to create order'
        });
    }
});
// GET /api/orders/profit/analytics - Profit analytics endpoint
router.get('/profit/analytics', auth_1.default, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { startDate, endDate } = req.query;
        const matchStage = {
            status: { $in: ['paid', 'delivered', 'processing'] }
        };
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate)
                matchStage.createdAt.$gte = new Date(startDate);
            if (endDate)
                matchStage.createdAt.$lte = new Date(endDate);
        }
        const pipeline = [
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' },
                    totalCost: { $sum: '$totalCost' },
                    totalProfit: { $sum: '$totalProfit' },
                    totalOrders: { $sum: 1 },
                    totalUnitsSold: { $sum: { $sum: '$items.qty' } }
                }
            },
            {
                $addFields: {
                    averageOrderValue: { $cond: [{ $gt: ['$totalOrders', 0] }, { $divide: ['$totalRevenue', '$totalOrders'] }, 0] },
                    profitMargin: { $cond: [{ $gt: ['$totalRevenue', 0] }, { $multiply: [{ $divide: ['$totalProfit', '$totalRevenue'] }, 100] }, 0] },
                    averageProfitPerOrder: { $cond: [{ $gt: ['$totalOrders', 0] }, { $divide: ['$totalProfit', '$totalOrders'] }, 0] }
                }
            }
        ];
        const results = await Order_1.default.aggregate(pipeline);
        const analytics = results[0] || {
            totalRevenue: 0,
            totalCost: 0,
            totalProfit: 0,
            totalOrders: 0,
            totalUnitsSold: 0,
            averageOrderValue: 0,
            profitMargin: 0,
            averageProfitPerOrder: 0
        };
        res.json({
            success: true,
            analytics
        });
    }
    catch (error) {
        console.error('Profit analytics error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/orders/track/:orderNumber - Track order by order number (public)
router.get('/track/:orderNumber', async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const orderId = 'ORD-' + orderNumber;
        const order = await Order_1.default.findOne({
            $or: [
                { _id: orderNumber },
                { _id: orderId }
            ]
        }).populate('items.productId', 'name images');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const safeOrder = {
            orderNumber: order.orderNumber,
            status: order.status,
            total: Number(order.total),
            createdAt: order.createdAt,
            estimatedDelivery: order.estimatedDelivery,
            trackingNumber: order.trackingNumber,
            items: order.items.map((item) => ({
                name: item.name,
                qty: item.qty,
                image: item.image
            }))
        };
        res.json(safeOrder);
    }
    catch (error) {
        console.error('Track order error:', error);
        res.status(500).json({ error: 'Failed to track order' });
    }
});
// GET /api/orders/guest/:email/:phone - Get guest orders
router.get('/guest/:email/:phone', async (req, res) => {
    try {
        const { email, phone } = req.params;
        const orders = await Order_1.default.find({
            'guestInfo.email': email,
            'guestInfo.phone': phone
        }).sort({ createdAt: -1 });
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            total: Number(order.total),
            status: order.status,
            createdAt: order.createdAt,
            itemsCount: order.items.length
        }));
        res.json(formattedOrders);
    }
    catch (error) {
        console.error('Fetch guest orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
// GET /api/orders - Get user orders (authenticated users)
router.get('/', auth_1.default, async (req, res) => {
    try {
        const orders = await Order_1.default.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .populate('items.productId', 'name images rating');
        const formattedOrders = orders.map(order => ({
            ...order.toObject(),
            orderNumber: order.orderNumber,
            total: Number(order.total),
            subtotal: Number(order.subtotal),
            totalProfit: Number(order.totalProfit),
            items: order.items.map((item) => ({
                ...item.toObject(),
                sellingPrice: Number(item.sellingPrice),
                buyingPrice: Number(item.buyingPrice),
                profit: Number(item.profit)
            }))
        }));
        res.json(formattedOrders);
    }
    catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
// GET /api/orders/:id - Get single order
router.get('/:id', optionalAuth_1.default, async (req, res) => {
    var _a;
    try {
        const orderId = req.params.id;
        let order = null;
        if (mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            const validOrderId = new mongoose_1.default.Types.ObjectId(orderId);
            order = await Order_1.default.findById(validOrderId)
                .populate('items.productId', 'name images rating');
        }
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        let hasAccess = false;
        if (req.user && req.user.userId) {
            hasAccess = ((_a = order.userId) === null || _a === void 0 ? void 0 : _a.toString()) === req.user.userId || req.user.role === 'admin';
        }
        else {
            hasAccess = true;
        }
        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const formattedOrder = {
            ...order.toObject(),
            orderNumber: order.orderNumber,
            total: Number(order.total),
            subtotal: Number(order.subtotal),
            totalProfit: Number(order.totalProfit),
            items: order.items.map((item) => ({
                ...item.toObject(),
                sellingPrice: Number(item.sellingPrice),
                buyingPrice: Number(item.buyingPrice),
                profit: Number(item.profit)
            }))
        };
        res.json(formattedOrder);
    }
    catch (error) {
        console.error('Fetch order error:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});
// GET /api/orders/admin/orders - Get all orders for admin (paginated)
router.get('/admin/orders', auth_1.default, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const paymentMethod = req.query.paymentMethod;
        const search = req.query.search;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order === 'asc' ? 1 : -1;
        const query = {};
        if (status)
            query.status = status;
        if (paymentMethod)
            query.paymentMethod = paymentMethod;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = new Date(startDate);
            if (endDate)
                query.createdAt.$lte = new Date(endDate);
        }
        if (search) {
            query.$or = [
                { 'guestInfo.email': { $regex: search, $options: 'i' } },
                { 'guestInfo.phone': { $regex: search, $options: 'i' } },
                { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
            ];
        }
        if (search) {
            query.$or = [
                { 'guestInfo.email': { $regex: search, $options: 'i' } },
                { 'guestInfo.phone': { $regex: search, $options: 'i' } },
                { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
            ];
        }
        const [orders, total] = await Promise.all([
            Order_1.default.find(query)
                .populate('userId', 'name email')
                .populate('items.productId', 'name slug images rating')
                .populate('selectedShippingArea', 'name')
                .populate('appliedPromoCode', 'code')
                .sort({ [sortField]: sortOrder })
                .limit(limit)
                .skip(skip),
            Order_1.default.countDocuments(query)
        ]);
        const formattedOrders = orders.map((order) => ({
            ...order.toObject(),
            orderNumber: order.orderNumber,
            total: Number(order.total),
            subtotal: Number(order.subtotal),
            totalProfit: Number(order.totalProfit),
            totalCost: Number(order.totalCost),
            items: order.items.map((item) => ({
                ...item.toObject(),
                sellingPrice: Number(item.sellingPrice),
                buyingPrice: Number(item.buyingPrice),
                profit: Number(item.profit)
            }))
        }));
        res.json({
            orders: formattedOrders,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                limit
            }
        });
    }
    catch (error) {
        console.error('Admin orders fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch admin orders' });
    }
});
// PUT /api/orders/:id/cancel - Cancel order
router.put('/:id/cancel', optionalAuth_1.default, async (req, res) => {
    var _a, _b, _c;
    try {
        const orderId = req.params.id;
        const { email, phone } = req.body;
        const order = await Order_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        let hasPermission = false;
        if (req.user && req.user.userId) {
            hasPermission = ((_a = order.userId) === null || _a === void 0 ? void 0 : _a.toString()) === req.user.userId;
        }
        else {
            hasPermission = ((_b = order.guestInfo) === null || _b === void 0 ? void 0 : _b.email) === email || ((_c = order.guestInfo) === null || _c === void 0 ? void 0 : _c.phone) === phone;
        }
        if (!hasPermission) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        if (!order.canCancel || (typeof order.canCancel === 'function' && !order.canCancel())) {
            return res.status(400).json({
                error: `Cannot cancel order with status: ${order.status}`
            });
        }
        // Restore stock for each item
        for (const item of order.items) {
            await Product_1.default.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.qty }
            });
        }
        order.status = 'cancelled';
        if (order.paymentStatus === 'paid' || order.paymentStatus === 'partially_paid') {
            order.paymentStatus = 'refunded';
        }
        await order.save();
        const formattedOrder = {
            ...order.toObject(),
            orderNumber: order.orderNumber,
            total: Number(order.total),
            items: order.items.map((item) => ({
                ...item.toObject(),
                sellingPrice: Number(item.sellingPrice),
                buyingPrice: Number(item.buyingPrice),
                profit: Number(item.profit)
            }))
        };
        res.json({
            success: true,
            message: 'Order cancelled successfully',
            order: formattedOrder
        });
    }
    catch (error) {
        console.error('Order cancellation error:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});
// PATCH /api/admin/orders/:id/status - Admin status update
router.patch('/admin/orders/:id/status', auth_1.default, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { status, trackingNumber, estimatedDelivery } = req.body;
        const orderId = req.params.id;
        const validStatuses = ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }
        const validOrderId = new mongoose_1.default.Types.ObjectId(orderId);
        const order = await Order_1.default.findById(validOrderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (status === 'cancelled' && order.status !== 'cancelled') {
            for (const item of order.items) {
                await Product_1.default.findByIdAndUpdate(item.productId, {
                    $inc: { stock: item.qty }
                });
            }
        }
        order.status = status;
        if (trackingNumber)
            order.trackingNumber = trackingNumber;
        if (estimatedDelivery)
            order.estimatedDelivery = new Date(estimatedDelivery);
        if (status === 'paid') {
            if (order.amountPaid >= order.total) {
                order.paymentStatus = 'paid';
            }
            else if (order.amountPaid > 0) {
                order.paymentStatus = 'partially_paid';
            }
            else {
                order.paymentStatus = 'paid';
            }
        }
        else if (status === 'cancelled' || status === 'refunded') {
            order.paymentStatus = 'refunded';
        }
        await order.save();
        try {
            const adminUsers = await User_1.default.find({ role: 'admin', isActive: true }).limit(1);
            if (adminUsers.length > 0 && status !== 'pending') {
                const firstAdmin = adminUsers[0];
                await (0, notification_service_1.createNotification)({
                    userId: firstAdmin._id.toString(),
                    type: 'order',
                    title: `Order #${order.orderNumber} - ${status.toUpperCase()}`,
                    message: `Status updated to: ${status}`,
                    actionUrl: `/dashboard/orders/${order._id}`,
                    metadata: {
                        orderId: order._id.toString(),
                        oldStatus: req.body.oldStatus || 'unknown',
                        newStatus: status
                    }
                });
            }
        }
        catch (notificationErr) {
            console.error('Failed to create status notification:', notificationErr);
        }
        const populated = await Order_1.default.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('items.productId', 'name images');
        const formattedOrder = {
            ...populated.toObject(),
            orderNumber: populated.orderNumber,
            total: Number(populated.total),
            totalProfit: Number(populated.totalProfit),
            items: populated.items.map((item) => ({
                ...item.toObject(),
                sellingPrice: Number(item.sellingPrice),
                buyingPrice: Number(item.buyingPrice),
                profit: Number(item.profit)
            }))
        };
        res.json({
            success: true,
            message: `Status updated to ${status}`,
            order: formattedOrder
        });
    }
    catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});
// POST /api/orders/:id/retry-payment - Retry failed payment
router.post('/:id/retry-payment', optionalAuth_1.default, async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const validOrderId = new mongoose_1.default.Types.ObjectId(orderId);
        const order = await Order_1.default.findById(validOrderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.paymentStatus === 'refunded') {
            return res.status(400).json({ error: 'Cannot retry payment for refunded order' });
        }
        const failedTransaction = await Transaction_1.default.findOne({
            orderId: order._id,
            status: 'failed'
        });
        if (!failedTransaction) {
            return res.status(400).json({ error: 'No failed payment found to retry' });
        }
        order.paymentStatus = 'unpaid';
        await order.save();
        res.json({
            success: true,
            message: 'Payment retry initiated',
            orderId: order._id,
            failedTransactionId: failedTransaction.transactionId
        });
    }
    catch (error) {
        console.error('Payment retry error:', error);
        res.status(500).json({ error: 'Failed to retry payment' });
    }
});
// GET /api/orders/stats/summary - Get order statistics (admin)
router.get('/admin/stats/summary', auth_1.default, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const stats = await Order_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$total' },
                    totalProfit: { $sum: '$totalProfit' },
                    averageOrderValue: { $avg: '$total' },
                    codOrders: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'cod'] }, 1, 0] } },
                    mpesaOrders: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'mpesa'] }, 1, 0] } },
                    cardOrders: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'card'] }, 1, 0] } }
                }
            }
        ]);
        const statusBreakdown = await Order_1.default.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    revenue: { $sum: '$total' },
                    profit: { $sum: '$totalProfit' }
                }
            }
        ]);
        res.json({
            summary: stats[0] || {
                totalOrders: 0,
                totalRevenue: 0,
                totalProfit: 0,
                averageOrderValue: 0,
                codOrders: 0,
                mpesaOrders: 0,
                cardOrders: 0
            },
            statusBreakdown
        });
    }
    catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});
// GET /api/orders/:id/can-retry - Check if order can retry payment
router.get('/:id/can-retry', optionalAuth_1.default, async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }
        const order = await Order_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Check if order can retry payment
        const canRetry = order.paymentStatus === 'unpaid';
        const lastTransaction = await Transaction_1.default.findOne({
            orderId: order._id
        }).sort({ createdAt: -1 });
        res.json({
            canRetry,
            orderId: order._id,
            orderNumber: order.orderNumber,
            paymentStatus: order.paymentStatus,
            lastTransactionStatus: (lastTransaction === null || lastTransaction === void 0 ? void 0 : lastTransaction.status) || null
        });
    }
    catch (error) {
        console.error('Check retry error:', error);
        res.status(500).json({ error: 'Failed to check retry status' });
    }
});
exports.default = router;
//# sourceMappingURL=order.routes.js.map
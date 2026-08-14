"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const optionalAuth_1 = __importDefault(require("../middleware/optionalAuth"));
const email_service_1 = require("../services/email.service");
const router = (0, express_1.Router)();
// Initialize Stripe
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-02-25.clover',
    typescript: true
});
// POST /api/stripe/create-payment-intent
router.post('/create-payment-intent', optionalAuth_1.default, async (req, res) => {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { orderId, successUrl, cancelUrl } = req.body;
        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }
        // Find order
        const order = await Order_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.paymentStatus !== 'unpaid') {
            return res.status(400).json({ error: `Order cannot be paid. Current status: ${order.paymentStatus}` });
        }
        // Check for existing pending payment intent
        const existingTransaction = await Transaction_1.default.findOne({
            orderId: order._id,
            status: 'pending',
            paymentMethod: 'card'
        });
        if (existingTransaction) {
            // Retrieve existing payment intent
            const paymentIntent = await stripe.paymentIntents.retrieve(existingTransaction.transactionId);
            return res.json({
                success: true,
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
                successUrl,
                cancelUrl
            });
        }
        // Create customer if user is authenticated
        let customerId;
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) {
            const user = await User_1.default.findById(req.user.userId);
            if (user === null || user === void 0 ? void 0 : user.stripeCustomerId) {
                customerId = user.stripeCustomerId;
            }
            else if (user === null || user === void 0 ? void 0 : user.email) {
                const customer = await stripe.customers.create({
                    email: user.email,
                    name: user.name,
                    metadata: { userId: req.user.userId }
                });
                customerId = customer.id;
                // Save customer ID to user
                await User_1.default.findByIdAndUpdate(req.user.userId, { stripeCustomerId: customerId });
            }
        }
        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.total * 100), // Convert to cents
            currency: 'kes',
            customer: customerId,
            metadata: {
                orderId: order._id.toString(),
                orderNumber: order.orderNumber,
                userId: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId) || 'guest'
            },
            receipt_email: ((_c = order.guestInfo) === null || _c === void 0 ? void 0 : _c.email) || order.shippingAddress.email,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            },
            ...(successUrl && cancelUrl ? {
                redirect: {
                    return_url: successUrl
                }
            } : {})
        });
        // Create transaction record
        const transaction = new Transaction_1.default({
            orderId: order._id,
            userId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.userId,
            guestEmail: (_e = order.guestInfo) === null || _e === void 0 ? void 0 : _e.email,
            guestPhone: (_f = order.guestInfo) === null || _f === void 0 ? void 0 : _f.phone,
            customerName: order.shippingAddress.fullName,
            amount: order.total,
            currency: 'KES',
            paymentMethod: 'card',
            status: 'pending',
            transactionId: paymentIntent.id,
            notes: `Payment intent created for order ${order.orderNumber}`
        });
        await transaction.save();
        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            successUrl,
            cancelUrl
        });
    }
    catch (error) {
        console.error('Stripe payment intent error:', error);
        res.status(500).json({
            error: 'Failed to create payment intent',
            message: error.message
        });
    }
});
// POST /api/stripe/webhook
router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('Stripe webhook secret not configured');
        return res.status(500).json({ error: 'Webhook secret missing' });
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentIntentFailed(event.data.object);
                break;
            case 'payment_intent.canceled':
                await handlePaymentIntentCanceled(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});
// Helper: Handle successful payment
async function handlePaymentIntentSucceeded(paymentIntent) {
    const transactionId = paymentIntent.id;
    const orderId = paymentIntent.metadata.orderId;
    // Find transaction
    const transaction = await Transaction_1.default.findOne({ transactionId });
    if (!transaction) {
        console.error(`Transaction not found: ${transactionId}`);
        return;
    }
    // Prevent duplicate processing
    if (transaction.status === 'completed') {
        console.log(`Transaction ${transactionId} already completed`);
        return;
    }
    // Get card details
    let cardLast4;
    let cardBrand;
    if (paymentIntent.payment_method && typeof paymentIntent.payment_method === 'object') {
        const paymentMethod = paymentIntent.payment_method;
        if (paymentMethod.card) {
            cardLast4 = paymentMethod.card.last4;
            cardBrand = paymentMethod.card.brand;
        }
    }
    // Update transaction
    transaction.status = 'completed';
    transaction.cardLast4 = cardLast4;
    transaction.cardBrand = cardBrand;
    transaction.notes = `Payment completed via Stripe. Payment Intent: ${paymentIntent.id}`;
    await transaction.save();
    // Find and update order
    const order = await Order_1.default.findById(orderId);
    if (!order) {
        console.error(`Order not found: ${orderId}`);
        return;
    }
    order.paymentStatus = 'paid';
    order.status = 'processing';
    order.paymentDetails = {
        transactionId: paymentIntent.id,
        cardLast4,
        cardBrand,
        paidAt: new Date()
    };
    order.stripeId = paymentIntent.id;
    await order.save();
    // Send confirmation email
    const customerEmail = transaction.guestEmail || order.shippingAddress.email;
    if (customerEmail) {
        (0, email_service_1.sendPaymentConfirmation)({
            email: customerEmail,
            customerName: transaction.customerName,
            orderNumber: order.orderNumber,
            amount: transaction.amount,
            transactionId: paymentIntent.id,
            paymentMethod: `Card (${cardBrand || 'Card'} ending in ${cardLast4 || '****'})`,
            items: order.items.map(item => ({
                name: item.name,
                quantity: item.qty,
                price: item.sellingPrice
            }))
        }).catch(err => console.error('Failed to send payment confirmation:', err));
    }
    console.log(`Payment succeeded: ${paymentIntent.id} for order ${order.orderNumber}`);
}
// Helper: Handle failed payment
async function handlePaymentIntentFailed(paymentIntent) {
    var _a, _b;
    const transactionId = paymentIntent.id;
    const orderId = paymentIntent.metadata.orderId;
    const transaction = await Transaction_1.default.findOne({ transactionId });
    if (transaction && transaction.status === 'pending') {
        transaction.status = 'failed';
        transaction.notes = `Payment failed: ${((_a = paymentIntent.last_payment_error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error'}`;
        await transaction.save();
        const order = await Order_1.default.findById(orderId);
        if (order) {
            order.paymentStatus = 'unpaid';
            await order.save();
            // Send failure notification
            const customerEmail = transaction.guestEmail || order.shippingAddress.email;
            if (customerEmail) {
                (0, email_service_1.sendPaymentFailedNotification)({
                    email: customerEmail,
                    customerName: transaction.customerName,
                    orderNumber: order.orderNumber,
                    amount: transaction.amount,
                    reason: ((_b = paymentIntent.last_payment_error) === null || _b === void 0 ? void 0 : _b.message) || 'Payment failed'
                }).catch(err => console.error('Failed to send failure notification:', err));
            }
        }
        console.error(`Payment failed: ${transactionId}`);
    }
}
// Helper: Handle canceled payment
async function handlePaymentIntentCanceled(paymentIntent) {
    const transactionId = paymentIntent.id;
    const transaction = await Transaction_1.default.findOne({ transactionId });
    if (transaction && transaction.status === 'pending') {
        transaction.status = 'failed';
        transaction.notes = 'Payment was canceled by customer';
        await transaction.save();
        const order = await Order_1.default.findById(transaction.orderId);
        if (order && order.paymentStatus === 'unpaid') { // FIXED: Use 'unpaid' instead of 'pending'
            order.paymentStatus = 'unpaid';
            await order.save();
        }
        console.log(`Payment canceled: ${transactionId}`);
    }
}
// GET /api/stripe/payment-status/:paymentIntentId
router.get('/payment-status/:paymentIntentId', optionalAuth_1.default, async (req, res) => {
    try {
        const { paymentIntentId } = req.params;
        const transaction = await Transaction_1.default.findOne({ transactionId: paymentIntentId })
            .populate('orderId', 'orderNumber total status');
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({
            status: transaction.status,
            amount: transaction.amount,
            paymentMethod: transaction.paymentMethod,
            cardLast4: transaction.cardLast4,
            cardBrand: transaction.cardBrand,
            createdAt: transaction.createdAt,
            order: transaction.orderId
        });
    }
    catch (error) {
        console.error('Payment status error:', error);
        res.status(500).json({ error: 'Failed to fetch payment status' });
    }
});
exports.default = router;
//# sourceMappingURL=stripe.routes.js.map
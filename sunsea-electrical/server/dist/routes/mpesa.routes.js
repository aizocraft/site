"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Order_1 = __importDefault(require("../models/Order"));
const optionalAuth_1 = __importDefault(require("../middleware/optionalAuth"));
const email_service_1 = require("../services/email.service");
const router = (0, express_1.Router)();
// Helper: Get M-PESA Access Token
async function getMpesaToken() {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    if (!consumerKey || !consumerSecret) {
        throw new Error('M-PESA credentials not configured');
    }
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const response = await axios_1.default.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: {
            Authorization: `Basic ${auth}`
        },
        timeout: 10000
    });
    return response.data.access_token;
}
// Helper: Generate M-PESA Password
function generateMpesaPassword() {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const str = `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`;
    const password = Buffer.from(str).toString('base64');
    return { password, timestamp };
}
// Helper: Validate Kenyan phone number
function validateKenyanPhone(phone) {
    let normalized = phone.replace(/^\+254/, '254').replace(/^0/, '254');
    if (/^2547\d{8}$/.test(normalized)) {
        return normalized;
    }
    return null;
}
// POST /api/mpesa/stk-push - Initiate M-PESA STK Push
router.post('/stk-push', optionalAuth_1.default, async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const { orderId, phoneNumber } = req.body;
        if (!orderId || !phoneNumber) {
            return res.status(400).json({ error: 'Order ID and phone number are required' });
        }
        // Validate phone
        const normalizedPhone = validateKenyanPhone(phoneNumber);
        if (!normalizedPhone) {
            return res.status(400).json({ error: 'Invalid Kenyan phone number. Use format: 07XXXXXXXX or 2547XXXXXXXX' });
        }
        // Find order
        const order = await Order_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.paymentStatus !== 'unpaid') {
            return res.status(400).json({ error: `Order cannot be paid. Current status: ${order.paymentStatus}` });
        }
        // Check if there's already a pending transaction
        const existingTransaction = await Transaction_1.default.findOne({
            orderId: order._id,
            status: 'pending',
            paymentMethod: 'mpesa'
        });
        if (existingTransaction) {
            return res.status(400).json({
                error: 'Payment already in progress',
                checkoutRequestId: existingTransaction.transactionId
            });
        }
        // Get M-PESA token
        const token = await getMpesaToken();
        const { password, timestamp } = generateMpesaPassword();
        // Prepare STK Push request
        const stkPushRequest = {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(order.total),
            PartyA: normalizedPhone,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: normalizedPhone,
            CallBackURL: `${process.env.BASE_URL || 'http://localhost:4000'}/api/mpesa/callback`,
            AccountReference: order.orderNumber,
            TransactionDesc: `Payment for ${order.orderNumber}`
        };
        // Make STK Push request
        const response = await axios_1.default.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', stkPushRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });
        const { CheckoutRequestID, ResponseCode, ResponseDescription } = response.data;
        if (ResponseCode !== '0') {
            throw new Error(`STK Push failed: ${ResponseDescription}`);
        }
        // Create transaction record
        const transaction = new Transaction_1.default({
            orderId: order._id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            guestEmail: (_b = order.guestInfo) === null || _b === void 0 ? void 0 : _b.email,
            guestPhone: ((_c = order.guestInfo) === null || _c === void 0 ? void 0 : _c.phone) || normalizedPhone,
            customerName: order.shippingAddress.fullName,
            amount: order.total,
            currency: 'KES',
            paymentMethod: 'mpesa',
            status: 'pending',
            transactionId: CheckoutRequestID,
            notes: `STK Push initiated to ${normalizedPhone}`
        });
        await transaction.save();
        res.json({
            success: true,
            checkoutRequestId: CheckoutRequestID,
            message: 'STK Push initiated. Check your phone for M-PESA PIN prompt.',
            phoneNumber: normalizedPhone
        });
    }
    catch (error) {
        console.error('STK Push error:', error);
        // Handle specific errors
        if ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) {
            return res.status(400).json({
                error: 'M-PESA service error',
                details: error.response.data.errorMessage || error.response.data
            });
        }
        res.status(500).json({
            error: 'Failed to initiate STK Push',
            message: error.message
        });
    }
});
// POST /api/mpesa/callback - M-PESA Callback (Webhook)
router.post('/callback', async (req, res) => {
    var _a, _b, _c, _d;
    try {
        console.log('M-PESA Callback received:', JSON.stringify(req.body, null, 2));
        const { Body } = req.body;
        if (!Body || !Body.stkCallback) {
            console.error('Invalid callback structure');
            return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid callback data' });
        }
        const stkCallback = Body.stkCallback;
        const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback;
        // Find transaction
        const transaction = await Transaction_1.default.findOne({ transactionId: CheckoutRequestID });
        if (!transaction) {
            console.error(`Transaction not found: ${CheckoutRequestID}`);
            return res.status(404).json({ ResultCode: 1, ResultDesc: 'Transaction not found' });
        }
        // Find associated order
        const order = await Order_1.default.findById(transaction.orderId);
        if (!order) {
            console.error(`Order not found for transaction: ${transaction.orderId}`);
            return res.status(404).json({ ResultCode: 1, ResultDesc: 'Order not found' });
        }
        if (ResultCode === 0) {
            // Payment successful
            const metadata = (CallbackMetadata === null || CallbackMetadata === void 0 ? void 0 : CallbackMetadata.Item) || [];
            const mpesaReceipt = (_a = metadata.find((item) => item.Name === 'MpesaReceiptNumber')) === null || _a === void 0 ? void 0 : _a.Value;
            const amount = (_b = metadata.find((item) => item.Name === 'Amount')) === null || _b === void 0 ? void 0 : _b.Value;
            const phone = (_c = metadata.find((item) => item.Name === 'PhoneNumber')) === null || _c === void 0 ? void 0 : _c.Value;
            const transactionDate = (_d = metadata.find((item) => item.Name === 'TransactionDate')) === null || _d === void 0 ? void 0 : _d.Value;
            // Update transaction
            transaction.status = 'completed';
            if (mpesaReceipt) {
                transaction.mpesaReceipt = mpesaReceipt;
                transaction.notes = `Payment completed. Receipt: ${mpesaReceipt}`;
            }
            else {
                transaction.notes = 'Payment completed (receipt unavailable)';
            }
            await transaction.save();
            order.paymentStatus = 'paid';
            order.status = 'processing'; // Order ready for fulfillment
            order.paymentDetails = {
                transactionId: CheckoutRequestID,
                mpesaReceipt: mpesaReceipt || '',
                paidAt: new Date(),
                phoneNumber: phone || ''
            };
            await order.save();
            // Send confirmation email (don't await)
            const customerEmail = transaction.guestEmail || order.shippingAddress.email;
            if (customerEmail) {
                (0, email_service_1.sendPaymentConfirmation)({
                    email: customerEmail,
                    customerName: transaction.customerName,
                    orderNumber: order.orderNumber,
                    amount: transaction.amount,
                    transactionId: mpesaReceipt || CheckoutRequestID || 'N/A',
                    paymentMethod: 'M-PESA',
                    items: order.items.map(item => ({
                        name: item.name,
                        quantity: item.qty,
                        price: item.sellingPrice
                    }))
                }).catch(err => console.error('Failed to send payment confirmation:', err));
            }
            console.log(`Payment successful: ${mpesaReceipt || CheckoutRequestID} for order ${order.orderNumber}`);
        }
        else {
            // Payment failed
            transaction.status = 'failed';
            transaction.notes = `Payment failed: ${ResultDesc}`;
            await transaction.save();
            // FIXED: Use 'unpaid' instead of 'failed'
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
                    reason: ResultDesc
                }).catch(err => console.error('Failed to send payment failure notification:', err));
            }
            console.error(`Payment failed for order ${order.orderNumber}: ${ResultDesc}`);
        }
        res.json({ ResultCode: 0, ResultDesc: 'Success' });
    }
    catch (error) {
        console.error('M-PESA callback error:', error);
        res.status(500).json({ ResultCode: 1, ResultDesc: 'Callback processing failed' });
    }
});
// POST /api/mpesa/query - Query STK Push status
router.post('/query', optionalAuth_1.default, async (req, res) => {
    try {
        const { checkoutRequestId } = req.body;
        if (!checkoutRequestId) {
            return res.status(400).json({ error: 'CheckoutRequestID is required' });
        }
        // Find transaction
        const transaction = await Transaction_1.default.findOne({ transactionId: checkoutRequestId });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        // Get M-PESA token
        const token = await getMpesaToken();
        const { password, timestamp } = generateMpesaPassword();
        // Query status
        const queryRequest = {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestId
        };
        const response = await axios_1.default.post('https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query', queryRequest, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        const { ResultCode, ResultDesc } = response.data;
        res.json({
            checkoutRequestId,
            status: transaction.status,
            resultCode: ResultCode,
            resultDesc: ResultDesc,
            transaction: {
                id: transaction._id,
                amount: transaction.amount,
                mpesaReceipt: transaction.mpesaReceipt,
                createdAt: transaction.createdAt
            }
        });
    }
    catch (error) {
        console.error('STK Query error:', error);
        res.status(500).json({ error: 'Failed to query payment status' });
    }
});
exports.default = router;
//# sourceMappingURL=mpesa.routes.js.map
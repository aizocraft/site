"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const db_1 = __importDefault(require("./config/db"));
const gridfs_1 = require("./config/gridfs");
const auditMiddleware_1 = require("./middleware/auditMiddleware");
const passport_2 = require("./config/passport");
const Product_1 = __importDefault(require("./models/Product"));
const Review_1 = __importDefault(require("./models/Review"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const feedback_routes_1 = __importDefault(require("./routes/feedback.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const email_routes_1 = __importDefault(require("./routes/email.routes"));
const audit_routes_1 = __importDefault(require("./routes/audit.routes"));
const healthz_routes_1 = __importDefault(require("./routes/healthz.routes"));
const shipping_routes_1 = __importDefault(require("./routes/shipping.routes"));
const promo_routes_1 = __importDefault(require("./routes/promo.routes"));
const orderCalc_routes_1 = __importDefault(require("./routes/orderCalc.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const sales_routes_1 = __importDefault(require("./routes/sales.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const supplier_routes_1 = __importDefault(require("./routes/supplier.routes"));
const profit_routes_1 = __importDefault(require("./routes/profit.routes"));
const mpesa_routes_1 = __importDefault(require("./routes/mpesa.routes"));
dotenv_1.default.config();
// Connect to DB and initialize GridFS
(0, db_1.default)().then(() => {
    (0, gridfs_1.initGridFS)();
    console.log('✅ GridFS initialized');
}).catch((error) => {
    console.error('Failed to initialize GridFS:', error);
});
const app = (0, express_1.default)();
// Session middleware (required for passport)
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your_session_secret_key_change_this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
// Initialize passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passport_2.configurePassport)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Apply audit middleware (retained)
app.use(auditMiddleware_1.auditContextMiddleware);
app.use((0, auditMiddleware_1.autoAuditMiddleware)({
    excludePaths: [
        '/health',
        '/healthz',
        '/metrics',
        '/api/company/logo/',
        '/api/company/favicon/',
        '/api/auth/google',
        '/api/auth/google/callback'
    ],
    includeBody: false // Don't log sensitive data
}));
// Routes
app.use('/api/categories', (0, categoryRoutes_1.default)());
app.use('/api/products', (0, product_routes_1.default)(Product_1.default));
app.use('/api/reviews', (0, review_routes_1.default)(Review_1.default, Product_1.default));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/company', companyRoutes_1.default);
app.use('/api/feedback', feedback_routes_1.default);
app.use('/api/contact', contact_routes_1.default);
app.use('/api/email', email_routes_1.default);
app.use('/api/audit', audit_routes_1.default);
app.use('/api/shipping', shipping_routes_1.default);
app.use('/api/promo', promo_routes_1.default);
app.use('/api/order/calculate', orderCalc_routes_1.default);
app.use('/api/transactions', transaction_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/sales', sales_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/inventory', inventory_routes_1.default);
app.use('/api/suppliers', supplier_routes_1.default);
app.use('/api/profits', profit_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/mpesa', mpesa_routes_1.default);
app.use('/', healthz_routes_1.default);
// Health check (excluded from audit)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        googleAuth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💓 Healthz endpoint: http://localhost:${PORT}/healthz`);
    console.log(`🔐 Google Auth: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Not configured'}`);
});
//# sourceMappingURL=server.js.map
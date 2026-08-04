"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/inventoryRoutes.ts
const express_1 = require("express");
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = __importDefault(require("../middleware/auth"));
const auditMiddleware_1 = require("../middleware/auditMiddleware");
const router = (0, express_1.Router)();
const isAdmin = (req) => { var _a; return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin'; };
// GET /api/inventory/summary - Inventory value summary
router.get('/summary', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const inventoryStats = await Product_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalStockValue: { $sum: { $multiply: ['$buyingPrice', '$stock'] } },
                    totalInventoryValue: { $sum: { $multiply: ['$price', '$stock'] } },
                    totalPotentialProfit: { $sum: { $multiply: [{ $subtract: ['$price', '$buyingPrice'] }, '$stock'] } },
                    totalUnits: { $sum: '$stock' },
                    lowStockItems: { $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] } },
                    outOfStockItems: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } }
                }
            }
        ]);
        const categoryBreakdown = await Product_1.default.aggregate([
            {
                $group: {
                    _id: { $ifNull: ['$category', 'Uncategorized'] },
                    stockValue: { $sum: { $multiply: ['$buyingPrice', '$stock'] } },
                    inventoryValue: { $sum: { $multiply: ['$price', '$stock'] } },
                    units: { $sum: '$stock' }
                }
            },
            { $sort: { stockValue: -1 } }
        ]);
        res.json({
            summary: inventoryStats[0] || {
                totalStockValue: 0,
                totalInventoryValue: 0,
                totalPotentialProfit: 0,
                totalUnits: 0,
                lowStockItems: 0,
                outOfStockItems: 0
            },
            categoryBreakdown
        });
    }
    catch (error) {
        console.error('Inventory summary error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/inventory/low-stock - Get low stock products
router.get('/low-stock', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { threshold = '10', category, supplier } = req.query;
        const stockThreshold = parseInt(threshold);
        const query = { stock: { $lte: stockThreshold } };
        if (category)
            query.category = category;
        if (supplier)
            query.supplier = supplier;
        const products = await Product_1.default.find(query)
            .select('name sku category brand price buyingPrice stock supplierName')
            .sort({ stock: 1 })
            .lean();
        res.json({
            products,
            count: products.length,
            threshold: stockThreshold
        });
    }
    catch (error) {
        console.error('Low stock error:', error);
        res.status(500).json({ error: error.message });
    }
});
// POST /api/inventory/restock/:productId - Record restock
router.post('/restock/:productId', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { quantity, buyingPrice, reason } = req.body;
        const product = await Product_1.default.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const newQuantity = parseInt(quantity);
        if (isNaN(newQuantity) || newQuantity <= 0) {
            return res.status(400).json({ error: 'Valid quantity required' });
        }
        // Update stock
        product.stock += newQuantity;
        // Update buying price if provided and different
        if (buyingPrice && buyingPrice !== product.buyingPrice) {
            await product.updateBuyingPrice(buyingPrice, req.user.userId, reason || 'Restock');
        }
        await product.save();
        await (0, auditMiddleware_1.createAuditLog)(req, {
            action: 'restock',
            resource: 'product',
            resourceId: product._id.toString(),
            details: `Restocked ${newQuantity} units of ${product.name}. New stock: ${product.stock}`,
            skipIfNoUser: false
        });
        res.json({
            success: true,
            product: {
                _id: product._id,
                name: product.name,
                stock: product.stock,
                buyingPrice: product.buyingPrice
            }
        });
    }
    catch (error) {
        console.error('Restock error:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=inventory.routes.js.map
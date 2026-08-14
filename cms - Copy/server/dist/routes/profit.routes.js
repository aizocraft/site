"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/profitRoutes.ts
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const ProfitAnalysis_1 = __importDefault(require("../models/ProfitAnalysis"));
const Supplier_1 = __importDefault(require("../models/Supplier"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
// Helper: Check if user is admin
const isAdmin = (req) => { var _a; return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin'; };
// GET /api/profits/summary - Overall profit summary
router.get('/summary', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { startDate, endDate, category, supplier, brand } = req.query;
        const matchStage = {};
        // Date filter
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate)
                matchStage.createdAt.$gte = new Date(startDate);
            if (endDate)
                matchStage.createdAt.$lte = new Date(endDate);
        }
        // Status filter - only completed/paid orders
        matchStage.status = { $in: ['paid', 'delivered', 'processing'] };
        // Aggregation pipeline for profit analysis
        const pipeline = [
            { $match: matchStage },
            { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    effectiveProfit: {
                        $cond: [
                            { $gt: ['$items.profit', 0] },
                            '$items.profit',
                            { $subtract: ['$items.sellingPrice', '$items.buyingPrice'] }
                        ]
                    },
                    effectiveBuyingPrice: {
                        $cond: [
                            { $gt: ['$items.buyingPrice', 0] },
                            '$items.buyingPrice',
                            '$productInfo.buyingPrice'
                        ]
                    },
                    category: '$productInfo.category',
                    brand: '$productInfo.brand',
                    supplierId: '$productInfo.supplier',
                    supplierName: '$productInfo.supplierName'
                }
            }
        ];
        // Apply filters
        if (category) {
            pipeline.push({ $match: { category: category } });
        }
        if (supplier) {
            pipeline.push({ $match: { supplierId: new mongoose_1.default.Types.ObjectId(supplier) } });
        }
        if (brand) {
            pipeline.push({ $match: { brand: brand } });
        }
        // Group for summary
        const summaryPipeline = [
            ...pipeline,
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ['$items.sellingPrice', '$items.qty'] } },
                    totalCost: { $sum: { $multiply: ['$effectiveBuyingPrice', '$items.qty'] } },
                    totalProfit: { $sum: { $multiply: ['$effectiveProfit', '$items.qty'] } },
                    totalUnitsSold: { $sum: '$items.qty' }
                }
            }
        ];
        const summaryResult = await Order_1.default.aggregate(summaryPipeline);
        const summary = summaryResult[0] || { totalRevenue: 0, totalCost: 0, totalProfit: 0, totalUnitsSold: 0 };
        // Calculate overall margin
        const overallMargin = summary.totalRevenue > 0
            ? (summary.totalProfit / summary.totalRevenue) * 100
            : 0;
        res.json({
            success: true,
            summary: {
                totalRevenue: summary.totalRevenue,
                totalCost: summary.totalCost,
                totalProfit: summary.totalProfit,
                totalUnitsSold: summary.totalUnitsSold,
                overallMargin: overallMargin.toFixed(2)
            }
        });
    }
    catch (error) {
        console.error('Profit summary error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/profits/by-product - Profit breakdown by product
router.get('/by-product', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { startDate, endDate, category, supplier, brand, sortBy = 'profit', limit = '50' } = req.query;
        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate)
                matchStage.createdAt.$gte = new Date(startDate);
            if (endDate)
                matchStage.createdAt.$lte = new Date(endDate);
        }
        matchStage.status = { $in: ['paid', 'delivered', 'processing'] };
        const pipeline = [
            { $match: matchStage },
            { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$items.productId',
                    productName: { $first: '$items.name' },
                    productSku: { $first: '$productInfo.sku' },
                    category: { $first: '$productInfo.category' },
                    brand: { $first: '$productInfo.brand' },
                    supplierId: { $first: '$productInfo.supplier' },
                    supplierName: { $first: '$productInfo.supplierName' },
                    totalUnitsSold: { $sum: '$items.qty' },
                    totalRevenue: { $sum: { $multiply: ['$items.sellingPrice', '$items.qty'] } },
                    totalCost: { $sum: {
                            $multiply: [
                                { $ifNull: ['$items.buyingPrice', '$productInfo.buyingPrice'] },
                                '$items.qty'
                            ]
                        } },
                    totalProfit: { $sum: {
                            $multiply: [
                                { $ifNull: ['$items.profit', { $subtract: ['$items.sellingPrice', { $ifNull: ['$items.buyingPrice', '$productInfo.buyingPrice'] }] }] },
                                '$items.qty'
                            ]
                        } }
                }
            },
            {
                $addFields: {
                    averageMargin: {
                        $cond: [
                            { $gt: ['$totalRevenue', 0] },
                            { $multiply: [{ $divide: ['$totalProfit', '$totalRevenue'] }, 100] },
                            0
                        ]
                    },
                    averageSellingPrice: {
                        $cond: [
                            { $gt: ['$totalUnitsSold', 0] },
                            { $divide: ['$totalRevenue', '$totalUnitsSold'] },
                            0
                        ]
                    },
                    averageBuyingPrice: {
                        $cond: [
                            { $gt: ['$totalUnitsSold', 0] },
                            { $divide: ['$totalCost', '$totalUnitsSold'] },
                            0
                        ]
                    }
                }
            }
        ];
        // Apply filters
        if (category) {
            pipeline.push({ $match: { category: category } });
        }
        if (supplier) {
            pipeline.push({ $match: { supplierId: new mongoose_1.default.Types.ObjectId(supplier) } });
        }
        if (brand) {
            pipeline.push({ $match: { brand: brand } });
        }
        // Sorting
        const sortField = sortBy;
        let sortKey = 'totalProfit';
        if (sortField === 'profit')
            sortKey = 'totalProfit';
        else if (sortField === 'margin')
            sortKey = 'averageMargin';
        else if (sortField === 'unitsSold')
            sortKey = 'totalUnitsSold';
        else if (sortField === 'revenue')
            sortKey = 'totalRevenue';
        pipeline.push({ $sort: { [sortKey]: -1 } });
        // Limit
        const limitNum = Math.min(parseInt(limit) || 50, 200);
        pipeline.push({ $limit: limitNum });
        const results = await Order_1.default.aggregate(pipeline);
        res.json({
            success: true,
            products: results,
            totalProducts: results.length
        });
    }
    catch (error) {
        console.error('Profit by product error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/profits/by-category - Profit breakdown by category
router.get('/by-category', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { startDate, endDate } = req.query;
        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate)
                matchStage.createdAt.$gte = new Date(startDate);
            if (endDate)
                matchStage.createdAt.$lte = new Date(endDate);
        }
        matchStage.status = { $in: ['paid', 'delivered', 'processing'] };
        const pipeline = [
            { $match: matchStage },
            { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { $ifNull: ['$productInfo.category', 'Uncategorized'] },
                    totalRevenue: { $sum: { $multiply: ['$items.sellingPrice', '$items.qty'] } },
                    totalCost: { $sum: {
                            $multiply: [
                                { $ifNull: ['$items.buyingPrice', '$productInfo.buyingPrice'] },
                                '$items.qty'
                            ]
                        } },
                    totalUnitsSold: { $sum: '$items.qty' }
                }
            },
            {
                $addFields: {
                    totalProfit: { $subtract: ['$totalRevenue', '$totalCost'] },
                    margin: {
                        $cond: [
                            { $gt: ['$totalRevenue', 0] },
                            { $multiply: [{ $divide: [{ $subtract: ['$totalRevenue', '$totalCost'] }, '$totalRevenue'] }, 100] },
                            0
                        ]
                    }
                }
            },
            { $sort: { totalProfit: -1 } }
        ];
        const results = await Order_1.default.aggregate(pipeline);
        res.json({
            success: true,
            categories: results
        });
    }
    catch (error) {
        console.error('Profit by category error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/profits/by-supplier - Profit breakdown by supplier
router.get('/by-supplier', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { startDate, endDate } = req.query;
        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate)
                matchStage.createdAt.$gte = new Date(startDate);
            if (endDate)
                matchStage.createdAt.$lte = new Date(endDate);
        }
        matchStage.status = { $in: ['paid', 'delivered', 'processing'] };
        const pipeline = [
            { $match: matchStage },
            { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { $ifNull: ['$productInfo.supplierName', 'No Supplier'] },
                    supplierId: { $first: '$productInfo.supplier' },
                    totalRevenue: { $sum: { $multiply: ['$items.sellingPrice', '$items.qty'] } },
                    totalCost: { $sum: {
                            $multiply: [
                                { $ifNull: ['$items.buyingPrice', '$productInfo.buyingPrice'] },
                                '$items.qty'
                            ]
                        } },
                    totalUnitsSold: { $sum: '$items.qty' }
                }
            },
            {
                $addFields: {
                    totalProfit: { $subtract: ['$totalRevenue', '$totalCost'] },
                    margin: {
                        $cond: [
                            { $gt: ['$totalRevenue', 0] },
                            { $multiply: [{ $divide: [{ $subtract: ['$totalRevenue', '$totalCost'] }, '$totalRevenue'] }, 100] },
                            0
                        ]
                    }
                }
            },
            { $sort: { totalProfit: -1 } }
        ];
        const results = await Order_1.default.aggregate(pipeline);
        // Get supplier details for those with supplierId
        const suppliers = await Supplier_1.default.find({ status: 'active' }).select('name email phone totalPurchases');
        res.json({
            success: true,
            suppliers: results,
            allSuppliers: suppliers
        });
    }
    catch (error) {
        console.error('Profit by supplier error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/profits/trends - Profit trends over time
router.get('/trends', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { period = 'monthly', months = '12' } = req.query;
        const monthsBack = parseInt(months) || 12;
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - monthsBack);
        const matchStage = {
            createdAt: { $gte: startDate },
            status: { $in: ['paid', 'delivered', 'processing'] }
        };
        let groupFormat = '';
        if (period === 'daily') {
            groupFormat = '%Y-%m-%d';
        }
        else if (period === 'weekly') {
            groupFormat = '%Y-%U';
        }
        else {
            groupFormat = '%Y-%m';
        }
        const pipeline = [
            { $match: matchStage },
            { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: groupFormat, date: '$createdAt' }
                    },
                    revenue: { $sum: { $multiply: ['$items.sellingPrice', '$items.qty'] } },
                    cost: { $sum: {
                            $multiply: [
                                { $ifNull: ['$items.buyingPrice', '$productInfo.buyingPrice'] },
                                '$items.qty'
                            ]
                        } },
                    unitsSold: { $sum: '$items.qty' }
                }
            },
            {
                $addFields: {
                    profit: { $subtract: ['$revenue', '$cost'] },
                    margin: {
                        $cond: [
                            { $gt: ['$revenue', 0] },
                            { $multiply: [{ $divide: [{ $subtract: ['$revenue', '$cost'] }, '$revenue'] }, 100] },
                            0
                        ]
                    }
                }
            },
            { $sort: { _id: 1 } }
        ];
        const results = await Order_1.default.aggregate(pipeline);
        res.json({
            success: true,
            period,
            trends: results
        });
    }
    catch (error) {
        console.error('Profit trends error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/profits/top-products - Top performing products
router.get('/top-products', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { metric = 'profit', limit = '10' } = req.query;
        const pipeline = [
            {
                $match: {
                    status: { $in: ['paid', 'delivered', 'processing'] }
                }
            },
            { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$items.productId',
                    name: { $first: '$items.name' },
                    sku: { $first: '$productInfo.sku' },
                    category: { $first: '$productInfo.category' },
                    totalRevenue: { $sum: { $multiply: ['$items.sellingPrice', '$items.qty'] } },
                    totalProfit: { $sum: {
                            $multiply: [
                                { $ifNull: ['$items.profit', { $subtract: ['$items.sellingPrice', { $ifNull: ['$items.buyingPrice', '$productInfo.buyingPrice'] }] }] },
                                '$items.qty'
                            ]
                        } },
                    totalUnitsSold: { $sum: '$items.qty' }
                }
            },
            {
                $addFields: {
                    profitPerUnit: {
                        $cond: [
                            { $gt: ['$totalUnitsSold', 0] },
                            { $divide: ['$totalProfit', '$totalUnitsSold'] },
                            0
                        ]
                    },
                    margin: {
                        $cond: [
                            { $gt: ['$totalRevenue', 0] },
                            { $multiply: [{ $divide: ['$totalProfit', '$totalRevenue'] }, 100] },
                            0
                        ]
                    }
                }
            }
        ];
        // Sort by selected metric
        if (metric === 'profit') {
            pipeline.push({ $sort: { totalProfit: -1 } });
        }
        else if (metric === 'margin') {
            pipeline.push({ $sort: { margin: -1 } });
        }
        else if (metric === 'units') {
            pipeline.push({ $sort: { totalUnitsSold: -1 } });
        }
        else {
            pipeline.push({ $sort: { totalRevenue: -1 } });
        }
        const limitNum = Math.min(parseInt(limit) || 10, 100);
        pipeline.push({ $limit: limitNum });
        const results = await Order_1.default.aggregate(pipeline);
        res.json({
            success: true,
            metric,
            products: results
        });
    }
    catch (error) {
        console.error('Top products error:', error);
        res.status(500).json({ error: error.message });
    }
});
// POST /api/profits/recalculate - Recalculate profit analysis (admin only)
router.post('/recalculate', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        // Get all products with their sales
        const products = await Product_1.default.find().select('_id name sku category brand supplier supplierName buyingPrice');
        let recalculated = 0;
        for (const product of products) {
            // Aggregate sales for this product
            const salesData = await Order_1.default.aggregate([
                {
                    $match: {
                        status: { $in: ['paid', 'delivered', 'processing'] }
                    }
                },
                { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
                {
                    $match: {
                        'items.productId': product._id
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalUnitsSold: { $sum: '$items.qty' },
                        totalRevenue: { $sum: { $multiply: ['$items.sellingPrice', '$items.qty'] } },
                        totalCost: { $sum: { $multiply: [{ $ifNull: ['$items.buyingPrice', product.buyingPrice] }, '$items.qty'] } },
                        averageSellingPrice: { $avg: '$items.sellingPrice' }
                    }
                }
            ]);
            if (salesData.length > 0) {
                const data = salesData[0];
                const totalProfit = data.totalRevenue - data.totalCost;
                const averageMargin = data.totalRevenue > 0 ? (totalProfit / data.totalRevenue) * 100 : 0;
                const averageMarkup = data.totalCost > 0 ? (totalProfit / data.totalCost) * 100 : 0;
                // Update or create profit analysis record
                await ProfitAnalysis_1.default.findOneAndUpdate({ productId: product._id }, {
                    productName: product.name,
                    productSku: product.sku,
                    category: product.category,
                    brand: product.brand,
                    supplierId: product.supplier,
                    supplierName: product.supplierName,
                    totalUnitsSold: data.totalUnitsSold,
                    totalRevenue: data.totalRevenue,
                    totalCost: data.totalCost,
                    totalProfit: totalProfit,
                    averageSellingPrice: data.averageSellingPrice,
                    averageBuyingPrice: data.totalCost / data.totalUnitsSold,
                    averageProfitMargin: averageMargin,
                    averageMarkup: averageMarkup,
                    lastCalculated: new Date()
                }, { upsert: true });
                recalculated++;
            }
        }
        res.json({
            success: true,
            message: `Profit analysis recalculated for ${recalculated} products`,
            totalProducts: products.length,
            recalculated
        });
    }
    catch (error) {
        console.error('Recalculate profit error:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=profit.routes.js.map
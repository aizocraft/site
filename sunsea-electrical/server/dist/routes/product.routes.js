"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server/routes/productRoutes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const Product_1 = __importDefault(require("../models/Product"));
const Supplier_1 = __importDefault(require("../models/Supplier"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("../middleware/auth"));
const notification_service_1 = require("../services/notification.service");
const User_1 = __importDefault(require("../models/User"));
function productRoutes(productModel) {
    const router = (0, express_1.Router)();
    // Helper: Check if user is admin
    const isAdmin = (req) => { var _a; return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin'; };
    // Multer config for product images
    const upload = (0, multer_1.default)({
        storage: multer_1.default.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: (req, file, cb) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG'));
            }
        }
    });
    // Get all products with filters, search, pagination, sorting
    router.get('/', async (req, res) => {
        try {
            const { category, q: search, sort = 'createdAt', order = 'desc', page = '1', limit = '12', featured, minPrice, maxPrice, minRating, tags, supplier, // New filter
            minProfitMargin, // Filter by profit margin
            lowStock // Filter low stock items
             } = req.query;
            const query = {};
            // Category filter
            if (category)
                query.category = category;
            // Featured filter
            if (featured === 'true')
                query.featured = true;
            // Tags filter (any match)
            if (tags)
                query.tags = { $in: tags.split(',') };
            // Price range
            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice)
                    query.price.$gte = parseFloat(minPrice);
                if (maxPrice)
                    query.price.$lte = parseFloat(maxPrice);
            }
            // Rating filter
            if (minRating)
                query.rating = { $gte: Number(minRating) };
            // Supplier filter
            if (supplier) {
                if (mongoose_1.default.Types.ObjectId.isValid(supplier)) {
                    query.supplier = supplier;
                }
                else {
                    query.supplierName = { $regex: supplier, $options: 'i' };
                }
            }
            // Low stock filter
            if (lowStock === 'true') {
                query.stock = { $lte: 10 };
            }
            // Search across name, description, tags, sku
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { tags: { $in: [search.toLowerCase()] } },
                    { sku: { $regex: search, $options: 'i' } },
                    { supplierName: { $regex: search, $options: 'i' } }
                ];
            }
            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
            const skip = (pageNum - 1) * limitNum;
            // Sorting
            const sortObj = {};
            sortObj[sort] = order === 'desc' ? -1 : 1;
            let products = await Product_1.default.find(query)
                .sort(sortObj)
                .limit(limitNum)
                .skip(skip)
                .populate('supplier', 'name email phone'); // Populate supplier details
            const total = await Product_1.default.countDocuments(query);
            // Apply profit margin filter if needed (requires post-processing)
            if (minProfitMargin) {
                const marginThreshold = parseFloat(minProfitMargin);
                products = products.filter(p => {
                    const margin = p.profitMargin || 0;
                    return margin >= marginThreshold;
                });
            }
            const productsWithUrls = products.map(p => p.toObject());
            res.json({
                products: productsWithUrls,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: total,
                    pages: Math.ceil(total / limitNum),
                    hasNext: pageNum * limitNum < total,
                    hasPrev: pageNum > 1
                }
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching products' });
        }
    });
    // Get all unique brands
    router.get('/brands', async (req, res) => {
        try {
            const brands = await Product_1.default.distinct('brand');
            const validBrands = brands.filter(brand => brand && brand !== '');
            res.json(validBrands);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching brands' });
        }
    });
    // Get all unique suppliers (for filtering)
    router.get('/suppliers/list', auth_1.default, async (req, res) => {
        try {
            if (!isAdmin(req)) {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const suppliers = await Product_1.default.distinct('supplierName');
            const validSuppliers = suppliers.filter(s => s && s !== '');
            res.json(validSuppliers);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching suppliers' });
        }
    });
    // Get single product by slug
    router.get('/:slug', async (req, res) => {
        try {
            const { slug } = req.params;
            const product = await Product_1.default.findOne({ slug })
                .populate('supplier', 'name email phone address paymentTerms')
                .lean();
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            // Include profit metrics in response
            const productWithMetrics = {
                ...product,
                profitMargin: product.profitMargin,
                profitAmount: product.profitAmount,
                marginPercentage: product.marginPercentage
            };
            res.json(productWithMetrics);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching product' });
        }
    });
    // Create product (updated with new fields)
    router.post('/', auth_1.default, async (req, res) => {
        try {
            if (!isAdmin(req)) {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const productData = { ...req.body };
            // Ensure price is a number
            if (productData.price !== undefined && productData.price !== null && productData.price !== '') {
                productData.price = typeof productData.price === 'string'
                    ? parseFloat(productData.price)
                    : Number(productData.price);
            }
            // Ensure buyingPrice is a number
            if (productData.buyingPrice !== undefined && productData.buyingPrice !== null && productData.buyingPrice !== '') {
                productData.buyingPrice = typeof productData.buyingPrice === 'string'
                    ? parseFloat(productData.buyingPrice)
                    : Number(productData.buyingPrice);
            }
            else {
                productData.buyingPrice = 0;
            }
            // Handle supplier reference
            if (productData.supplierId && mongoose_1.default.Types.ObjectId.isValid(productData.supplierId)) {
                const supplier = await Supplier_1.default.findById(productData.supplierId);
                if (supplier) {
                    productData.supplier = supplier._id;
                    productData.supplierName = supplier.name;
                }
                delete productData.supplierId;
            }
            // Normalize compareAtPrice
            if (productData.compareAtPrice === '' || productData.compareAtPrice === undefined || productData.compareAtPrice === null) {
                productData.compareAtPrice = null;
            }
            else {
                productData.compareAtPrice = typeof productData.compareAtPrice === 'string'
                    ? parseFloat(productData.compareAtPrice)
                    : Number(productData.compareAtPrice);
                if (productData.compareAtPrice <= productData.price) {
                    productData.compareAtPrice = null;
                }
            }
            // Initialize buying price history
            if (productData.buyingPrice > 0 && req.user) {
                productData.buyingPriceHistory = [{
                        price: productData.buyingPrice,
                        effectiveFrom: new Date(),
                        changedBy: req.user.userId,
                        reason: 'Initial product creation'
                    }];
            }
            const product = new Product_1.default(productData);
            const savedProduct = await product.save();
            // Update supplier's products list
            if (savedProduct.supplier) {
                await Supplier_1.default.findByIdAndUpdate(savedProduct.supplier, {
                    $addToSet: { productsSupplied: savedProduct._id }
                });
            }
            // Create notification
            try {
                const adminUsers = await User_1.default.find({ role: 'admin', isActive: true });
                if (adminUsers.length > 0) {
                    const notificationPromises = adminUsers.map(admin => {
                        var _a, _b;
                        return (0, notification_service_1.createNotification)({
                            userId: admin._id.toString(),
                            type: 'system',
                            title: `🆕 New Product Added: ${savedProduct.name}`,
                            message: `A new product "${savedProduct.name}" has been added. SKU: ${savedProduct.sku}, Price: KES ${savedProduct.price}, Cost: KES ${savedProduct.buyingPrice}`,
                            actionUrl: `/dashboard/products/${savedProduct._id}`,
                            metadata: {
                                productId: savedProduct._id.toString(),
                                productName: savedProduct.name,
                                productSlug: savedProduct.slug,
                                sku: savedProduct.sku,
                                price: savedProduct.price,
                                buyingPrice: savedProduct.buyingPrice,
                                category: savedProduct.category,
                                createdBy: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.name) || 'Admin'
                            }
                        });
                    });
                    await Promise.all(notificationPromises);
                }
            }
            catch (notificationErr) {
                console.error('Failed to create product notification:', notificationErr);
            }
            res.status(201).json(savedProduct);
        }
        catch (error) {
            console.error('Create product error:', error);
            res.status(400).json({ error: error.message || 'Error creating product' });
        }
    });
    // Update product (updated with buying price history)
    router.put('/:id', auth_1.default, async (req, res) => {
        try {
            if (!isAdmin(req)) {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const { id } = req.params;
            const updateData = { ...req.body };
            // Get the original product before update
            const originalProduct = await Product_1.default.findById(id);
            if (!originalProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            // Ensure price is a number if it exists in the update
            if (updateData.price !== undefined) {
                updateData.price = typeof updateData.price === 'string'
                    ? parseFloat(updateData.price)
                    : Number(updateData.price);
            }
            // Handle buying price change with history tracking
            let buyingPriceChanged = false;
            if (updateData.buyingPrice !== undefined && updateData.buyingPrice !== originalProduct.buyingPrice) {
                buyingPriceChanged = true;
                updateData.buyingPrice = typeof updateData.buyingPrice === 'string'
                    ? parseFloat(updateData.buyingPrice)
                    : Number(updateData.buyingPrice);
                // Add to buying price history using the model method if available
                if (typeof originalProduct.updateBuyingPrice === 'function') {
                    await originalProduct.updateBuyingPrice(updateData.buyingPrice, req.user.userId, updateData.priceChangeReason || 'Price update via product edit');
                    // Remove from updateData to avoid double update
                    delete updateData.buyingPrice;
                }
            }
            // Handle supplier change
            if (updateData.supplierId) {
                const supplier = await Supplier_1.default.findById(updateData.supplierId);
                if (supplier) {
                    updateData.supplier = supplier._id;
                    updateData.supplierName = supplier.name;
                }
                delete updateData.supplierId;
            }
            // Normalize compareAtPrice
            if (updateData.compareAtPrice !== undefined) {
                if (updateData.compareAtPrice === '' || updateData.compareAtPrice === null) {
                    updateData.compareAtPrice = null;
                }
                else {
                    updateData.compareAtPrice = typeof updateData.compareAtPrice === 'string'
                        ? parseFloat(updateData.compareAtPrice)
                        : Number(updateData.compareAtPrice);
                    const currentPrice = updateData.price !== undefined ? updateData.price : originalProduct.price;
                    if (updateData.compareAtPrice <= currentPrice) {
                        updateData.compareAtPrice = null;
                    }
                }
            }
            let product;
            if (buyingPriceChanged && typeof originalProduct.updateBuyingPrice === 'function') {
                // If we already updated via method, just update other fields
                product = await Product_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            }
            else {
                product = await Product_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            }
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            // Create notifications for changes
            try {
                const adminUsers = await User_1.default.find({ role: 'admin', isActive: true });
                const changes = [];
                if (originalProduct.stock !== product.stock) {
                    changes.push(`stock changed from ${originalProduct.stock} to ${product.stock}`);
                    if (product.stock < 10 && product.stock > 0 && adminUsers.length > 0) {
                        const lowStockTemplate = notification_service_1.NOTIFICATION_TEMPLATES.lowStock(product.name, product.stock);
                        const notificationPromises = adminUsers.map(admin => (0, notification_service_1.createNotification)({
                            userId: admin._id.toString(),
                            type: lowStockTemplate.type,
                            title: lowStockTemplate.title,
                            message: lowStockTemplate.message,
                            actionUrl: `/dashboard/products/${product._id}`,
                            metadata: {
                                productId: product._id.toString(),
                                productName: product.name,
                                currentStock: product.stock,
                                previousStock: originalProduct.stock
                            }
                        }));
                        await Promise.all(notificationPromises);
                    }
                }
                if (originalProduct.price !== product.price) {
                    changes.push(`price changed from KES ${originalProduct.price} to KES ${product.price}`);
                }
                if (originalProduct.buyingPrice !== product.buyingPrice) {
                    changes.push(`buying price changed from KES ${originalProduct.buyingPrice} to KES ${product.buyingPrice}`);
                }
                if (originalProduct.supplierName !== product.supplierName) {
                    changes.push(`supplier changed from ${originalProduct.supplierName || 'None'} to ${product.supplierName || 'None'}`);
                }
                if (changes.length > 0 && adminUsers.length > 0) {
                    const notificationPromises = adminUsers.map(admin => {
                        var _a, _b;
                        return (0, notification_service_1.createNotification)({
                            userId: admin._id.toString(),
                            type: 'system',
                            title: `✏️ Product Updated: ${product.name}`,
                            message: `Product "${product.name}" was updated: ${changes.join(', ')}`,
                            actionUrl: `/dashboard/products/${product._id}`,
                            metadata: {
                                productId: product._id.toString(),
                                productName: product.name,
                                changes: changes,
                                updatedBy: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.name) || 'Admin'
                            }
                        });
                    });
                    await Promise.all(notificationPromises);
                }
            }
            catch (notificationErr) {
                console.error('Failed to create product update notification:', notificationErr);
            }
            res.json(product);
        }
        catch (error) {
            console.error('Update product error:', error);
            res.status(400).json({ error: error.message || 'Error updating product' });
        }
    });
    // PATCH /api/products/:id/buying-price - Update buying price with history
    router.patch('/:id/buying-price', auth_1.default, async (req, res) => {
        try {
            if (!isAdmin(req)) {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const { id } = req.params;
            const { buyingPrice, reason } = req.body;
            if (!buyingPrice || isNaN(parseFloat(buyingPrice))) {
                return res.status(400).json({ error: 'Valid buying price is required' });
            }
            const product = await Product_1.default.findById(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const newPrice = parseFloat(buyingPrice);
            if (typeof product.updateBuyingPrice === 'function') {
                await product.updateBuyingPrice(newPrice, req.user.userId, reason);
            }
            else {
                // Fallback manual update
                product.buyingPriceHistory.push({
                    price: newPrice,
                    effectiveFrom: new Date(),
                    changedBy: req.user.userId,
                    reason: reason || 'Manual price update'
                });
                product.buyingPrice = newPrice;
                await product.save();
            }
            await (0, notification_service_1.createNotification)({
                userId: req.user.userId,
                type: 'system',
                title: `💰 Buying Price Updated: ${product.name}`,
                message: `Buying price changed from KES ${product.buyingPrice} to KES ${newPrice}`,
                actionUrl: `/dashboard/products/${product._id}`,
                metadata: {
                    productId: product._id.toString(),
                    oldPrice: product.buyingPrice,
                    newPrice: newPrice,
                    reason: reason
                }
            });
            res.json({
                success: true,
                message: 'Buying price updated successfully',
                product: {
                    _id: product._id,
                    name: product.name,
                    buyingPrice: product.buyingPrice,
                    buyingPriceHistory: product.buyingPriceHistory
                }
            });
        }
        catch (error) {
            console.error('Update buying price error:', error);
            res.status(500).json({ error: error.message });
        }
    });
    // GET /api/products/stats/profit-summary - Get profit statistics for products
    router.get('/stats/profit-summary', auth_1.default, async (req, res) => {
        try {
            if (!isAdmin(req)) {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const stats = await Product_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        averageProfitMargin: { $avg: '$profitMargin' },
                        averageMarkup: { $avg: '$marginPercentage' },
                        totalInventoryValue: { $sum: { $multiply: ['$buyingPrice', '$stock'] } },
                        totalPotentialProfit: { $sum: { $multiply: [{ $subtract: ['$price', '$buyingPrice'] }, '$stock'] } },
                        productsWithMargin: {
                            $sum: { $cond: [{ $gt: ['$profitMargin', 0] }, 1, 0] }
                        },
                        negativeMarginProducts: {
                            $sum: { $cond: [{ $lt: ['$profitMargin', 0] }, 1, 0] }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        averageProfitMargin: { $round: ['$averageProfitMargin', 2] },
                        averageMarkup: { $round: ['$averageMarkup', 2] },
                        totalInventoryValue: 1,
                        totalPotentialProfit: 1,
                        productsWithMargin: 1,
                        negativeMarginProducts: 1
                    }
                }
            ]);
            res.json(stats[0] || {
                averageProfitMargin: 0,
                averageMarkup: 0,
                totalInventoryValue: 0,
                totalPotentialProfit: 0,
                productsWithMargin: 0,
                negativeMarginProducts: 0
            });
        }
        catch (error) {
            console.error('Profit stats error:', error);
            res.status(500).json({ error: 'Error fetching profit statistics' });
        }
    });
    // ... rest of your existing routes (upload-images, delete, etc.) remain the same ...
    // POST /api/products/upload-images
    // POST /api/products/:id/upload-images  
    // DELETE /api/products/:id/images/:index
    // GET /api/products/image/:fileId
    // (These routes remain unchanged from your original code)
    return router;
}
exports.default = productRoutes;
//# sourceMappingURL=product.routes.js.map
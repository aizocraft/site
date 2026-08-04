"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/supplierRoutes.ts
const express_1 = require("express");
const Supplier_1 = __importDefault(require("../models/Supplier"));
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = __importDefault(require("../middleware/auth"));
const auditMiddleware_1 = require("../middleware/auditMiddleware");
const router = (0, express_1.Router)();
const isAdmin = (req) => { var _a; return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin'; };
// GET /api/suppliers - List all suppliers
router.get('/', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { status, search, page = '1', limit = '20' } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const [suppliers, total] = await Promise.all([
            Supplier_1.default.find(query)
                .sort({ name: 1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Supplier_1.default.countDocuments(query)
        ]);
        res.json({
            suppliers,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        console.error('Fetch suppliers error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/suppliers/:id - Get single supplier with products
router.get('/:id', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const supplier = await Supplier_1.default.findById(req.params.id).lean();
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        // Get products from this supplier
        const products = await Product_1.default.find({ supplier: supplier._id })
            .select('name sku price buyingPrice stock status')
            .lean();
        res.json({
            supplier,
            products,
            productCount: products.length
        });
    }
    catch (error) {
        console.error('Fetch supplier error:', error);
        res.status(500).json({ error: error.message });
    }
});
// POST /api/suppliers - Create supplier
router.post('/', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const supplierData = {
            ...req.body,
            createdBy: req.user.userId
        };
        const supplier = new Supplier_1.default(supplierData);
        await supplier.save();
        await (0, auditMiddleware_1.createAuditLog)(req, {
            action: 'create',
            resource: 'supplier',
            resourceId: supplier._id.toString(),
            details: `Supplier created: ${supplier.name}`,
            skipIfNoUser: false
        });
        res.status(201).json({ success: true, supplier });
    }
    catch (error) {
        console.error('Create supplier error:', error);
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Supplier name already exists' });
        }
        res.status(500).json({ error: error.message });
    }
});
// PUT /api/suppliers/:id - Update supplier
router.put('/:id', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const supplier = await Supplier_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        await (0, auditMiddleware_1.createAuditLog)(req, {
            action: 'update',
            resource: 'supplier',
            resourceId: supplier._id.toString(),
            details: `Supplier updated: ${supplier.name}`,
            skipIfNoUser: false
        });
        res.json({ success: true, supplier });
    }
    catch (error) {
        console.error('Update supplier error:', error);
        res.status(500).json({ error: error.message });
    }
});
// DELETE /api/suppliers/:id - Delete supplier (only if no products linked)
router.delete('/:id', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        // Check if supplier has products
        const productCount = await Product_1.default.countDocuments({ supplier: req.params.id });
        if (productCount > 0) {
            return res.status(400).json({
                error: `Cannot delete supplier with ${productCount} linked products. Remove or reassign products first.`
            });
        }
        const supplier = await Supplier_1.default.findByIdAndDelete(req.params.id);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        await (0, auditMiddleware_1.createAuditLog)(req, {
            action: 'delete',
            resource: 'supplier',
            resourceId: supplier._id.toString(),
            details: `Supplier deleted: ${supplier.name}`,
            skipIfNoUser: false
        });
        res.json({ success: true, message: 'Supplier deleted successfully' });
    }
    catch (error) {
        console.error('Delete supplier error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/suppliers/stats/summary - Supplier statistics
router.get('/stats/summary', auth_1.default, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const stats = await Supplier_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalSuppliers: { $sum: 1 },
                    activeSuppliers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                    totalPurchaseVolume: { $sum: '$totalPurchases' }
                }
            }
        ]);
        // Get product count per supplier
        const supplierProducts = await Product_1.default.aggregate([
            {
                $group: {
                    _id: '$supplier',
                    productCount: { $sum: 1 },
                    totalStockValue: { $sum: { $multiply: ['$buyingPrice', '$stock'] } },
                    totalInventoryValue: { $sum: { $multiply: ['$price', '$stock'] } }
                }
            }
        ]);
        res.json({
            summary: stats[0] || { totalSuppliers: 0, activeSuppliers: 0, totalPurchaseVolume: 0 },
            supplierProducts
        });
    }
    catch (error) {
        console.error('Supplier stats error:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=supplier.routes.js.map
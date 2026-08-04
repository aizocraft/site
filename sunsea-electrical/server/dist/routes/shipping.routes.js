"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const ShippingArea_1 = __importDefault(require("../models/ShippingArea"));
const router = (0, express_1.Router)();
// GET /api/shipping - Admin list (paginated)
router.get('/', auth_1.default, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search;
        const query = { isActive: { $ne: false } };
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const [areas, total] = await Promise.all([
            ShippingArea_1.default.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            ShippingArea_1.default.countDocuments(query)
        ]);
        res.json({
            areas,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                limit
            }
        });
    }
    catch (error) {
        console.error('Shipping areas fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch shipping areas' });
    }
});
// GET /api/shipping/public - Public active areas for buyer
router.get('/public', async (req, res) => {
    try {
        const areas = await ShippingArea_1.default.find({ isActive: true }).sort({ name: 1 });
        res.json(areas);
    }
    catch (error) {
        console.error('Public shipping areas error:', error);
        res.status(500).json({ error: 'Failed to fetch shipping areas' });
    }
});
// POST /api/shipping - Admin create
router.post('/', auth_1.default, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { name, regions, baseCost, freeThreshold, description } = req.body;
        if (!name || !baseCost) {
            return res.status(400).json({ error: 'Name and baseCost required' });
        }
        const area = new ShippingArea_1.default({
            name,
            regions: regions || [],
            baseCost: parseFloat(baseCost.toString()),
            freeThreshold: parseFloat((freeThreshold === null || freeThreshold === void 0 ? void 0 : freeThreshold.toString()) || '0'),
            description,
            isActive: true
        });
        await area.save();
        res.status(201).json(area);
    }
    catch (error) {
        console.error('Create shipping area error:', error);
        res.status(400).json({ error: error.message || 'Failed to create area' });
    }
});
// PUT /api/shipping/:id - Admin update
router.put('/:id', auth_1.default, async (req, res) => {
    var _a;
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const area = await ShippingArea_1.default.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            regions: req.body.regions,
            baseCost: parseFloat(req.body.baseCost.toString()),
            freeThreshold: parseFloat(((_a = req.body.freeThreshold) === null || _a === void 0 ? void 0 : _a.toString()) || '0'),
            description: req.body.description,
            isActive: req.body.isActive !== undefined ? req.body.isActive : undefined
        }, { new: true, runValidators: true });
        if (!area) {
            return res.status(404).json({ error: 'Shipping area not found' });
        }
        res.json(area);
    }
    catch (error) {
        console.error('Update shipping area error:', error);
        res.status(400).json({ error: error.message || 'Failed to update area' });
    }
});
// DELETE /api/shipping/:id - Admin delete
router.delete('/:id', auth_1.default, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const area = await ShippingArea_1.default.findByIdAndDelete(req.params.id);
        if (!area) {
            return res.status(404).json({ error: 'Shipping area not found' });
        }
        res.json({ success: true, message: 'Area deleted' });
    }
    catch (error) {
        console.error('Delete shipping area error:', error);
        res.status(500).json({ error: 'Failed to delete area' });
    }
});
exports.default = router;
//# sourceMappingURL=shipping.routes.js.map
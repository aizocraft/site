"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const PromoCode_1 = __importDefault(require("../models/PromoCode"));
const router = (0, express_1.Router)();
// GET /api/promo - Admin list (paginated)
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
            query.code = { $regex: search.toUpperCase(), $options: 'i' };
        }
        const [promos, total] = await Promise.all([
            PromoCode_1.default.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            PromoCode_1.default.countDocuments(query)
        ]);
        res.json({
            promos,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                limit
            }
        });
    }
    catch (error) {
        console.error('Promo codes fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch promo codes' });
    }
});
// GET /api/promo/validate/:code - Public validate for specific subtotal
router.get('/validate/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const subtotal = parseFloat(req.query.subtotal) || 0;
        const promo = await PromoCode_1.default.findOne({ code: code.toUpperCase() });
        if (!promo || !promo.canUse(subtotal)) {
            return res.status(404).json({ valid: false, error: 'Invalid or expired promo code' });
        }
        res.json({
            valid: true,
            code: promo.code,
            type: promo.type,
            value: promo.value,
            discount: promo.type === 'percent'
                ? (subtotal * promo.value / 100)
                : Math.min(promo.value, subtotal),
            maxDiscount: promo.type === 'percent' ? null : promo.value
        });
    }
    catch (error) {
        console.error('Promo validate error:', error);
        res.status(500).json({ valid: false, error: 'Validation error' });
    }
});
// POST /api/promo - Admin create
router.post('/', auth_1.default, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { code, type, value, maxUses, minSubtotal, expiryDate, description } = req.body;
        if (!code || !type || value === undefined) {
            return res.status(400).json({ error: 'Code, type, and value required' });
        }
        const promo = new PromoCode_1.default({
            code: code.toUpperCase().trim(),
            type,
            value: parseFloat(value.toString()),
            maxUses: parseInt((maxUses === null || maxUses === void 0 ? void 0 : maxUses.toString()) || '0'),
            minSubtotal: parseFloat((minSubtotal === null || minSubtotal === void 0 ? void 0 : minSubtotal.toString()) || '0'),
            expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            description,
            isActive: true
        });
        await promo.save();
        res.status(201).json(promo);
    }
    catch (error) {
        console.error('Create promo error:', error);
        res.status(400).json({ error: error.message || 'Failed to create promo' });
    }
});
// PUT /api/promo/:id - Admin update
router.put('/:id', auth_1.default, async (req, res) => {
    var _a, _b, _c;
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const promo = await PromoCode_1.default.findByIdAndUpdate(req.params.id, {
            code: (_a = req.body.code) === null || _a === void 0 ? void 0 : _a.toUpperCase().trim(),
            type: req.body.type,
            value: parseFloat(req.body.value.toString()),
            maxUses: parseInt(((_b = req.body.maxUses) === null || _b === void 0 ? void 0 : _b.toString()) || '0'),
            minSubtotal: parseFloat(((_c = req.body.minSubtotal) === null || _c === void 0 ? void 0 : _c.toString()) || '0'),
            expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined,
            description: req.body.description,
            isActive: req.body.isActive !== undefined ? req.body.isActive : undefined
        }, { new: true, runValidators: true });
        if (!promo) {
            return res.status(404).json({ error: 'Promo code not found' });
        }
        res.json(promo);
    }
    catch (error) {
        console.error('Update promo error:', error);
        res.status(400).json({ error: error.message || 'Failed to update promo' });
    }
});
// DELETE /api/promo/:id - Admin delete
router.delete('/:id', auth_1.default, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const promo = await PromoCode_1.default.findByIdAndDelete(req.params.id);
        if (!promo) {
            return res.status(404).json({ error: 'Promo code not found' });
        }
        res.json({ success: true, message: 'Promo deleted' });
    }
    catch (error) {
        console.error('Delete promo error:', error);
        res.status(500).json({ error: 'Failed to delete promo' });
    }
});
exports.default = router;
//# sourceMappingURL=promo.routes.js.map
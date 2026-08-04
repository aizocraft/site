"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const optionalAuth_1 = __importDefault(require("../middleware/optionalAuth"));
const ShippingArea_1 = __importDefault(require("../models/ShippingArea"));
const PromoCode_1 = __importDefault(require("../models/PromoCode"));
const CompanySettings_1 = require("../models/CompanySettings");
const router = (0, express_1.Router)();
// POST /api/order/calculate - Calculate order totals with shipping/promo
router.post('/', optionalAuth_1.default, async (req, res) => {
    var _a;
    try {
        const { items, subtotal, shippingAreaId, promoCode } = req.body;
        const errors = [];
        let shippingCost = 0;
        let discount = 0;
        let shippingArea = null;
        let promo = null;
        let validShippingArea = true;
        let validPromo = true;
        // Validate subtotal
        if (!items || !items.length || subtotal <= 0) {
            return res.status(400).json({
                subtotal: 0, shippingCost: 0, discount: 0, tax: 0, total: 0,
                validPromo: false, validShippingArea: false,
                errors: ['Invalid cart items or subtotal']
            });
        }
        // Calculate shipping
        if (shippingAreaId) {
            shippingArea = await ShippingArea_1.default.findOne({
                _id: shippingAreaId,
                isActive: true
            });
            if (!shippingArea) {
                errors.push('Invalid shipping area');
                validShippingArea = false;
            }
            else {
                shippingCost = subtotal >= shippingArea.freeThreshold
                    ? 0
                    : shippingArea.baseCost;
            }
        }
        else {
            errors.push('Shipping area required');
            validShippingArea = false;
        }
        // Calculate promo discount
        if (promoCode) {
            promo = await PromoCode_1.default.findOne({
                code: promoCode.toUpperCase(),
                isActive: true
            });
            if (!promo || !promo.canUse(subtotal)) {
                errors.push('Invalid or expired promo code');
                validPromo = false;
            }
            else {
                if (promo.type === 'percent') {
                    discount = subtotal * (promo.value / 100);
                }
                else {
                    discount = Math.min(promo.value, subtotal);
                }
            }
        }
        // Calculate tax
        const settings = await CompanySettings_1.CompanySettings.findOne();
        const taxRate = (_a = settings === null || settings === void 0 ? void 0 : settings.taxRate) !== null && _a !== void 0 ? _a : 0.16;
        const tax = subtotal * taxRate;
        // Final total
        const total = subtotal + shippingCost - discount + tax;
        res.json({
            subtotal,
            shippingCost,
            discount,
            tax,
            total,
            shippingArea,
            promoCode: promo,
            validPromo,
            validShippingArea,
            errors
        });
    }
    catch (error) {
        console.error('Order calc error:', error);
        res.status(500).json({
            subtotal: 0, shippingCost: 0, discount: 0, tax: 0, total: 0,
            validPromo: false, validShippingArea: false,
            errors: ['Calculation error']
        });
    }
});
exports.default = router;
//# sourceMappingURL=orderCalc.routes.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/orderCalc.routes.ts
const express_1 = require("express");
const optionalAuth_1 = __importDefault(require("../middleware/optionalAuth"));
const ShippingArea_1 = __importDefault(require("../models/ShippingArea"));
const PromoCode_1 = __importDefault(require("../models/PromoCode"));
const CompanySettings_1 = require("../models/CompanySettings");
const Product_1 = __importDefault(require("../models/Product"));
const router = (0, express_1.Router)();
// POST /api/order/calculate - Calculate order totals with shipping/promo
router.post('/', optionalAuth_1.default, async (req, res) => {
    var _a, _b;
    try {
        const { items, subtotal, shippingAreaId, promoCode } = req.body;
        const errors = [];
        let shippingCost = 0;
        let discount = 0;
        let shippingArea = null;
        let promo = null;
        let validShippingArea = true;
        let validPromo = true;
        // Get company settings
        const settings = await CompanySettings_1.CompanySettings.findOne();
        const taxRate = (_a = settings === null || settings === void 0 ? void 0 : settings.taxRate) !== null && _a !== void 0 ? _a : 0.16;
        const taxExemptCategories = (_b = settings === null || settings === void 0 ? void 0 : settings.taxExemptCategories) !== null && _b !== void 0 ? _b : [];
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
        // Calculate tax based on product categories
        let taxableSubtotal = 0;
        let taxExemptSubtotal = 0;
        // Fetch products and check categories
        for (const item of items) {
            const product = await Product_1.default.findById(item.productId);
            if (product) {
                // category is a string field in your Product model
                const categoryName = product.category || '';
                // Check if product category is tax-exempt
                const isTaxExempt = taxExemptCategories.some((cat) => categoryName.toLowerCase().includes(cat.toLowerCase()));
                const itemTotal = product.price * item.qty;
                if (isTaxExempt) {
                    taxExemptSubtotal += itemTotal;
                }
                else {
                    taxableSubtotal += itemTotal;
                }
            }
            else {
                // If product not found, use the price from the request (if available) or assume 0
                const itemPrice = item.price || 0;
                taxableSubtotal += itemPrice * item.qty;
            }
        }
        // Use calculated subtotal or fallback to provided subtotal
        const actualSubtotal = taxableSubtotal + taxExemptSubtotal;
        const finalSubtotal = actualSubtotal > 0 ? actualSubtotal : subtotal;
        const finalTaxable = taxableSubtotal > 0 ? taxableSubtotal : finalSubtotal;
        const tax = finalTaxable * taxRate;
        // Final total
        const total = finalSubtotal + shippingCost - discount + tax;
        console.log('Tax Calculation:', {
            finalSubtotal,
            taxableSubtotal: finalTaxable,
            taxExemptSubtotal,
            taxRate,
            tax,
            taxExemptCategories,
            total
        });
        res.json({
            subtotal: finalSubtotal,
            shippingCost,
            discount,
            tax,
            total,
            shippingArea,
            promoCode: promo,
            validPromo,
            validShippingArea,
            errors,
            taxBreakdown: {
                taxableSubtotal: finalTaxable,
                taxExemptSubtotal,
                taxRate,
                taxExemptCategories
            }
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
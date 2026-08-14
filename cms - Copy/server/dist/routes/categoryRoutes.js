"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server/routes/categoryRoutes.ts
const express_1 = require("express");
const Product_1 = __importDefault(require("../models/Product"));
function categoryRoutes() {
    const router = (0, express_1.Router)();
    // Get all categories with product counts
    router.get('/', async (req, res) => {
        try {
            // Aggregate to get unique categories and their product counts
            const categories = await Product_1.default.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 },
                        products: { $push: '$$ROOT' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: '$_id',
                        slug: '$_id',
                        count: 1,
                        // Optional: get sample product image
                        image: { $arrayElemAt: ['$products.images', 0] }
                    }
                },
                {
                    $sort: { name: 1 }
                }
            ]);
            res.json(categories);
        }
        catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Error fetching categories' });
        }
    });
    // Get single category by slug with products
    router.get('/:slug', async (req, res) => {
        try {
            const { slug } = req.params;
            // Get products in this category
            const products = await Product_1.default.find({ category: slug })
                .sort({ createdAt: -1 })
                .lean();
            // Get category info
            const categoryInfo = {
                name: slug,
                slug: slug,
                productCount: products.length,
                products: products
            };
            if (products.length === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json(categoryInfo);
        }
        catch (error) {
            console.error('Error fetching category:', error);
            res.status(500).json({ error: 'Error fetching category' });
        }
    });
    return router;
}
exports.default = categoryRoutes;
//# sourceMappingURL=categoryRoutes.js.map
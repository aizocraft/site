"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Feedback_1 = require("../models/Feedback");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
// Helper function to get client IP
const getClientIp = (req) => {
    var _a;
    return ((_a = req.headers['x-forwarded-for']) === null || _a === void 0 ? void 0 : _a.split(',')[0]) ||
        req.socket.remoteAddress ||
        'unknown';
};
// ==================== PUBLIC ROUTES ====================
// Submit feedback (public) - name and email are optional
router.post('/', async (req, res) => {
    try {
        const { name, email, rating, category, feedback, isPublic } = req.body;
        // Validation - only rating and feedback are required
        if (!rating || !feedback) {
            return res.status(400).json({
                error: 'Missing required fields: rating and feedback are required'
            });
        }
        // Create feedback (name and email are optional)
        const newFeedback = new Feedback_1.Feedback({
            name: name || 'Anonymous', // Default to Anonymous if not provided
            email: email || undefined, // Can be undefined
            rating,
            category: category || 'product',
            feedback,
            isPublic: isPublic || false,
            userAgent: req.headers['user-agent'],
            ipAddress: getClientIp(req)
        });
        await newFeedback.save();
        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback!',
            data: {
                id: newFeedback._id,
                rating: newFeedback.rating,
                category: newFeedback.category
            }
        });
    }
    catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({
            error: error.message || 'Failed to submit feedback'
        });
    }
});
// Get public feedback (for testimonials)
router.get('/public', async (req, res) => {
    try {
        const { limit = 10, rating } = req.query;
        const query = {
            isPublic: true,
            status: { $in: ['reviewed', 'resolved'] }
        };
        if (rating) {
            query.rating = parseInt(rating);
        }
        const feedbacks = await Feedback_1.Feedback.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('name rating feedback category createdAt');
        res.json({
            success: true,
            count: feedbacks.length,
            data: feedbacks
        });
    }
    catch (error) {
        console.error('Fetch public feedback error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch feedback'
        });
    }
});
// Get average rating (public)
router.get('/stats', async (req, res) => {
    var _a, _b, _c;
    try {
        const stats = await Feedback_1.Feedback.aggregate([
            { $match: { status: { $in: ['reviewed', 'resolved'] } } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    ratingDistribution: {
                        $push: '$rating'
                    }
                }
            },
            {
                $project: {
                    averageRating: { $round: ['$averageRating', 1] },
                    totalReviews: 1,
                    ratingDistribution: 1
                }
            }
        ]);
        // Calculate rating counts
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if ((_a = stats[0]) === null || _a === void 0 ? void 0 : _a.ratingDistribution) {
            stats[0].ratingDistribution.forEach((rating) => {
                distribution[rating]++;
            });
        }
        res.json({
            success: true,
            data: {
                averageRating: ((_b = stats[0]) === null || _b === void 0 ? void 0 : _b.averageRating) || 0,
                totalReviews: ((_c = stats[0]) === null || _c === void 0 ? void 0 : _c.totalReviews) || 0,
                distribution
            }
        });
    }
    catch (error) {
        console.error('Fetch stats error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch statistics'
        });
    }
});
// ==================== ADMIN ROUTES ====================
// Get all feedback (admin only)
router.get('/', auth_1.default, async (req, res) => {
    try {
        const user = req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { page = 1, limit = 20, status, category, rating, search } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (category)
            query.category = category;
        if (rating)
            query.rating = parseInt(rating);
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { feedback: { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [feedbacks, total] = await Promise.all([
            Feedback_1.Feedback.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Feedback_1.Feedback.countDocuments(query)
        ]);
        res.json({
            success: true,
            data: feedbacks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    }
    catch (error) {
        console.error('Fetch feedback error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch feedback'
        });
    }
});
// Update feedback status (admin only)
router.patch('/:id/status', auth_1.default, async (req, res) => {
    try {
        const user = req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { status } = req.body;
        if (!status || !['pending', 'reviewed', 'resolved'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const feedback = await Feedback_1.Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.json({
            success: true,
            message: 'Feedback status updated',
            data: feedback
        });
    }
    catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            error: error.message || 'Failed to update status'
        });
    }
});
// Delete feedback (admin only)
router.delete('/:id', auth_1.default, async (req, res) => {
    try {
        const user = req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const feedback = await Feedback_1.Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.json({
            success: true,
            message: 'Feedback deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({
            error: error.message || 'Failed to delete feedback'
        });
    }
});
exports.default = router;
//# sourceMappingURL=feedback.routes.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("../middleware/auth"));
const notification_service_1 = require("../services/notification.service");
const User_1 = __importDefault(require("../models/User"));
// Helper to send notifications to all admins
const notifyAdmins = async (title, message, actionUrl, metadata = {}) => {
    try {
        const adminUsers = await User_1.default.find({ role: 'admin', isActive: true });
        if (adminUsers.length > 0) {
            await Promise.all(adminUsers.map(admin => (0, notification_service_1.createNotification)({
                userId: admin._id.toString(),
                type: 'system',
                title,
                message,
                actionUrl,
                metadata: {
                    ...metadata,
                    timestamp: new Date().toISOString()
                }
            })));
            console.log(`✅ Review notification sent to ${adminUsers.length} admin(s): ${title}`);
        }
    }
    catch (error) {
        console.error('Failed to send admin notification:', error);
    }
};
async function updateProductRating(ReviewModel, ProductModel, productId) {
    const result = await ReviewModel.aggregate([
        { $match: { productId: new mongoose_1.default.Types.ObjectId(productId), status: 'approved' } },
        {
            $group: {
                _id: '$productId',
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);
    if (result[0]) {
        await ProductModel.findByIdAndUpdate(productId, {
            rating: Math.round(result[0].avgRating * 10) / 10,
        });
    }
}
function reviewRoutes(ReviewModel, ProductModel) {
    const router = (0, express_1.Router)();
    const adminMiddleware = auth_1.default;
    // Test route
    router.get('/test', (req, res) => {
        res.json({ message: 'Reviews API is working!' });
    });
    // ========== ADMIN DASHBOARD ENDPOINTS ==========
    router.get('/admin', adminMiddleware, async (req, res) => {
        try {
            const { page = 1, limit = 10, status, rating, search } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;
            const match = {};
            if (status)
                match.status = status;
            if (rating)
                match.rating = parseInt(rating);
            const pipeline = [
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limitNum },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userData',
                        pipeline: [{ $project: { name: 1, email: 1, avatar: 1 } }]
                    }
                },
                { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productData',
                        pipeline: [{ $project: { name: 1, images: { $arrayElemAt: ['$images', 0] } } }]
                    }
                },
                { $unwind: { path: '$productData', preserveNullAndEmptyArrays: true } }
            ];
            if (Object.keys(match).length > 0) {
                pipeline.unshift({ $match: match });
            }
            if (search) {
                pipeline.unshift({
                    $match: {
                        $text: { $search: search }
                    }
                });
            }
            const [reviews, total] = await Promise.all([
                ReviewModel.aggregate(pipeline),
                ReviewModel.countDocuments(match)
            ]);
            // Format response with proper field names
            const formattedReviews = reviews.map((review) => ({
                _id: review._id,
                id: review._id,
                productId: review.productId,
                userId: review.userId,
                rating: review.rating,
                review: review.review,
                status: review.status,
                isApproved: review.status === 'approved',
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                user: review.userData ? {
                    _id: review.userData._id,
                    name: review.userData.name || 'Anonymous',
                    email: review.userData.email,
                    avatar: review.userData.avatar
                } : null,
                product: review.productData ? {
                    _id: review.productData._id,
                    name: review.productData.name,
                    image: review.productData.images
                } : null
            }));
            res.json({
                data: formattedReviews,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            });
        }
        catch (error) {
            console.error('Get admin reviews error:', error);
            res.status(500).json({ error: error.message || 'Server error' });
        }
    });
    // GET /api/reviews/admin/stats
    router.get('/admin/stats', adminMiddleware, async (req, res) => {
        try {
            const stats = await ReviewModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        averageRating: { $avg: '$rating' },
                        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                        approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1,
                        averageRating: { $round: ['$averageRating', 1] },
                        pending: 1,
                        approved: 1,
                        rejected: 1
                    }
                }
            ]);
            res.json(stats[0] || { total: 0, averageRating: 0, pending: 0, approved: 0, rejected: 0 });
        }
        catch (error) {
            console.error('Get admin stats error:', error);
            res.status(500).json({ error: error.message || 'Server error' });
        }
    });
    // PATCH /api/reviews/admin/:id/status
    router.patch('/admin/:id/status', adminMiddleware, async (req, res) => {
        var _a, _b, _c, _d, _e;
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!['pending', 'approved', 'rejected'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid review ID' });
            }
            const oldReview = await ReviewModel.findById(id);
            if (!oldReview) {
                return res.status(404).json({ error: 'Review not found' });
            }
            const review = await ReviewModel.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }
            if (status === 'approved') {
                await updateProductRating(ReviewModel, ProductModel, review.productId.toString());
            }
            // Get user and product details for notification
            const user = await User_1.default.findById(review.userId).select('name email');
            const product = await ProductModel.findById(review.productId).select('name');
            const statusIcon = status === 'approved' ? '✅' : status === 'rejected' ? '❌' : '⏳';
            const productName = (product === null || product === void 0 ? void 0 : product.name) || 'Unknown Product';
            const customerName = (user === null || user === void 0 ? void 0 : user.name) || 'Anonymous Customer';
            const rating = review.rating;
            await notifyAdmins(`${statusIcon} Review ${status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Updated'}`, `${((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.name)} ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'} a ${rating}-star review for "${productName}" by ${customerName}`, `/dashboard/reviews/${review._id}`, {
                action: 'update_review_status',
                updatedBy: ((_c = req.user) === null || _c === void 0 ? void 0 : _c.email) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.name),
                reviewId: review._id,
                productId: review.productId,
                productName,
                customerId: review.userId,
                customerName,
                rating,
                oldStatus: oldReview.status,
                newStatus: status,
                reviewText: (_e = review.review) === null || _e === void 0 ? void 0 : _e.substring(0, 200)
            });
            // Format response
            const formattedReview = {
                _id: review._id,
                id: review._id,
                productId: review.productId,
                userId: review.userId,
                rating: review.rating,
                review: review.review,
                status: review.status,
                isApproved: review.status === 'approved',
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                user: user ? {
                    _id: user._id,
                    name: user.name || 'Anonymous',
                    email: user.email
                } : null,
                product: product ? {
                    _id: product._id,
                    name: product.name
                } : null
            };
            res.json(formattedReview);
        }
        catch (error) {
            console.error('Update review status error:', error);
            res.status(500).json({ error: error.message || 'Server error' });
        }
    });
    // DELETE /api/reviews/admin/:id
    router.delete('/admin/:id', adminMiddleware, async (req, res) => {
        var _a, _b, _c, _d, _e;
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid review ID' });
            }
            const review = await ReviewModel.findById(id);
            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }
            const productId = review.productId.toString();
            const product = await ProductModel.findById(productId).select('name');
            const user = await User_1.default.findById(review.userId).select('name email');
            const productName = (product === null || product === void 0 ? void 0 : product.name) || 'Unknown Product';
            const customerName = (user === null || user === void 0 ? void 0 : user.name) || 'Anonymous Customer';
            const rating = review.rating;
            await ReviewModel.findByIdAndDelete(id);
            await updateProductRating(ReviewModel, ProductModel, productId);
            await notifyAdmins('🗑️ Review Deleted by Admin', `${((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.name)} deleted a ${rating}-star review for "${productName}" by ${customerName}`, `/dashboard/reviews`, {
                action: 'delete_review_admin',
                deletedBy: ((_c = req.user) === null || _c === void 0 ? void 0 : _c.email) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.name),
                reviewId: id,
                productId,
                productName,
                customerId: review.userId,
                customerName,
                rating,
                reviewText: (_e = review.review) === null || _e === void 0 ? void 0 : _e.substring(0, 200),
                deletedAt: new Date().toISOString()
            });
            res.json({ message: 'Review deleted successfully' });
        }
        catch (error) {
            console.error('Delete admin review error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });
    // GET /api/reviews/user/:productId/has-reviewed
    router.get('/user/:productId/has-reviewed', auth_1.default, async (req, res) => {
        try {
            const { productId } = req.params;
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }
            const review = await ReviewModel.findOne({
                productId,
                userId: req.user.userId
            });
            res.json({
                hasReviewed: !!review,
                reviewId: review === null || review === void 0 ? void 0 : review._id,
                status: (review === null || review === void 0 ? void 0 : review.status) || null
            });
        }
        catch (error) {
            console.error('Check user review error:', error);
            res.status(500).json({ error: error.message || 'Server error' });
        }
    });
    // GET /api/reviews/:productId/stats
    router.get('/:productId/stats', async (req, res) => {
        try {
            const { productId } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }
            const stats = await ReviewModel.aggregate([
                { $match: { productId: new mongoose_1.default.Types.ObjectId(productId), status: 'approved' } },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: '$rating' },
                        totalReviews: { $sum: 1 }
                    }
                }
            ]);
            res.json(stats[0] || { averageRating: 0, totalReviews: 0 });
        }
        catch (error) {
            console.error('Get review stats error:', error);
            res.status(500).json({ error: error.message || 'Server error' });
        }
    });
    // GET /api/reviews/:productId
    router.get('/:productId', async (req, res) => {
        try {
            const { productId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }
            const [reviews, total, avgStats] = await Promise.all([
                ReviewModel.find({ productId, status: 'approved' })
                    .populate('userId', 'name avatar')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                ReviewModel.countDocuments({ productId, status: 'approved' }),
                ReviewModel.aggregate([
                    { $match: { productId: new mongoose_1.default.Types.ObjectId(productId), status: 'approved' } },
                    {
                        $group: {
                            _id: null,
                            averageRating: { $avg: '$rating' },
                            totalReviews: { $sum: 1 }
                        }
                    }
                ])
            ]);
            // Format response - use 'userId' field from populated data
            const formattedReviews = reviews.map((review) => {
                var _a;
                // The populated user data is in the 'userId' field
                const userData = review.userId;
                return {
                    _id: review._id,
                    id: review._id,
                    productId: review.productId,
                    userId: ((_a = review.userId) === null || _a === void 0 ? void 0 : _a._id) || review.userId,
                    rating: review.rating,
                    review: review.review,
                    status: review.status,
                    isApproved: review.status === 'approved',
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    user: userData ? {
                        _id: userData._id,
                        name: userData.name || 'Anonymous',
                        avatar: userData.avatar
                    } : null
                };
            });
            res.json({
                reviews: formattedReviews,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                stats: avgStats[0] || { averageRating: 0, totalReviews: 0 }
            });
        }
        catch (error) {
            console.error('Get reviews error:', error);
            res.status(500).json({ error: error.message || 'Server error' });
        }
    });
    // POST /api/reviews
    router.post('/', auth_1.default, async (req, res) => {
        try {
            const { productId, rating, review } = req.body;
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'Rating must be between 1 and 5' });
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }
            const existing = await ReviewModel.findOne({
                productId,
                userId: req.user.userId
            });
            if (existing) {
                return res.status(400).json({ error: 'You have already reviewed this product' });
            }
            const product = await ProductModel.findById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const reviewData = new ReviewModel({
                productId,
                userId: req.user.userId,
                rating,
                review: review || '',
                status: 'pending'
            });
            const savedReview = await reviewData.save();
            // Get user data
            const user = await User_1.default.findById(req.user.userId).select('name avatar');
            // Format response
            const formattedReview = {
                _id: savedReview._id,
                id: savedReview._id,
                productId: savedReview.productId,
                userId: savedReview.userId,
                rating: savedReview.rating,
                review: savedReview.review,
                status: savedReview.status,
                isApproved: savedReview.status === 'approved',
                createdAt: savedReview.createdAt,
                updatedAt: savedReview.updatedAt,
                user: user ? {
                    _id: user._id,
                    name: user.name || 'Anonymous',
                    avatar: user.avatar
                } : null
            };
            const ratingIcon = rating <= 2 ? '⚠️' : rating === 3 ? '📝' : '⭐';
            await notifyAdmins(`${ratingIcon} New Review Awaiting Approval`, `${req.user.name || req.user.email} left a ${rating}-star review for "${product.name}". Status: PENDING APPROVAL`, `/dashboard/reviews/${savedReview._id}`, {
                action: 'create_review',
                reviewId: savedReview._id,
                productId,
                productName: product.name,
                customerId: req.user.userId,
                customerName: req.user.name || req.user.email,
                rating,
                reviewText: (review || '').substring(0, 500),
                status: 'pending'
            });
            res.status(201).json(formattedReview);
        }
        catch (error) {
            console.error('Create review error:', error);
            res.status(400).json({ error: error.message || 'Invalid data' });
        }
    });
    // PUT /api/reviews/:id
    router.put('/:id', auth_1.default, async (req, res) => {
        try {
            const { id } = req.params;
            const { rating, review } = req.body;
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid review ID' });
            }
            const reviewDoc = await ReviewModel.findOne({ _id: id, userId: req.user.userId });
            if (!reviewDoc) {
                return res.status(404).json({ error: 'Review not found or not authorized' });
            }
            const oldRating = reviewDoc.rating;
            const oldReviewText = reviewDoc.review;
            // Get product for notification
            const product = await ProductModel.findById(reviewDoc.productId).select('name');
            const productName = (product === null || product === void 0 ? void 0 : product.name) || 'Unknown Product';
            if (rating !== undefined) {
                if (rating < 1 || rating > 5) {
                    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
                }
                reviewDoc.rating = rating;
            }
            if (review !== undefined)
                reviewDoc.review = review;
            // Reset to pending when edited
            reviewDoc.status = 'pending';
            const updated = await reviewDoc.save();
            // Get user data
            const user = await User_1.default.findById(req.user.userId).select('name avatar');
            const formattedReview = {
                _id: updated._id,
                id: updated._id,
                productId: updated.productId,
                userId: updated.userId,
                rating: updated.rating,
                review: updated.review,
                status: updated.status,
                isApproved: updated.status === 'approved',
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
                user: user ? {
                    _id: user._id,
                    name: user.name || 'Anonymous',
                    avatar: user.avatar
                } : null
            };
            await notifyAdmins('✏️ Review Updated - Needs Re-approval', `${req.user.name || req.user.email} updated their ${oldRating}→${rating}-star review for "${productName}". Status: PENDING RE-APPROVAL`, `/dashboard/reviews/${updated._id}`, {
                action: 'update_review',
                reviewId: updated._id,
                productId: reviewDoc.productId,
                productName,
                customerId: req.user.userId,
                customerName: req.user.name || req.user.email,
                oldRating,
                newRating: rating,
                oldReviewText: oldReviewText === null || oldReviewText === void 0 ? void 0 : oldReviewText.substring(0, 200),
                newReviewText: (review || '').substring(0, 200),
                status: 'pending'
            });
            res.json(formattedReview);
        }
        catch (error) {
            console.error('Update review error:', error);
            res.status(400).json({ error: error.message || 'Update failed' });
        }
    });
    // DELETE /api/reviews/:id
    router.delete('/:id', auth_1.default, async (req, res) => {
        var _a;
        try {
            const { id } = req.params;
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid review ID' });
            }
            const review = await ReviewModel.findOneAndDelete({
                _id: id,
                userId: req.user.userId
            });
            if (!review) {
                return res.status(404).json({ error: 'Review not found or not authorized' });
            }
            const productId = review.productId.toString();
            const product = await ProductModel.findById(productId).select('name');
            const productName = (product === null || product === void 0 ? void 0 : product.name) || 'Unknown Product';
            const rating = review.rating;
            if (review.status === 'approved') {
                await updateProductRating(ReviewModel, ProductModel, productId);
            }
            await notifyAdmins('🗑️ Review Deleted by Customer', `${req.user.name || req.user.email} deleted their ${rating}-star review for "${productName}"`, `/dashboard/reviews`, {
                action: 'delete_review_user',
                deletedBy: req.user.name || req.user.email,
                reviewId: id,
                productId,
                productName,
                customerId: req.user.userId,
                customerName: req.user.name || req.user.email,
                rating,
                reviewText: (_a = review.review) === null || _a === void 0 ? void 0 : _a.substring(0, 200),
                deletedAt: new Date().toISOString()
            });
            res.json({ message: 'Review deleted successfully' });
        }
        catch (error) {
            console.error('Delete review error:', error);
            res.status(500).json({ error: 'Delete failed' });
        }
    });
    return router;
}
exports.default = reviewRoutes;
//# sourceMappingURL=review.routes.js.map
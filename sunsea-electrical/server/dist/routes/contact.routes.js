"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Contact_1 = require("../models/Contact");
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
// Submit contact form (public) - accepts email OR phone
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        // Validation
        if (!name || !subject || !message) {
            return res.status(400).json({
                error: 'Missing required fields: name, subject, message are required'
            });
        }
        // Check if either email or phone is provided
        if (!email && !phone) {
            return res.status(400).json({
                error: 'Either email or phone number is required'
            });
        }
        // Basic spam detection
        const spamKeywords = ['viagra', 'casino', 'lottery', 'prize'];
        const isSpam = spamKeywords.some(keyword => message.toLowerCase().includes(keyword) ||
            subject.toLowerCase().includes(keyword));
        // Create contact message
        const contact = new Contact_1.Contact({
            name,
            email: email || undefined,
            phone: phone || undefined,
            subject,
            message,
            status: isSpam ? 'spam' : 'pending',
            userAgent: req.headers['user-agent'],
            ipAddress: getClientIp(req)
        });
        await contact.save();
        res.status(201).json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.'
        });
    }
    catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            error: error.message || 'Failed to send message'
        });
    }
});
// ==================== ADMIN ROUTES ====================
// Get all contact messages (admin only)
router.get('/', auth_1.default, async (req, res) => {
    try {
        const user = req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { page = 1, limit = 20, status, search } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [messages, total] = await Promise.all([
            Contact_1.Contact.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Contact_1.Contact.countDocuments(query)
        ]);
        res.json({
            success: true,
            data: messages,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    }
    catch (error) {
        console.error('Fetch messages error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch messages'
        });
    }
});
// Get single contact message (admin only)
router.get('/:id', auth_1.default, async (req, res) => {
    try {
        const user = req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const message = await Contact_1.Contact.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        // Mark as read if it was pending
        if (message.status === 'pending') {
            message.status = 'read';
            await message.save();
        }
        res.json({
            success: true,
            data: message
        });
    }
    catch (error) {
        console.error('Fetch message error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch message'
        });
    }
});
// Update message status (admin only)
router.patch('/:id/status', auth_1.default, async (req, res) => {
    try {
        const user = req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { status, notes } = req.body;
        if (!status || !['pending', 'read', 'replied', 'spam'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const updateData = { status };
        if (status === 'replied') {
            updateData.repliedAt = new Date();
            updateData.repliedBy = user.email || user.name;
        }
        if (notes)
            updateData.notes = notes;
        const message = await Contact_1.Contact.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({
            success: true,
            message: 'Message status updated',
            data: message
        });
    }
    catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            error: error.message || 'Failed to update status'
        });
    }
});
// Delete message (admin only)
router.delete('/:id', auth_1.default, async (req, res) => {
    try {
        const user = req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const message = await Contact_1.Contact.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            error: error.message || 'Failed to delete message'
        });
    }
});
// Get stats (admin only)
router.get('/stats/overview', auth_1.default, async (req, res) => {
    try {
        const user = req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const [total, pending, read, replied, spam] = await Promise.all([
            Contact_1.Contact.countDocuments(),
            Contact_1.Contact.countDocuments({ status: 'pending' }),
            Contact_1.Contact.countDocuments({ status: 'read' }),
            Contact_1.Contact.countDocuments({ status: 'replied' }),
            Contact_1.Contact.countDocuments({ status: 'spam' })
        ]);
        res.json({
            success: true,
            data: {
                total,
                pending,
                read,
                replied,
                spam,
                responseRate: total > 0 ? ((replied / total) * 100).toFixed(1) : '0'
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
exports.default = router;
//# sourceMappingURL=contact.routes.js.map
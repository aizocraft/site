"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/companySettings.routes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const CompanySettings_1 = require("../models/CompanySettings");
const gridfs_1 = require("../config/gridfs");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("../middleware/auth"));
const notification_service_1 = require("../services/notification.service");
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEFAULT_LOGO_URL = process.env.DEFAULT_LOGO_URL || 'https://res.cloudinary.com/duxnsu61a/image/upload/v1775217946/logo_upxr11.png';
const router = (0, express_1.Router)();
// Multer configuration
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Allowed: JPEG, PNG, WebP, SVG'));
        }
    }
});
// Helper functions
const isAdmin = (req) => { var _a; return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin'; };
const logAction = (action, details) => console.log(`[Company] ${action}:`, JSON.stringify(details, null, 2));
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
            console.log(`✅ Notification sent to ${adminUsers.length} admin(s): ${title}`);
        }
    }
    catch (error) {
        console.error('Failed to send admin notification:', error);
    }
};
// GET /api/company
router.get('/', async (req, res) => {
    try {
        let settings = await CompanySettings_1.CompanySettings.findOne();
        if (!settings) {
            settings = await CompanySettings_1.CompanySettings.create({
                companyName: 'My Company',
                slogan: '',
                description: '',
                address: '',
                phone: '',
                email: '',
                website: '',
                footerText: '',
                socialLinks: [],
                taxRate: 0.16,
                logo: {
                    type: 'url',
                    url: DEFAULT_LOGO_URL
                },
                favicon: null,
                themeColors: {
                    light: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    },
                    dark: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    }
                }
            });
        }
        res.json(settings);
    }
    catch (error) {
        console.error('GET error:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});
// PUT /api/company - Optimized update with notification
router.put('/', auth_1.default, async (req, res) => {
    var _a, _b, _c, _d, _e;
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const updateData = req.body;
        logAction('UPDATE', updateData);
        // Validation
        if (updateData.socialLinks && !Array.isArray(updateData.socialLinks)) {
            return res.status(400).json({ error: 'socialLinks must be an array' });
        }
        // Validate & sanitize theme colors (prevents bad values breaking the UI)
        const isValidHex = (v) => {
            if (typeof v !== 'string')
                return false;
            const s = v.trim();
            return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s);
        };
        const DEFAULT_LIGHT = { primary: '#000063', primaryForeground: '#ffffff', primaryMid: '#0043b3', primaryLight: '#009dff' };
        const DEFAULT_DARK = { primary: '#000063', primaryForeground: '#ffffff', primaryMid: '#0043b3', primaryLight: '#009dff' };
        if (updateData.themeColors) {
            const incoming = updateData.themeColors;
            const light = (_a = incoming === null || incoming === void 0 ? void 0 : incoming.light) !== null && _a !== void 0 ? _a : {};
            const dark = (_b = incoming === null || incoming === void 0 ? void 0 : incoming.dark) !== null && _b !== void 0 ? _b : {};
            const sanitizeTheme = (t, defaults) => {
                const out = {};
                for (const k of ['primary', 'primaryForeground', 'primaryMid', 'primaryLight']) {
                    out[k] = isValidHex(t === null || t === void 0 ? void 0 : t[k]) ? t[k].trim() : defaults[k];
                }
                return out;
            };
            updateData.themeColors = {
                light: sanitizeTheme(light, DEFAULT_LIGHT),
                dark: sanitizeTheme(dark, DEFAULT_DARK)
            };
        }
        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined)
                delete updateData[key];
        });
        // Don't allow logo/favicon updates through this endpoint
        delete updateData.logo;
        delete updateData.favicon;
        // Get old settings for comparison
        const oldSettings = await CompanySettings_1.CompanySettings.findOne();
        // Atomic update with validation
        const settings = await CompanySettings_1.CompanySettings.findOneAndUpdate({}, { $set: updateData }, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
        });
        logAction('UPDATE_SUCCESS', { id: settings._id, fields: Object.keys(updateData) });
        // ✅ NOTIFICATION: Company settings updated
        const changedFields = Object.keys(updateData).filter(key => oldSettings && JSON.stringify(oldSettings[key]) !== JSON.stringify(updateData[key]));
        if (changedFields.length > 0) {
            await notifyAdmins('🏢 Company Settings Updated', `${((_c = req.user) === null || _c === void 0 ? void 0 : _c.email) || 'Admin'} updated company settings: ${changedFields.join(', ')}`, '/dashboard/settings/company', {
                updatedBy: ((_d = req.user) === null || _d === void 0 ? void 0 : _d.email) || ((_e = req.user) === null || _e === void 0 ? void 0 : _e.name),
                changedFields,
                oldValues: changedFields.reduce((acc, field) => {
                    acc[field] = oldSettings === null || oldSettings === void 0 ? void 0 : oldSettings[field];
                    return acc;
                }, {}),
                newValues: changedFields.reduce((acc, field) => {
                    acc[field] = settings[field];
                    return acc;
                }, {})
            });
        }
        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    }
    catch (error) {
        console.error('PUT error:', error);
        res.status(500).json({ error: error.message || 'Failed to update settings' });
    }
});
// POST /api/company/upload-logo
router.post('/upload-logo', auth_1.default, upload.single('logo'), async (req, res) => {
    var _a, _b, _c;
    try {
        if (!isAdmin(req))
            return res.status(403).json({ error: 'Admin access required' });
        if (!req.file)
            return res.status(400).json({ error: 'No file uploaded' });
        const bucket = (0, gridfs_1.getGridFSBucket)();
        const filename = `logo-${Date.now()}-${req.file.originalname}`;
        // Upload to GridFS
        const uploadStream = bucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
            metadata: { type: 'logo', originalName: req.file.originalname, uploadedAt: new Date(), fileSize: req.file.size }
        });
        uploadStream.write(req.file.buffer);
        uploadStream.end();
        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });
        // Get current settings
        let settings = await CompanySettings_1.CompanySettings.findOne();
        // Delete old logo from GridFS if exists
        let oldLogoInfo = null;
        if (settings && settings.logo && settings.logo.type === 'gridfs' && settings.logo.fileId) {
            oldLogoInfo = { fileId: settings.logo.fileId, filename: settings.logo.filename };
            try {
                await bucket.delete(settings.logo.fileId);
                console.log('Old logo deleted from GridFS');
            }
            catch (err) {
                console.warn('Old logo delete failed:', err);
            }
        }
        // Update or create settings with new logo
        if (!settings) {
            settings = await CompanySettings_1.CompanySettings.create({
                companyName: 'My Company',
                logo: {
                    type: 'gridfs',
                    fileId: uploadStream.id,
                    filename,
                    mimeType: req.file.mimetype
                },
                themeColors: {
                    light: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    },
                    dark: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    }
                }
            });
        }
        else {
            settings.logo = {
                type: 'gridfs',
                fileId: uploadStream.id,
                filename,
                mimeType: req.file.mimetype
            };
            await settings.save();
        }
        // ✅ NOTIFICATION: Logo uploaded
        await notifyAdmins('🖼️ Company Logo Updated', `${((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || 'Admin'} uploaded a new company logo`, '/dashboard/settings/company', {
            action: 'upload_logo',
            uploadedBy: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.email) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.name),
            filename: req.file.originalname,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            oldLogoDeleted: !!oldLogoInfo
        });
        res.json({ success: true, message: 'Logo uploaded successfully', fileId: uploadStream.id, data: settings });
    }
    catch (error) {
        console.error('Upload logo error:', error);
        res.status(500).json({ error: 'Failed to upload logo' });
    }
});
// POST /api/company/upload-favicon
router.post('/upload-favicon', auth_1.default, upload.single('favicon'), async (req, res) => {
    var _a, _b, _c;
    try {
        if (!isAdmin(req))
            return res.status(403).json({ error: 'Admin access required' });
        if (!req.file)
            return res.status(400).json({ error: 'No file uploaded' });
        const bucket = (0, gridfs_1.getGridFSBucket)();
        const filename = `favicon-${Date.now()}-${req.file.originalname}`;
        const uploadStream = bucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
            metadata: { type: 'favicon', originalName: req.file.originalname, uploadedAt: new Date(), fileSize: req.file.size }
        });
        uploadStream.write(req.file.buffer);
        uploadStream.end();
        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });
        // Get current settings
        let settings = await CompanySettings_1.CompanySettings.findOne();
        // Delete old favicon from GridFS if exists
        let oldFaviconInfo = null;
        if (settings && settings.favicon && settings.favicon.type === 'gridfs' && settings.favicon.fileId) {
            oldFaviconInfo = { fileId: settings.favicon.fileId, filename: settings.favicon.filename };
            try {
                await bucket.delete(settings.favicon.fileId);
                console.log('Old favicon deleted from GridFS');
            }
            catch (err) {
                console.warn('Old favicon delete failed:', err);
            }
        }
        // Update or create settings with new favicon
        if (!settings) {
            settings = await CompanySettings_1.CompanySettings.create({
                companyName: 'My Company',
                favicon: {
                    type: 'gridfs',
                    fileId: uploadStream.id,
                    filename,
                    mimeType: req.file.mimetype
                },
                themeColors: {
                    light: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    },
                    dark: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    }
                }
            });
        }
        else {
            settings.favicon = {
                type: 'gridfs',
                fileId: uploadStream.id,
                filename,
                mimeType: req.file.mimetype
            };
            await settings.save();
        }
        // ✅ NOTIFICATION: Favicon uploaded
        await notifyAdmins('🔖 Company Favicon Updated', `${((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || 'Admin'} uploaded a new company favicon`, '/dashboard/settings/company', {
            action: 'upload_favicon',
            uploadedBy: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.email) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.name),
            filename: req.file.originalname,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            oldFaviconDeleted: !!oldFaviconInfo
        });
        res.json({ success: true, message: 'Favicon uploaded successfully', fileId: uploadStream.id, data: settings });
    }
    catch (error) {
        console.error('Upload favicon error:', error);
        res.status(500).json({ error: 'Failed to upload favicon' });
    }
});
// POST /api/company/logo-url
router.post('/logo-url', auth_1.default, async (req, res) => {
    var _a, _b, _c, _d;
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { url } = req.body;
        console.log('=== LOGO URL UPDATE ===');
        console.log('Received URL:', url);
        if (!url || !url.match(/^https?:\/\/.+/)) {
            return res.status(400).json({ error: 'Valid URL starting with http:// or https:// is required' });
        }
        // Get current settings
        let settings = await CompanySettings_1.CompanySettings.findOne();
        let oldLogoType = null;
        // Delete old GridFS file if exists
        if (settings && settings.logo && settings.logo.type === 'gridfs' && settings.logo.fileId) {
            oldLogoType = 'gridfs';
            try {
                const bucket = (0, gridfs_1.getGridFSBucket)();
                await bucket.delete(settings.logo.fileId);
                console.log('Old GridFS logo deleted');
            }
            catch (err) {
                console.warn('Old logo delete failed:', err);
            }
        }
        else if (((_a = settings === null || settings === void 0 ? void 0 : settings.logo) === null || _a === void 0 ? void 0 : _a.type) === 'url') {
            oldLogoType = 'url';
        }
        // Prepare the logo object
        const logoData = {
            type: 'url',
            url: url
        };
        // Update or create settings
        if (!settings) {
            settings = await CompanySettings_1.CompanySettings.create({
                companyName: 'My Company',
                slogan: '',
                description: '',
                address: '',
                phone: '',
                email: '',
                website: '',
                footerText: '',
                socialLinks: [],
                logo: logoData,
                favicon: null,
                themeColors: {
                    light: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    },
                    dark: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    }
                }
            });
        }
        else {
            settings.logo = logoData;
            await settings.save();
        }
        console.log('Logo URL updated successfully');
        // ✅ NOTIFICATION: Logo URL updated
        await notifyAdmins('🖼️ Company Logo URL Updated', `${((_b = req.user) === null || _b === void 0 ? void 0 : _b.email) || 'Admin'} changed the company logo URL`, '/dashboard/settings/company', {
            action: 'update_logo_url',
            updatedBy: ((_c = req.user) === null || _c === void 0 ? void 0 : _c.email) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.name),
            newLogoUrl: url,
            oldLogoType: oldLogoType
        });
        res.json({
            success: true,
            message: 'Logo URL updated successfully',
            data: settings
        });
    }
    catch (error) {
        console.error('Logo URL update error:', error);
        res.status(500).json({
            error: error.message || 'Failed to set logo URL'
        });
    }
});
// POST /api/company/favicon-url
router.post('/favicon-url', auth_1.default, async (req, res) => {
    var _a, _b, _c, _d;
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { url } = req.body;
        console.log('=== FAVICON URL UPDATE ===');
        console.log('Received URL:', url);
        if (!url || !url.match(/^https?:\/\/.+/)) {
            return res.status(400).json({ error: 'Valid URL starting with http:// or https:// is required' });
        }
        // Get current settings
        let settings = await CompanySettings_1.CompanySettings.findOne();
        let oldFaviconType = null;
        // Delete old GridFS file if exists
        if (settings && settings.favicon && settings.favicon.type === 'gridfs' && settings.favicon.fileId) {
            oldFaviconType = 'gridfs';
            try {
                const bucket = (0, gridfs_1.getGridFSBucket)();
                await bucket.delete(settings.favicon.fileId);
                console.log('Old GridFS favicon deleted');
            }
            catch (err) {
                console.warn('Old favicon delete failed:', err);
            }
        }
        else if (((_a = settings === null || settings === void 0 ? void 0 : settings.favicon) === null || _a === void 0 ? void 0 : _a.type) === 'url') {
            oldFaviconType = 'url';
        }
        // Prepare the favicon object
        const faviconData = {
            type: 'url',
            url: url
        };
        // Update or create settings
        if (!settings) {
            settings = await CompanySettings_1.CompanySettings.create({
                companyName: 'My Company',
                slogan: '',
                description: '',
                address: '',
                phone: '',
                email: '',
                website: '',
                footerText: '',
                socialLinks: [],
                logo: {
                    type: 'url',
                    url: DEFAULT_LOGO_URL
                },
                favicon: faviconData
            });
        }
        else {
            settings.favicon = faviconData;
            await settings.save();
        }
        console.log('Favicon URL updated successfully');
        // ✅ NOTIFICATION: Favicon URL updated
        await notifyAdmins('🔖 Company Favicon URL Updated', `${((_b = req.user) === null || _b === void 0 ? void 0 : _b.email) || 'Admin'} changed the company favicon URL`, '/dashboard/settings/company', {
            action: 'update_favicon_url',
            updatedBy: ((_c = req.user) === null || _c === void 0 ? void 0 : _c.email) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.name),
            newFaviconUrl: url,
            oldFaviconType: oldFaviconType
        });
        res.json({
            success: true,
            message: 'Favicon URL updated successfully',
            data: settings
        });
    }
    catch (error) {
        console.error('Favicon URL update error:', error);
        res.status(500).json({
            error: error.message || 'Failed to set favicon URL'
        });
    }
});
// GET /api/company/logo/:fileId
router.get('/logo/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ error: 'Invalid file ID' });
        }
        const bucket = (0, gridfs_1.getGridFSBucket)();
        const downloadStream = bucket.openDownloadStream(new mongoose_1.default.Types.ObjectId(fileId));
        downloadStream.on('error', (error) => {
            console.error('Download error:', error);
            res.status(404).json({ error: 'File not found' });
        });
        res.setHeader('Content-Type', 'image/*');
        downloadStream.pipe(res);
    }
    catch (error) {
        console.error('Fetch logo error:', error);
        res.status(500).json({ error: 'Failed to fetch logo' });
    }
});
// GET /api/company/favicon/:fileId
router.get('/favicon/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ error: 'Invalid file ID' });
        }
        const bucket = (0, gridfs_1.getGridFSBucket)();
        const downloadStream = bucket.openDownloadStream(new mongoose_1.default.Types.ObjectId(fileId));
        downloadStream.on('error', (error) => {
            console.error('Download error:', error);
            res.status(404).json({ error: 'File not found' });
        });
        res.setHeader('Content-Type', 'image/*');
        downloadStream.pipe(res);
    }
    catch (error) {
        console.error('Fetch favicon error:', error);
        res.status(500).json({ error: 'Failed to fetch favicon' });
    }
});
// DELETE /api/company/logo
router.delete('/logo', auth_1.default, async (req, res) => {
    var _a, _b, _c;
    try {
        if (!isAdmin(req))
            return res.status(403).json({ error: 'Admin access required' });
        let settings = await CompanySettings_1.CompanySettings.findOne();
        if (settings && settings.logo && settings.logo.type === 'gridfs' && settings.logo.fileId) {
            const bucket = (0, gridfs_1.getGridFSBucket)();
            try {
                await bucket.delete(settings.logo.fileId);
                console.log('GridFS logo deleted');
            }
            catch (err) {
                console.warn('Failed to delete GridFS logo:', err);
            }
        }
        if (!settings) {
            settings = await CompanySettings_1.CompanySettings.create({
                companyName: 'My Company',
                logo: {
                    type: 'url',
                    url: DEFAULT_LOGO_URL
                },
                themeColors: {
                    light: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    },
                    dark: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    }
                }
            });
        }
        else {
            settings.logo = {
                type: 'url',
                url: DEFAULT_LOGO_URL
            };
            await settings.save();
        }
        // ✅ NOTIFICATION: Logo reset to default
        await notifyAdmins('🖼️ Company Logo Reset', `${((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || 'Admin'} reset the company logo to default`, '/dashboard/settings/company', {
            action: 'reset_logo',
            resetBy: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.email) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.name)
        });
        res.json({ success: true, message: 'Logo reset to default', data: settings });
    }
    catch (error) {
        console.error('Delete logo error:', error);
        res.status(500).json({ error: 'Failed to delete logo' });
    }
});
// DELETE /api/company/favicon
router.delete('/favicon', auth_1.default, async (req, res) => {
    var _a, _b, _c;
    try {
        if (!isAdmin(req))
            return res.status(403).json({ error: 'Admin access required' });
        let settings = await CompanySettings_1.CompanySettings.findOne();
        if (settings && settings.favicon && settings.favicon.type === 'gridfs' && settings.favicon.fileId) {
            const bucket = (0, gridfs_1.getGridFSBucket)();
            try {
                await bucket.delete(settings.favicon.fileId);
                console.log('GridFS favicon deleted');
            }
            catch (err) {
                console.warn('Failed to delete GridFS favicon:', err);
            }
        }
        // Set favicon to null
        if (!settings) {
            settings = await CompanySettings_1.CompanySettings.create({
                companyName: 'My Company',
                favicon: null,
                themeColors: {
                    light: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    },
                    dark: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    }
                }
            });
        }
        else {
            settings.favicon = null;
            await settings.save();
        }
        // ✅ NOTIFICATION: Favicon deleted
        await notifyAdmins('🔖 Company Favicon Deleted', `${((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || 'Admin'} deleted the company favicon`, '/dashboard/settings/company', {
            action: 'delete_favicon',
            deletedBy: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.email) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.name)
        });
        res.json({ success: true, message: 'Favicon deleted', data: settings });
    }
    catch (error) {
        console.error('Delete favicon error:', error);
        res.status(500).json({ error: 'Failed to delete favicon' });
    }
});
// POST /api/company/reset
router.post('/reset', auth_1.default, async (req, res) => {
    var _a, _b, _c, _d, _e;
    try {
        if (!isAdmin(req))
            return res.status(403).json({ error: 'Admin access required' });
        const settings = await CompanySettings_1.CompanySettings.findOne();
        const bucket = (0, gridfs_1.getGridFSBucket)();
        if (((_a = settings === null || settings === void 0 ? void 0 : settings.logo) === null || _a === void 0 ? void 0 : _a.type) === 'gridfs' && settings.logo.fileId) {
            try {
                await bucket.delete(settings.logo.fileId);
            }
            catch (err) { }
        }
        if (((_b = settings === null || settings === void 0 ? void 0 : settings.favicon) === null || _b === void 0 ? void 0 : _b.type) === 'gridfs' && settings.favicon.fileId) {
            try {
                await bucket.delete(settings.favicon.fileId);
            }
            catch (err) { }
        }
        const resetSettings = await CompanySettings_1.CompanySettings.findOneAndUpdate({}, {
            $set: {
                companyName: 'My Company',
                slogan: '',
                description: '',
                address: '',
                phone: '',
                email: '',
                website: '',
                footerText: '',
                socialLinks: [],
                logo: {
                    type: 'url',
                    url: DEFAULT_LOGO_URL
                },
                favicon: null,
                themeColors: {
                    light: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    },
                    dark: {
                        primary: '#000063',
                        primaryForeground: '#ffffff',
                        primaryMid: '#0043b3',
                        primaryLight: '#009dff'
                    }
                }
            }
        }, { new: true, upsert: true, setDefaultsOnInsert: true });
        // ✅ NOTIFICATION: All settings reset
        await notifyAdmins('🏢 Company Settings Reset', `${((_c = req.user) === null || _c === void 0 ? void 0 : _c.email) || 'Admin'} reset all company settings to default`, '/dashboard/settings/company', {
            action: 'reset_all_settings',
            resetBy: ((_d = req.user) === null || _d === void 0 ? void 0 : _d.email) || ((_e = req.user) === null || _e === void 0 ? void 0 : _e.name)
        });
        res.json({ success: true, message: 'Settings reset', data: resetSettings });
    }
    catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ error: 'Failed to reset settings' });
    }
});
// GET /api/company/tax-rate
router.get('/tax-rate', async (req, res) => {
    var _a;
    try {
        const settings = await CompanySettings_1.CompanySettings.findOne();
        const taxRate = (_a = settings === null || settings === void 0 ? void 0 : settings.taxRate) !== null && _a !== void 0 ? _a : 0.16; // Default to 16% if not set
        res.json({ taxRate });
    }
    catch (error) {
        console.error('GET tax rate error:', error);
        res.status(500).json({ error: 'Failed to fetch tax rate' });
    }
});
// PUT /api/admin/settings/tax-exempt-categories
router.put('/admin/settings/tax-exempt-categories', auth_1.default, async (req, res) => {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const { taxExemptCategories } = req.body;
        if (!Array.isArray(taxExemptCategories)) {
            return res.status(400).json({ error: 'taxExemptCategories must be an array' });
        }
        const oldSettings = await CompanySettings_1.CompanySettings.findOne();
        const oldCategories = (oldSettings === null || oldSettings === void 0 ? void 0 : oldSettings.taxExemptCategories) || [];
        let settings = await CompanySettings_1.CompanySettings.findOne();
        if (!settings) {
            settings = new CompanySettings_1.CompanySettings();
        }
        settings.taxExemptCategories = taxExemptCategories;
        await settings.save();
        // ✅ NOTIFICATION: Tax-exempt categories updated
        const added = taxExemptCategories.filter((c) => !oldCategories.includes(c));
        const removed = oldCategories.filter((c) => !taxExemptCategories.includes(c));
        if (added.length > 0 || removed.length > 0) {
            await notifyAdmins('💰 Tax-Exempt Categories Updated', `${req.user.email || 'Admin'} updated tax-exempt categories. ${added.length > 0 ? `Added: ${added.join(', ')}` : ''} ${removed.length > 0 ? `Removed: ${removed.join(', ')}` : ''}`, '/dashboard/settings/tax', {
                action: 'update_tax_exempt_categories',
                updatedBy: req.user.email || req.user.name,
                addedCategories: added,
                removedCategories: removed,
                totalCategories: taxExemptCategories.length
            });
        }
        res.json({
            success: true,
            taxExemptCategories: settings.taxExemptCategories
        });
    }
    catch (error) {
        console.error('Error updating tax-exempt categories:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /api/company/export
router.get('/export', auth_1.default, async (req, res) => {
    var _a, _b, _c;
    try {
        if (!isAdmin(req))
            return res.status(403).json({ error: 'Admin access required' });
        const settings = await CompanySettings_1.CompanySettings.findOne().lean();
        if (!settings)
            return res.status(404).json({ error: 'Settings not found' });
        // ✅ NOTIFICATION: Settings exported (optional - can be commented if too noisy)
        await notifyAdmins('📤 Company Settings Exported', `${((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || 'Admin'} exported company settings`, '/dashboard/settings/company', {
            action: 'export_settings',
            exportedBy: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.email) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.name),
            exportTime: new Date().toISOString()
        });
        // Destructure with proper type assertion
        const { _id, __v, createdAt, updatedAt, ...exportData } = settings;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=company-settings.json');
        res.json(exportData);
    }
    catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to export settings' });
    }
});
// POST /api/company/import
router.post('/import', auth_1.default, async (req, res) => {
    var _a, _b, _c;
    try {
        if (!isAdmin(req))
            return res.status(403).json({ error: 'Admin access required' });
        const importData = req.body;
        if (!importData.companyName) {
            return res.status(400).json({ error: 'Company name is required' });
        }
        const { _id, __v, createdAt, updatedAt, ...cleanData } = importData;
        const settings = await CompanySettings_1.CompanySettings.findOneAndUpdate({}, { $set: cleanData }, { new: true, upsert: true });
        // ✅ NOTIFICATION: Settings imported
        await notifyAdmins('📥 Company Settings Imported', `${((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || 'Admin'} imported company settings`, '/dashboard/settings/company', {
            action: 'import_settings',
            importedBy: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.email) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.name),
            importTime: new Date().toISOString(),
            companyName: importData.companyName
        });
        res.json({ success: true, message: 'Settings imported', data: settings });
    }
    catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ error: 'Failed to import settings' });
    }
});
exports.default = router;
//# sourceMappingURL=companyRoutes.js.map
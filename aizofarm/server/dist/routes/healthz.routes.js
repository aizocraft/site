"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/healthz.routes.ts
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
router.get('/healthz', async (req, res) => {
    console.log('✅ Healthz endpoint called');
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    let dbStatus = 'disconnected';
    try {
        // Check if db exists before pinging
        if (mongoose_1.default.connection.db) {
            // ACTIVE PING to MongoDB - this keeps it alive
            await mongoose_1.default.connection.db.admin().ping();
            dbStatus = 'connected';
            console.log('✅ MongoDB ping successful');
        }
        else {
            console.warn('⚠️ MongoDB db object is undefined');
            dbStatus = 'not_initialized';
        }
    }
    catch (error) {
        dbStatus = 'disconnected';
        console.error('❌ MongoDB ping failed:', error);
    }
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 60)} minutes, ${Math.floor(uptime % 60)} seconds`,
        uptimeSeconds: uptime,
        memory: {
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
        },
        database: dbStatus,
        version: process.env.npm_package_version || '1.0.0'
    });
});
exports.default = router;
//# sourceMappingURL=healthz.routes.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// DELETE THIS LINE: import '../types/express.d.ts';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const optionalAuthMiddleware = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            // No token - treat as guest user
            req.user = undefined;
            return next();
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret_change_me');
        // Optionally verify user still exists
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (!user) {
            // User doesn't exist - treat as guest
            req.user = undefined;
            return next();
        }
        // User is authenticated
        req.user = {
            userId: decoded.userId,
            role: user.role || 'user'
        };
        next();
    }
    catch (error) {
        // Invalid token - treat as guest
        console.error('Optional auth error:', error);
        req.user = undefined;
        next();
    }
};
exports.default = optionalAuthMiddleware;
//# sourceMappingURL=optionalAuth.js.map
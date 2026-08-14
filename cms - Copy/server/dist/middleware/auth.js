"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Extend Express Request type to add custom properties to the existing user object
const authMiddleware = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret_change_me');
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'Token is not valid' });
        }
        // Populate complete user object matching global Express types
        req.user = {
            userId: user._id.toString(),
            role: user.role,
            id: user._id.toString(),
            email: user.email
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.js.map
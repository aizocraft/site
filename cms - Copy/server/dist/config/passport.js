"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePassport = void 0;
// server/config/passport.ts
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
const configurePassport = () => {
    // Serialize user for session
    passport_1.default.serializeUser((user, done) => {
        done(null, user._id.toString());
    });
    // Deserialize user from session
    passport_1.default.deserializeUser(async (id, done) => {
        try {
            const user = await User_1.default.findById(id).select('-password');
            if (user) {
                user.userId = user._id.toString();
                user.role = user.role || 'user';
            }
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
    });
    // Google OAuth Strategy
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        var _a, _b, _c, _d;
        try {
            console.log('Google profile:', profile);
            // Check if user exists with googleId
            let user = await User_1.default.findOne({ googleId: profile.id });
            if (!user) {
                // Check if user exists with same email
                user = await User_1.default.findOne({ email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value });
                if (user) {
                    // Link Google account to existing user
                    user.googleId = profile.id;
                    user.provider = 'google';
                    user.avatar = ((_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value) || user.avatar;
                    user.lastLogin = new Date();
                    await user.save();
                    console.log(`Linked Google account to existing user: ${user.email}`);
                }
                else {
                    // Create new user with Google
                    user = new User_1.default({
                        name: profile.displayName,
                        email: (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0].value,
                        googleId: profile.id,
                        provider: 'google',
                        avatar: (_d = profile.photos) === null || _d === void 0 ? void 0 : _d[0].value,
                        isActive: true,
                        lastLogin: new Date()
                    });
                    await user.save();
                    console.log(`Created new user with Google: ${user.email}`);
                }
            }
            else {
                // Update last login for existing Google user
                user.lastLogin = new Date();
                await user.save();
            }
            return done(null, user);
        }
        catch (error) {
            console.error('Google auth error:', error);
            return done(error, undefined);
        }
    }));
};
exports.configurePassport = configurePassport;
//# sourceMappingURL=passport.js.map
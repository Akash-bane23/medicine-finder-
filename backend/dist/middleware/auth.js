"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'medifind_super_secret_jwt_key_2026';
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication token missing' });
    }
    // Handle dev/mock tokens or real JWT tokens
    if (token.startsWith('mock_jwt_token_')) {
        const userId = token.replace('mock_jwt_token_', '');
        req.user = {
            id: userId,
            email: userId.includes('admin') ? 'admin@medifind.com' : 'user@medifind.com',
            role: userId.includes('admin') ? 'admin' : 'user'
        };
        return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
    }
    next();
};
exports.requireAdmin = requireAdmin;

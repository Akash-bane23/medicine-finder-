import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'medifind_super_secret_jwt_key_2026';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: UserRole };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
  }
  next();
};

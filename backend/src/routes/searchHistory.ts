import { Router, Response } from 'express';
import { db } from '../data/db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/v1/search-history
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const history = db.getSearchHistoryByUserId(req.user.id);
  return res.json({
    success: true,
    count: history.length,
    history
  });
});

// POST /api/v1/search-history
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const { searchQuery, medicineId } = req.body;

  if (!searchQuery || !searchQuery.trim()) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }

  const item = db.addSearchHistory(req.user.id, searchQuery.trim(), medicineId);
  return res.status(201).json({
    success: true,
    message: 'Search history recorded',
    item
  });
});

// DELETE /api/v1/search-history
router.delete('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  db.clearSearchHistory(req.user.id);
  return res.json({ success: true, message: 'Search history cleared' });
});

export default router;

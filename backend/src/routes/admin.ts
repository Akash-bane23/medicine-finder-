import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

// GET /api/v1/admin/stats
router.get('/stats', (req, res) => {
  const stats = db.getDashboardStats();
  const searchTrends = db.getSearchTrends();
  const categoryStats = db.getCategoryStats();
  const userGrowth = db.getUserGrowth();

  return res.json({
    stats,
    searchTrends,
    categoryStats,
    userGrowth
  });
});

export default router;

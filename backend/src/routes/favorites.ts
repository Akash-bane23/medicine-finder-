import { Router, Response } from 'express';
import { db } from '../data/db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/v1/favorites
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const favorites = db.getFavoritesByUserId(req.user.id);
  
  // Attach medicine objects for frontend convenience
  const medicines = favorites
    .map(f => db.getMedicineById(f.medicineId))
    .filter(Boolean);

  return res.json({
    success: true,
    count: favorites.length,
    favorites,
    medicines
  });
});

// GET /api/v1/favorites/check/:medicineId
router.get('/check/:medicineId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const medicineId = Array.isArray(req.params.medicineId) ? req.params.medicineId[0] : req.params.medicineId;
  const isFav = db.isFavorite(req.user.id, medicineId);
  return res.json({ success: true, isFavorite: isFav });
});

// POST /api/v1/favorites
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const { medicineId } = req.body;

  if (!medicineId) {
    return res.status(400).json({ success: false, message: 'Medicine ID is required' });
  }

  const medicine = db.getMedicineById(medicineId);
  if (!medicine) {
    return res.status(404).json({ success: false, message: 'Medicine not found' });
  }

  const favorite = db.addFavorite(req.user.id, medicineId);
  return res.status(201).json({
    success: true,
    message: 'Added to favorites',
    favorite
  });
});

// DELETE /api/v1/favorites/:medicineId
router.delete('/:medicineId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const medicineId = Array.isArray(req.params.medicineId) ? req.params.medicineId[0] : req.params.medicineId;

  const removed = db.removeFavorite(req.user.id, medicineId);
  if (removed) {
    return res.json({ success: true, message: 'Removed from favorites' });
  }
  return res.status(404).json({ success: false, message: 'Favorite not found' });
});

export default router;

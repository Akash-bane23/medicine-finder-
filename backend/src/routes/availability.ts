import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

// GET /api/v1/availability
router.get('/', (req, res) => {
  const records = db.getAvailabilityRecords();
  return res.json(records);
});

// PUT /api/v1/availability
router.put('/', (req, res) => {
  const { pharmacyId, medicineId, quantity, status } = req.body;

  if (!pharmacyId || !medicineId || quantity === undefined || !status) {
    return res.status(400).json({ success: false, message: 'Missing required fields: pharmacyId, medicineId, quantity, status' });
  }

  const success = db.updateStock(pharmacyId, medicineId, Number(quantity), status);
  if (!success) {
    return res.status(400).json({ success: false, message: 'Failed to update stock' });
  }

  return res.json({ success: true, message: 'Stock updated successfully' });
});

export default router;

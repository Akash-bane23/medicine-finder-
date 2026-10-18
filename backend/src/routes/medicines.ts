import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

// GET /api/v1/medicines
router.get('/', (req, res) => {
  const { searchQuery, category, brand, dosageForm, prescriptionRequired, availability } = req.query;

  const medicines = db.getMedicines({
    searchQuery: searchQuery as string,
    category: category as string,
    brand: brand as string,
    dosageForm: dosageForm as string,
    prescriptionRequired: prescriptionRequired as string,
    availability: availability as string
  });

  return res.json(medicines);
});

// GET /api/v1/medicines/:id
router.get('/:id', (req, res) => {
  const medicine = db.getMedicineById(req.params.id);
  if (!medicine) {
    return res.status(404).json({ success: false, message: 'Medicine not found' });
  }
  return res.json(medicine);
});

// POST /api/v1/medicines
router.post('/', (req, res) => {
  try {
    const newMedicine = db.createMedicine(req.body);
    return res.status(201).json(newMedicine);
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message || 'Failed to create medicine' });
  }
});

// PUT /api/v1/medicines/:id
router.put('/:id', (req, res) => {
  try {
    const updated = db.updateMedicine(req.params.id, req.body);
    return res.json(updated);
  } catch (err: any) {
    return res.status(404).json({ success: false, message: err.message || 'Medicine not found' });
  }
});

// PATCH /api/v1/medicines/:id
router.patch('/:id', (req, res) => {
  try {
    const updated = db.updateMedicine(req.params.id, req.body);
    return res.json(updated);
  } catch (err: any) {
    return res.status(404).json({ success: false, message: err.message || 'Medicine not found' });
  }
});

// DELETE /api/v1/medicines/:id
router.delete('/:id', (req, res) => {
  const success = db.deleteMedicine(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Medicine not found' });
  }
  return res.json({ success: true, message: 'Medicine deleted successfully' });
});

export default router;

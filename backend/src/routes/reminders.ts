import { Router, Response } from 'express';
import { db } from '../data/db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { ReminderFrequency } from '../types';

const router = Router();

// GET /api/v1/reminders
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const reminders = db.getRemindersByUserId(req.user.id);
  return res.json({
    success: true,
    count: reminders.length,
    reminders
  });
});

// POST /api/v1/reminders
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const { medicineId, medicineName, dosage, frequency, reminderTime, startDate, endDate, isActive } = req.body;

  if (!medicineName || !dosage || !frequency || !reminderTime) {
    return res.status(400).json({
      success: false,
      message: 'Medicine name, dosage, frequency, and reminder time are required.'
    });
  }

  // Check for duplicate active ingredient warning across user's active reminders
  let warningMessage: string | null = null;
  const userReminders = db.getRemindersByUserId(req.user.id).filter(r => r.isActive);

  const newMedObj = medicineId ? db.getMedicineById(medicineId) : undefined;
  const targetGeneric = newMedObj?.genericName?.toLowerCase() || medicineName.toLowerCase();

  const duplicateIngredientReminder = userReminders.find(r => {
    const existingMedObj = r.medicineId ? db.getMedicineById(r.medicineId) : undefined;
    const existingGeneric = existingMedObj?.genericName?.toLowerCase() || r.medicineName.toLowerCase();
    return (
      (targetGeneric.includes('paracetamol') && existingGeneric.includes('paracetamol')) ||
      (targetGeneric.includes('ibuprofen') && existingGeneric.includes('ibuprofen')) ||
      (targetGeneric.includes('pantoprazole') && existingGeneric.includes('pantoprazole')) ||
      (targetGeneric.includes('cetirizine') && existingGeneric.includes('cetirizine')) ||
      (targetGeneric === existingGeneric && r.medicineName.toLowerCase() !== medicineName.toLowerCase())
    );
  });

  if (duplicateIngredientReminder) {
    warningMessage = `These medicines (${medicineName} & ${duplicateIngredientReminder.medicineName}) may contain the same active ingredient. Please verify with a pharmacist or doctor.`;
  }

  const reminder = db.createReminder({
    userId: req.user.id,
    medicineId: medicineId || `med-custom-${Date.now()}`,
    medicineName,
    dosage,
    frequency: frequency as ReminderFrequency,
    reminderTime,
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || undefined,
    isActive: isActive !== undefined ? Boolean(isActive) : true
  });

  return res.status(201).json({
    success: true,
    message: 'Medicine refill reminder created successfully',
    warning: warningMessage,
    reminder
  });
});

// PUT /api/v1/reminders/:id
router.put('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  try {
    const updated = db.updateReminder(id, req.user.id, req.body);
    return res.json({
      success: true,
      message: 'Reminder updated successfully',
      reminder: updated
    });
  } catch (err: any) {
    return res.status(404).json({ success: false, message: err.message || 'Reminder not found' });
  }
});

// DELETE /api/v1/reminders/:id
router.delete('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const deleted = db.deleteReminder(id, req.user.id);
  if (deleted) {
    return res.json({ success: true, message: 'Reminder deleted successfully' });
  }
  return res.status(404).json({ success: false, message: 'Reminder not found' });
});

export default router;

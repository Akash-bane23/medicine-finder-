import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

// GET /api/v1/users
router.get('/', (req, res) => {
  const users = db.getUsers();
  return res.json(users);
});

// PATCH /api/v1/users/:id/status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status || !['active', 'blocked', 'inactive'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  try {
    const updated = db.updateUserStatus(req.params.id, status);
    return res.json(updated);
  } catch (err: any) {
    return res.status(404).json({ success: false, message: err.message || 'User not found' });
  }
});

// DELETE /api/v1/users/:id
router.delete('/:id', (req, res) => {
  const success = db.deleteUser(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.json({ success: true, message: 'User deleted successfully' });
});

export default router;

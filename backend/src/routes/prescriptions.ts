import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../data/db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { Prescription } from '../types';

const router = Router();

// Ensure uploads directory exists securely
const UPLOAD_DIR = path.resolve(__dirname, '../../uploads/prescriptions');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer Disk Storage setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `presc-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

// File validation filter
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];

  if (allowedTypes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB Max
  },
  fileFilter
});

// POST /api/v1/prescriptions/upload
router.post('/upload', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const uploadSingle = upload.single('prescription');

  uploadSingle(req, res, (err: any) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size must be less than 5 MB.'
        });
      }
      if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          success: false,
          message: 'Please upload a valid prescription image or PDF.'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'Error uploading file.'
      });
    }

    if (!req.file || !req.user) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid prescription image or PDF.'
      });
    }

    const prescription: Prescription = db.createPrescription({
      userId: req.user.id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.filename,
      uploadedAt: new Date().toISOString(),
      status: 'Uploaded',
      ocrData: {
        status: 'pending',
        extractedMedicines: [],
        dosage: [],
        frequency: [],
        duration: [],
        rawText: ''
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Prescription uploaded successfully',
      prescription
    });
  });
});

// GET /api/v1/prescriptions/my-prescriptions
router.get('/my-prescriptions', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const prescriptions = db.getPrescriptionsByUserId(req.user.id);
  return res.json({
    success: true,
    count: prescriptions.length,
    prescriptions
  });
});

// GET /api/v1/prescriptions/file/:id (Secure File Viewing Endpoint)
router.get('/file/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const fileId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const prescription = db.getPrescriptionById(fileId);

  if (!prescription) {
    return res.status(404).json({ success: false, message: 'Prescription not found' });
  }

  // Security check: Only the owner or an admin can access prescription files
  if (prescription.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized access to prescription file' });
  }

  const fullPath = path.join(UPLOAD_DIR, prescription.filePath);

  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ success: false, message: 'File missing on server' });
  }

  res.setHeader('Content-Type', prescription.fileType);
  res.setHeader('Content-Disposition', `inline; filename="${prescription.fileName}"`);
  return res.sendFile(fullPath);
});

export default router;

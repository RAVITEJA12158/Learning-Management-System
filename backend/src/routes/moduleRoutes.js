const express = require('express');
const router = express.Router();
const moduleController = require('../Controllers/moduleController');
const { authenticate, requireRole } = require('../Middleware/auth');
const { upload } = require('../Middleware/upload');

// Module CRUD (Faculty/Admin only)
router.post('/', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.createModule);
router.put('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.updateModule);
router.delete('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.deleteModule);

// Content CRUD (Faculty/Admin only)
router.post('/content', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.createContent);
router.put('/content/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.updateContent);
router.delete('/content/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.deleteContent);

// File upload (Cloudinary) — returns a URL to pass as contentUrl above
router.post(
  '/content/upload',
  authenticate,
  requireRole(['FACULTY', 'ADMIN']),
  upload.single('file'),
  moduleController.uploadContentFile
);

module.exports = router;

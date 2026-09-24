const express = require('express');
const router = express.Router();
const moduleController = require('../Controllers/moduleController');
const { authenticate, requireRole } = require('../Middleware/auth');

// Module CRUD (Faculty/Admin only)
router.post('/', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.createModule);
router.put('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.updateModule);
router.delete('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.deleteModule);

// Content CRUD (Faculty/Admin only)
router.post('/content', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.createContent);
router.put('/content/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.updateContent);
router.delete('/content/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), moduleController.deleteContent);

module.exports = router;

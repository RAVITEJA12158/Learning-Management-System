const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { authenticate, requireRole } = require('../Middleware/auth');
const { upload } = require('../Middleware/upload');

// User profile routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/profile/photo', authenticate, upload.single('file'), userController.updateProfilePhoto);
router.delete('/profile/photo', authenticate, userController.deleteProfilePhoto);

// Admin-only user management and system metrics
router.get('/stats', authenticate, requireRole(['ADMIN']), userController.getSystemStats);
router.get('/', authenticate, requireRole(['ADMIN']), userController.getAllUsers);
router.post('/', authenticate, requireRole(['ADMIN']), userController.createUser);
router.put('/:id', authenticate, requireRole(['ADMIN']), userController.updateUser);
router.delete('/:id', authenticate, requireRole(['ADMIN']), userController.deleteUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { authenticate } = require('../Middleware/auth');
const { upload } = require('../Middleware/upload');

// Protected profile routes
router.get('/profile', authenticate, userController.getProfile);
router.post('/profile/photo', authenticate, upload.single('file'), userController.updateProfilePhoto);
router.delete('/profile/photo', authenticate, userController.deleteProfilePhoto);

module.exports = router;

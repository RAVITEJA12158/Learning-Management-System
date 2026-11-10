const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');
const { authenticate, requireRole } = require('../Middleware/auth');

router.get('/', authenticate, notificationController.getMyNotifications);
router.put('/read-all', authenticate, notificationController.markAllAsRead);
router.put('/:id/read', authenticate, notificationController.markAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);

// Admin broadcast
router.post('/broadcast', authenticate, requireRole(['ADMIN']), notificationController.broadcastNotification);

module.exports = router;


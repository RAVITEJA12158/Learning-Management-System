const express = require('express');
const router = express.Router();
const announcementController = require('../Controllers/announcementController');
const { authenticate, requireRole } = require('../Middleware/auth');

router.get('/course/:courseId', authenticate, announcementController.getAnnouncementsByCourse);
router.post('/', authenticate, requireRole(['FACULTY', 'ADMIN']), announcementController.createAnnouncement);
router.put('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), announcementController.updateAnnouncement);
router.delete('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), announcementController.deleteAnnouncement);

module.exports = router;


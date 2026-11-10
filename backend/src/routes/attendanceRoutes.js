const express = require('express');
const router = express.Router();
const attendanceController = require('../Controllers/attendanceController');
const { authenticate, requireRole } = require('../Middleware/auth');

// Course session management (Faculty/Admin)
router.get('/course/:courseId', authenticate, requireRole(['FACULTY', 'ADMIN']), attendanceController.getSessionsByCourse);
router.post('/session', authenticate, requireRole(['FACULTY', 'ADMIN']), attendanceController.createSession);
router.put('/session/:sessionId/record', authenticate, requireRole(['FACULTY', 'ADMIN']), attendanceController.updateRecord);
router.post('/session/:sessionId/mark-all', authenticate, requireRole(['FACULTY', 'ADMIN']), attendanceController.markAllPresent);

// Student personal attendance overview
router.get('/student/course/:courseId', authenticate, attendanceController.getStudentAttendance);

module.exports = router;


const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/courseController');
const { authenticate, requireRole } = require('../Middleware/auth');

// Public or generally authenticated routes
router.get('/', authenticate, courseController.getAllCourses);
router.get('/:id', authenticate, courseController.getCourseById);

// Student routes
router.post('/:id/enroll', authenticate, requireRole(['STUDENT']), courseController.enrollStudent);
router.get('/student/enrolled', authenticate, requireRole(['STUDENT']), courseController.getEnrolledCourses);

// Faculty routes
router.post('/', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.createCourse);
router.put('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.updateCourse);
router.get('/faculty/created', authenticate, requireRole(['FACULTY']), courseController.getCreatedCourses);

module.exports = router;

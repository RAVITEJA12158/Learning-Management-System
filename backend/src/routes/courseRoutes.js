const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/courseController');
const { authenticate, requireRole } = require('../Middleware/auth');

// ── Static routes MUST come before /:id to avoid Express matching
//    "student" or "faculty" as an :id parameter.

// Student routes
router.get('/student/enrolled', authenticate, requireRole(['STUDENT']), courseController.getEnrolledCourses);

// Faculty routes
router.get('/faculty/created', authenticate, requireRole(['FACULTY']), courseController.getCreatedCourses);

// Course creation (Faculty/Admin)
router.post('/', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.createCourse);

// Parameterized routes (must come after static routes)
router.get('/', authenticate, courseController.getAllCourses);
router.get('/:id', authenticate, courseController.getCourseById);
router.put('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.updateCourse);
router.post('/:id/enroll', authenticate, requireRole(['STUDENT']), courseController.enrollStudent);
router.delete('/:id/enroll', authenticate, requireRole(['STUDENT']), courseController.unenrollStudent);
router.get('/:id/roster', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.getCourseRoster);

module.exports = router;

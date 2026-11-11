const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/courseController');
const { authenticate, requireRole } = require('../Middleware/auth');

// Static routes MUST come before /:id
router.get('/student/enrolled', authenticate, requireRole(['STUDENT']), courseController.getEnrolledCourses);
router.get('/faculty/created', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.getCreatedCourses);

// Course creation (Faculty/Admin)
router.post('/', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.createCourse);

// Parameterized routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/:id/modules', courseController.getCourseModules);
router.put('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.updateCourse);
router.delete('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.deleteCourse);
router.post('/:id/enroll', authenticate, requireRole(['STUDENT']), courseController.enrollStudent);
router.delete('/:id/enroll', authenticate, requireRole(['STUDENT']), courseController.unenrollStudent);
router.get('/:id/roster', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.getCourseRoster);
router.put('/:id/roster/:studentId', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.updateRosterStatus);
router.post('/:id/instructors', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.assignInstructor);
router.delete('/:id/instructors/:facultyId', authenticate, requireRole(['FACULTY', 'ADMIN']), courseController.removeInstructor);

module.exports = router;

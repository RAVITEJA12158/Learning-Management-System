const express = require('express');
const router = express.Router();
const gradeController = require('../Controllers/gradeController');
const { authenticate, requireRole } = require('../Middleware/auth');

// Grade components / weight rubric
router.get('/course/:courseId/components', authenticate, gradeController.getGradeComponents);
router.post('/course/:courseId/components', authenticate, requireRole(['FACULTY', 'ADMIN']), gradeController.saveGradeComponents);

// Instructor gradebook for course
router.get('/course/:courseId/roster', authenticate, requireRole(['FACULTY', 'ADMIN']), gradeController.getCourseGradebook);

// Student personal overall grades & transcript summary
router.get('/student/overview', authenticate, requireRole(['STUDENT']), gradeController.getStudentGradeOverview);

module.exports = router;


const express = require('express');
const router = express.Router();
const assignmentController = require('../Controllers/assignmentController');
const { authenticate, requireRole } = require('../Middleware/auth');
const { upload } = require('../Middleware/upload');

// Static / Course-specific routes
router.get('/course/:courseId', authenticate, assignmentController.getAssignmentsByCourse);
router.put('/submissions/:submissionId/grade', authenticate, requireRole(['FACULTY', 'ADMIN']), assignmentController.gradeSubmission);

// Assignment CRUD
router.post('/', authenticate, requireRole(['FACULTY', 'ADMIN']), assignmentController.createAssignment);
router.get('/:id', authenticate, assignmentController.getAssignmentById);
router.put('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), assignmentController.updateAssignment);
router.delete('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), assignmentController.deleteAssignment);

// Submissions
router.post('/:id/submit', authenticate, requireRole(['STUDENT']), upload.single('file'), assignmentController.submitAssignment);
router.get('/:id/submissions', authenticate, requireRole(['FACULTY', 'ADMIN']), assignmentController.getSubmissionsForAssignment);

module.exports = router;

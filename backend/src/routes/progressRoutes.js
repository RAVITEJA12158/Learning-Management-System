const express = require('express');
const router = express.Router();
const progressController = require('../Controllers/progressController');
const { authenticate, requireRole } = require('../Middleware/auth');

// Student marks a content item complete/incomplete
router.put(
  '/content/:contentId',
  authenticate,
  requireRole(['STUDENT']),
  progressController.markContentProgress
);

// Student's own progress summary for a course
router.get(
  '/course/:courseId',
  authenticate,
  requireRole(['STUDENT']),
  progressController.getCourseProgress
);

module.exports = router;

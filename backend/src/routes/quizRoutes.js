const express = require('express');
const router = express.Router();
const quizController = require('../Controllers/quizController');
const { authenticate, requireRole } = require('../Middleware/auth');

// Course-level quiz listing
router.get('/course/:courseId', authenticate, quizController.getQuizzesByCourse);

// Single attempt detail
router.get('/attempts/:attemptId', authenticate, quizController.getAttemptDetails);

// Quiz CRUD & Attempts
router.post('/', authenticate, requireRole(['FACULTY', 'ADMIN']), quizController.createQuiz);
router.get('/:id', authenticate, quizController.getQuizById);
router.put('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), quizController.updateQuiz);
router.delete('/:id', authenticate, requireRole(['FACULTY', 'ADMIN']), quizController.deleteQuiz);

router.post('/:id/attempt', authenticate, requireRole(['STUDENT']), quizController.submitQuizAttempt);
router.get('/:id/attempts', authenticate, quizController.getQuizAttempts);

module.exports = router;


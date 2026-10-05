const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const moduleRoutes = require('./moduleRoutes');
const progressRoutes = require('./progressRoutes');
const assignmentRoutes = require('./assignmentRoutes');
const userRoutes = require('./userRoutes');
const { authenticate } = require('../Middleware/auth');
const { apiLimiter } = require('../Middleware/rateLimiter');

// Apply general rate limit to all /api routes
router.use(apiLimiter);

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/modules', moduleRoutes);
router.use('/progress', progressRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/users', userRoutes);

// Protected route for testing integration
router.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route', user: req.user });
});

module.exports = router;
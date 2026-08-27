const express = require('express');

const router = express.Router();

const authRoutes = require('./authRoutes');
const authenticate = require('../Middleware/auth');

router.use('/auth', authRoutes);

// Protected route for testing integration
router.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route', user: req.user });
});

module.exports = router;
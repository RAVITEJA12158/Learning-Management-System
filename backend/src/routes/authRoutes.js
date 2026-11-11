const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require('../Controllers/authController');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require('../Middleware/validate');
const { authLimiter } = require('../Middleware/rateLimiter');

// POST /api/auth/register
router.post('/register', authLimiter, validateRegister, register);

// POST /api/auth/login
router.post('/login', authLimiter, validateLogin, login);

// GET /api/auth/verify/:token
router.get('/verify/:token', verifyEmail);

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, validateForgotPassword, forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, validateResetPassword, resetPassword);

module.exports = router;

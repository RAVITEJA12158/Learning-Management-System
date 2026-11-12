const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleLogin,
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
const { authLimiter, otpLimiter } = require('../Middleware/rateLimiter');

// POST /api/auth/register
router.post('/register', authLimiter, validateRegister, register);

// POST /api/auth/login
router.post('/login', authLimiter, validateLogin, login);

// POST /api/auth/google
router.post('/google', authLimiter, googleLogin);

// GET /api/auth/verify/:token
router.get('/verify/:token', verifyEmail);

// POST /api/auth/forgot-password
router.post('/forgot-password', otpLimiter, validateForgotPassword, forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, validateResetPassword, resetPassword);

module.exports = router;

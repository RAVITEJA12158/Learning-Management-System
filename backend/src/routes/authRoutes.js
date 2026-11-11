const express = require('express');
const router = express.Router();
const {
  register,
  sendRegistrationOtp,
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
const { authLimiter, otpLimiter } = require('../Middleware/rateLimiter');

// POST /api/auth/register
router.post('/register', otpLimiter, validateRegister, register);

// POST /api/auth/phone/send-registration-otp
router.post('/phone/send-registration-otp', otpLimiter, sendRegistrationOtp);

// POST /api/auth/login
router.post('/login', authLimiter, validateLogin, login);

// GET /api/auth/verify/:token
router.get('/verify/:token', verifyEmail);

// POST /api/auth/forgot-password
router.post('/forgot-password', otpLimiter, validateForgotPassword, forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, validateResetPassword, resetPassword);

module.exports = router;

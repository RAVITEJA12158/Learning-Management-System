const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/authController');
const { validateRegister, validateLogin } = require('../Middleware/validate');
const { authLimiter } = require('../Middleware/rateLimiter');

// POST /api/auth/register
router.post('/register', authLimiter, validateRegister, register);

// POST /api/auth/login
router.post('/login', authLimiter, validateLogin, login);

module.exports = router;

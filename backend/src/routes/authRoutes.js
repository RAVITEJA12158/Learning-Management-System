const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/authController');
const { validateRegister, validateLogin } = require('../Middleware/validate');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

module.exports = router;
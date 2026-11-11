const crypto = require('crypto');
const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../../utils/sendVerificationEmail');
const { sendPasswordResetEmail } = require('../../utils/sendVerificationEmail');

const ROLE_VALUES = { student: 'STUDENT', faculty: 'FACULTY', admin: 'ADMIN' };

// Requires at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 special character (any non-alphanumeric symbol)
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

const register = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword, mobile_number, role, secretCode } = req.body;

    if (!name || !username || !email || !password || !confirmPassword || !mobile_number) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const cleanedMobile = String(mobile_number).replace(/[\s\-()]/g, '');
    if (!/^\+?\d{10,15}$/.test(cleanedMobile)) {
      return res.status(400).json({ error: 'Phone number must be 10 to 15 digits (plus sign allowed)' });
    }
    if (!STRONG_PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special symbol',
      });
    }

    const requestedRole = (role || 'student').toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(ROLE_VALUES, requestedRole)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    if (requestedRole === 'admin') {
      if (!secretCode || secretCode !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ error: 'Invalid administrator secret code' });
      }
    }

    const cleanName = name.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { username: cleanUsername },
          { mobileNumber: cleanedMobile },
        ],
      },
    });

    if (existing) {
      if (
        existing.mobileNumber &&
        existing.mobileNumber === cleanedMobile &&
        existing.email !== cleanEmail &&
        existing.username !== cleanUsername
      ) {
        return res.status(409).json({ error: 'Mobile number already in use' });
      }
      return res.status(409).json({ error: 'Email or username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        mobileNumber: cleanedMobile,
        passwordHash: hashedPassword,
        role: ROLE_VALUES[requestedRole],
        isVerified: true,
      },
    });

    // Send welcome / verification email via EmailJS if configured (non-blocking)
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY) {
      const frontendBase = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
      sendVerificationEmail({
        email: cleanEmail,
        name: cleanName,
        verificationLink: `${frontendBase}/login?verified=true`,
      }).catch((err) => {
        console.warn('Non-blocking verification email error:', err.message);
      });
    }

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not configured');
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const registerResponse = {
      message: 'User registered successfully',
      token,
      userId: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      department: user.department || null,
      semester: user.semester || null,
      bio: user.bio || null,
    };
    if (user.profileImage) {
      registerResponse.profileImage = user.profileImage;
    }

    return res.status(201).json(registerResponse);
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Error registering user' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, secretCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.status && user.status.toUpperCase() === 'SUSPENDED') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact an administrator.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (user.role === 'ADMIN') {
      if (!secretCode) {
        return res.status(400).json({ error: 'Secret code is required for admin login' });
      }
      if (secretCode !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ error: 'Invalid secret code' });
      }
    }

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not configured');
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const loginResponse = {
      message: 'Login successful',
      token,
      userId: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      department: user.department || null,
      semester: user.semester || null,
      bio: user.bio || null,
    };
    if (user.profileImage) {
      loginResponse.profileImage = user.profileImage;
    }

    return res.status(200).json(loginResponse);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Error logging in' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    return res.json({ message: 'Email verified successfully. You may now sign in.' });
  } catch (error) {
    console.error('verifyEmail error:', error);
    return res.status(500).json({ error: 'Failed to verify email' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid academic email address' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      // Do not leak whether the email is registered
      return res.json({
        message: 'If an account exists for that email, a password reset code has been sent.',
      });
    }

    // Generate a 6-digit numeric reset code (valid for 15 minutes)
    const resetToken = String(crypto.randomInt(100000, 999999));
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    const frontendBase = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const resetLink = `${frontendBase}/login?resetEmail=${encodeURIComponent(cleanEmail)}&resetCode=${resetToken}`;

    let emailDispatched = false;
    try {
      const emailResult = await sendPasswordResetEmail({
        email: cleanEmail,
        name: user.name,
        resetToken,
        resetLink,
      });
      emailDispatched = Boolean(emailResult?.sent);
    } catch (emailErr) {
      console.warn('Password reset email dispatch warning:', emailErr.message);
    }

    const responsePayload = {
      message: emailDispatched
        ? 'A 6-digit password reset code has been sent to your email address.'
        : 'Password reset code generated. Check your email (or use the development reset code if EmailJS is not configured).',
      emailDispatched,
    };

    // In non-production or when EmailJS keys are not set yet, include devResetToken so testing is never blocked
    if (process.env.NODE_ENV !== 'production' || !emailDispatched) {
      responsePayload.devResetToken = resetToken;
    }

    return res.json(responsePayload);
  } catch (error) {
    console.error('forgotPassword error:', error);
    return res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword, confirmPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: 'Email, reset code, and new password are required' });
    }
    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special symbol',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (
      !user ||
      !user.resetPasswordToken ||
      user.resetPasswordToken !== String(token).trim() ||
      !user.resetPasswordExpires ||
      new Date(user.resetPasswordExpires) < new Date()
    ) {
      return res.status(400).json({ error: 'Invalid or expired password reset code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return res.json({ message: 'Password has been reset successfully. You can now sign in.' });
  } catch (error) {
    console.error('resetPassword error:', error);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  STRONG_PASSWORD_REGEX,
};

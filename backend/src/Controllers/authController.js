const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ROLE_VALUES = { student: "STUDENT", faculty: "FACULTY" };

const register = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword, mobile_number, role } = req.body;

    if (!name || !username || !email || !password || !confirmPassword || !mobile_number) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const cleanedMobile = mobile_number.replace(/[\s\-()]/g, "");
    if (!/^\+?\d{10}$/.test(cleanedMobile)) {
      return res.status(400).json({ error: "Phone number must be 10 digits (plus sign allowed)" });
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 6 characters and include uppercase, lowercase, number, and special symbol",
      });
    }

    const requestedRole = (role || "student").toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(ROLE_VALUES, requestedRole)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const cleanName = name.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: cleanEmail }, { username: cleanUsername }] },
    });
    if (existing) {
      return res.status(409).json({ error: "Email or username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        passwordHash: hashedPassword,
        role: ROLE_VALUES[requestedRole],
      },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      userId: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Error registering user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, secretCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (user.role === "ADMIN") {
      if (!secretCode) {
        return res.status(400).json({ error: "Secret code is required for admin login" });
      }
      if (secretCode !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ error: "Invalid secret code" });
      }
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      userId: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Error logging in" });
  }
};

module.exports = { register, login };

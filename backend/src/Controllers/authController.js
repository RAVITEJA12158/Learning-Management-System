const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ROLE_IDS = {
  student: 1,
  faculty: 2,
};

const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      mobile_number,
      role, // "student" | "faculty" — optional, defaults to student
    } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !mobile_number
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }

    const cleanedMobile = mobile_number.replace(/[\s\-\(\)]/g, "");
    if (!/^\+?\d{7,15}$/.test(cleanedMobile)) {
      return res
        .status(400)
        .json({ error: "Phone number must be 7-15 digits (plus sign allowed)" });
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password)
    ) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters and include uppercase, lowercase, number, and special symbol",
      });
    }

    // --- Role handling (admin excluded — created manually in DB only) ---
    const requestedRole = (role || "student").toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(ROLE_IDS, requestedRole)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }
    const role_id = ROLE_IDS[requestedRole];

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Email or username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        mobile_number: cleanedMobile,
        role_id,
      },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: user.id,
      username: user.username,
      role_id: user.role_id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Error registering user" });
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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.is_active)
      return res.status(403).json({ error: "Account is deactivated" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid password" });

    // --- Extra check for admin accounts ---
    const ADMIN_ROLE_ID = 3; // match whatever you set manually in the DB
    if (user.role_id === ADMIN_ROLE_ID) {
      if (!secretCode) {
        return res
          .status(400)
          .json({ error: "Secret code is required for admin login" });
      }
      if (secretCode !== process.env.ADMIN_SECRET_CODE) {
        console.warn(`Failed admin secret code attempt for email: ${email}`);
        return res.status(403).json({ error: "Invalid secret code" });
      }
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.id,
      username: user.username,
      role_id: user.role_id,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
};

module.exports = { register, login };

jest.mock("../src/config/db", () => ({
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const prisma = require("../src/config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { register, login } = require("../src/Controllers/authController");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h";
    jwt.sign.mockReturnValue("signed-token");
  });

  describe("register", () => {
    const validBody = {
      username: "testuser",
      email: "test@example.com",
      password: "Password1!",
      confirmPassword: "Password1!",
      mobile_number: "(987) 654-3210",
    };

    it("registers a new user and returns a token", async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed-password");
      prisma.user.create.mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@example.com",
        role_id: 1,
      });

      const req = { body: validBody };
      const res = mockResponse();

      await register(req, res);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: "test@example.com" }, { username: "testuser" }],
        },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("Password1!", 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: "testuser",
          email: "test@example.com",
          password: "hashed-password",
          mobile_number: "9876543210",
          role_id: 1,
        },
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, role: 1 },
        "test-secret",
        { expiresIn: "1h" },
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        token: "signed-token",
        userId: 1,
        username: "testuser",
        role_id: 1,
      });
    });

    it("registers a faculty user when role is provided", async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed-password");
      prisma.user.create.mockResolvedValue({
        id: 2,
        username: "facultyuser",
        email: "faculty@example.com",
        role_id: 2,
      });

      const req = {
        body: {
          ...validBody,
          username: "facultyuser",
          email: "faculty@example.com",
          role: "faculty",
        },
      };
      const res = mockResponse();

      await register(req, res);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: "facultyuser",
          email: "faculty@example.com",
          password: "hashed-password",
          mobile_number: "9876543210",
          role_id: 2,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("returns 400 when required fields are missing", async () => {
      const req = { body: { email: "test@example.com" } };
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "All fields are required",
      });
      expect(prisma.user.findFirst).not.toHaveBeenCalled();
    });

    it("returns 400 when passwords do not match", async () => {
      const req = {
        body: { ...validBody, confirmPassword: "Different1!" },
      };
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Passwords do not match",
      });
    });

    it("returns 400 for an invalid email", async () => {
      const req = { body: { ...validBody, email: "invalid-email" } };
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Please enter a valid email address",
      });
    });

    it("returns 400 for an invalid mobile number", async () => {
      const req = { body: { ...validBody, mobile_number: "12abc" } };
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Phone number must be 7-15 digits (plus sign allowed)",
      });
    });

    it("returns 400 for a weak password", async () => {
      const req = {
        body: {
          ...validBody,
          password: "weakpass",
          confirmPassword: "weakpass",
        },
      };
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Password must be at least 6 characters and include uppercase, lowercase, number, and special symbol",
      });
    });

    it("returns 400 for an invalid role", async () => {
      const req = { body: { ...validBody, role: "admin" } };
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid role specified",
      });
      expect(prisma.user.findFirst).not.toHaveBeenCalled();
    });

    it("returns 409 when email or username already exists", async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 1 });

      const req = { body: validBody };
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: "Email or username already in use",
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("returns 500 when registration fails unexpectedly", async () => {
      prisma.user.findFirst.mockRejectedValue(new Error("database down"));
      jest.spyOn(console, "error").mockImplementation(() => {});

      const req = { body: validBody };
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error registering user",
      });
      console.error.mockRestore();
    });
  });

  describe("login", () => {
    const validBody = {
      email: "test@example.com",
      password: "Password1!",
    };

    const activeUser = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: "hashed-password",
      role_id: 1,
      is_active: true,
    };

    it("logs in an active user and returns a token", async () => {
      prisma.user.findUnique.mockResolvedValue(activeUser);
      bcrypt.compare.mockResolvedValue(true);

      const req = { body: validBody };
      const res = mockResponse();

      await login(req, res);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "Password1!",
        "hashed-password",
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, role: 1 },
        "test-secret",
        { expiresIn: "1h" },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "signed-token",
        userId: 1,
        username: "testuser",
        role_id: 1,
      });
    });

    it("logs in an admin when the correct secret code is provided", async () => {
      process.env.ADMIN_SECRET_CODE = "admin-secret";
      prisma.user.findUnique.mockResolvedValue({
        ...activeUser,
        role_id: 3,
      });
      bcrypt.compare.mockResolvedValue(true);

      const req = {
        body: {
          ...validBody,
          secretCode: "admin-secret",
        },
      };
      const res = mockResponse();

      await login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, role: 3 },
        "test-secret",
        { expiresIn: "1h" },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "signed-token",
        userId: 1,
        username: "testuser",
        role_id: 3,
      });
    });

    it("returns 400 when email or password is missing", async () => {
      const req = { body: { email: "test@example.com" } };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Email and password are required",
      });
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("returns 400 for an invalid email", async () => {
      const req = { body: { ...validBody, email: "bad-email" } };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Please enter a valid email address",
      });
    });

    it("returns 400 for a short password", async () => {
      const req = { body: { ...validBody, password: "short" } };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Password must be at least 6 characters",
      });
    });

    it("returns 404 when the user is not found", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const req = { body: validBody };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("returns 403 when the account is deactivated", async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...activeUser,
        is_active: false,
      });

      const req = { body: validBody };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Account is deactivated",
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("returns 401 when the password is invalid", async () => {
      prisma.user.findUnique.mockResolvedValue(activeUser);
      bcrypt.compare.mockResolvedValue(false);

      const req = { body: validBody };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid password" });
    });

    it("returns 400 when an admin logs in without a secret code", async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...activeUser,
        role_id: 3,
      });
      bcrypt.compare.mockResolvedValue(true);

      const req = { body: validBody };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Secret code is required for admin login",
      });
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it("returns 403 when an admin provides an invalid secret code", async () => {
      process.env.ADMIN_SECRET_CODE = "admin-secret";
      prisma.user.findUnique.mockResolvedValue({
        ...activeUser,
        role_id: 3,
      });
      bcrypt.compare.mockResolvedValue(true);
      jest.spyOn(console, "warn").mockImplementation(() => {});

      const req = {
        body: {
          ...validBody,
          secretCode: "wrong-secret",
        },
      };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid secret code",
      });
      expect(jwt.sign).not.toHaveBeenCalled();
      console.warn.mockRestore();
    });

    it("returns 500 when login fails unexpectedly", async () => {
      prisma.user.findUnique.mockRejectedValue(new Error("database down"));
      jest.spyOn(console, "error").mockImplementation(() => {});

      const req = { body: validBody };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error logging in" });
      console.error.mockRestore();
    });
  });
});

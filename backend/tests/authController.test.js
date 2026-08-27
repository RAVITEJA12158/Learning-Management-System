jest.mock("../src/config/db", () => ({
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock("bcryptjs", () => ({ hash: jest.fn(), compare: jest.fn() }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn() }));

const prisma = require("../src/config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { register, login } = require("../src/Controllers/authController");

const response = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const registration = {
  name: "Test User",
  username: "testuser",
  email: "test@example.com",
  password: "Password1!",
  confirmPassword: "Password1!",
  mobile_number: "9876543210",
  role: "student",
};

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h";
    jwt.sign.mockReturnValue("signed-token");
  });

  describe("register", () => {
    it("stores name and username as separate fields", async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed-password");
      prisma.user.create.mockResolvedValue({
        id: "user-1",
        name: "Test User",
        username: "testuser",
        role: "STUDENT",
      });

      const res = response();
      await register({ body: registration }, res);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: "Test User",
          username: "testuser",
          email: "test@example.com",
          passwordHash: "hashed-password",
          role: "STUDENT",
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        token: "signed-token",
        userId: "user-1",
        name: "Test User",
        username: "testuser",
        role: "STUDENT",
      });
    });

    it("requires a name as well as a username", async () => {
      const res = response();
      await register({ body: { ...registration, name: "" } }, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "All fields are required" });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("rejects an existing email or username", async () => {
      prisma.user.findFirst.mockResolvedValue({ id: "existing-user" });
      const res = response();
      await register({ body: registration }, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "Email or username already in use" });
    });
  });

  describe("login", () => {
    it("uses the Prisma passwordHash field and returns both identity fields", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        name: "Test User",
        username: "testuser",
        role: "STUDENT",
        passwordHash: "hashed-password",
      });
      bcrypt.compare.mockResolvedValue(true);

      const res = response();
      await login({ body: { email: "test@example.com", password: "Password1!" } }, res);

      expect(bcrypt.compare).toHaveBeenCalledWith("Password1!", "hashed-password");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "signed-token",
        userId: "user-1",
        name: "Test User",
        username: "testuser",
        role: "STUDENT",
      });
    });

    it("rejects an invalid password", async () => {
      prisma.user.findUnique.mockResolvedValue({ passwordHash: "hashed-password" });
      bcrypt.compare.mockResolvedValue(false);
      const res = response();

      await login({ body: { email: "test@example.com", password: "Password1!" } }, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid password" });
    });
  });
});

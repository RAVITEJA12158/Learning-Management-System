const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/lib/prisma');
const bcrypt = require('bcryptjs');

// Mock Prisma so we don't hit the real database during integration tests
jest.mock('../src/lib/prisma', () => ({
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Authentication Integration Flow', () => {
  let token;
  const testUser = {
    username: 'integrationuser',
    email: 'integration@example.com',
    password: 'Password1!',
    confirmPassword: 'Password1!',
    mobile_number: '1234567890',
  };

  beforeAll(() => {
    // Set test environment variables
    process.env.JWT_SECRET = 'test-super-secret-key';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully register, login, and access a protected route', async () => {

    // 1. REGISTER

    prisma.user.findFirst.mockResolvedValue(null); // No existing user
    prisma.user.create.mockResolvedValue({
      id: 99,
      username: testUser.username,
      email: testUser.email,
      role_id: 1,
    });

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty('message', 'User registered successfully');
    expect(registerRes.body).toHaveProperty('token');


    // 2. LOGIN

    // Real bcrypt is used, so we need to provide a real hashed password for the mock DB to return
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 99,
      username: testUser.username,
      email: testUser.email,
      password: hashedPassword,
      role_id: 1,
      is_active: true,
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('message', 'Login successful');
    expect(loginRes.body).toHaveProperty('token');

    // Save token for the next step
    token = loginRes.body.token;


    // 3. ACCESS PROTECTED ROUTE

    const protectedRes = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(protectedRes.status).toBe(200);
    expect(protectedRes.body.message).toBe('You have accessed a protected route');
    expect(protectedRes.body.user).toHaveProperty('userId', 99);
  });

  it('should deny access to protected route with no token', async () => {
    const res = await request(app).get('/api/protected');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Access denied. No token provided.');
  });

  it('should deny access to protected route with an invalid token', async () => {
    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Invalid or expired token.');
  });
});

const request = require('supertest');
const app = require('../src/server');

describe('API request safety and routing', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'jest-only-api-secret';
  });

  it('rejects an incomplete registration before accessing the database', async () => {
    const response = await request(app).post('/api/auth/register').send({ email: 'invalid' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'All registration fields are required' });
  });

  it('returns JSON 404 for an unknown endpoint', async () => {
    const response = await request(app).get('/api/no-such-endpoint');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not found' });
  });

  it('returns a controlled 400 for malformed JSON', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{not-json');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid JSON request body.' });
  });

  it('blocks a student from faculty-only attendance routes', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: 'student-1', role: 'STUDENT' }, process.env.JWT_SECRET);
    const response = await request(app)
      .get('/api/attendance/course/course-1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Access denied. Insufficient permissions.' });
  });
});

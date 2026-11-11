const jwt = require('jsonwebtoken');
const { authenticate, requireRole } = require('../src/Middleware/auth');

function response() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('authentication and role middleware', () => {
  const secret = 'jest-only-secret-never-used-by-the-application';

  beforeEach(() => {
    process.env.JWT_SECRET = secret;
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  it('verifies a signed JWT and attaches the user identity to the request', () => {
    const token = jwt.sign({ userId: 'student-1', role: 'STUDENT' }, secret);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = response();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(req.user).toMatchObject({ userId: 'student-1', role: 'STUDENT' });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rejects missing, malformed, expired, and invalid-role tokens', () => {
    const invalidRole = jwt.sign({ userId: 'user-1', role: 'SUPERUSER' }, secret);
    const expired = jwt.sign({ userId: 'user-1', role: 'STUDENT' }, secret, { expiresIn: -1 });

    for (const authorization of [undefined, 'Bearer invalid', `Bearer ${expired}`, `Bearer ${invalidRole}`]) {
      const req = { headers: authorization ? { authorization } : {} };
      const res = response();
      const next = jest.fn();
      authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(authorization ? 403 : 401);
      expect(next).not.toHaveBeenCalled();
    }
  });

  it('allows matching roles and blocks users without an allowed role', () => {
    const res = response();
    const next = jest.fn();
    const gate = requireRole(['FACULTY', 'ADMIN']);

    gate({ user: { role: 'FACULTY' } }, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    gate({ user: { role: 'STUDENT' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. Insufficient permissions.' });
  });
});

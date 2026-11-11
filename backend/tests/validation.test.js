const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require('../src/Middleware/validate');

function invoke(middleware, body) {
  const req = { body };
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  const next = jest.fn();
  middleware(req, res, next);
  return { res, next };
}

describe('request validation middleware', () => {
  const registration = {
    name: 'Test User', username: 'test_user', email: 'test@example.edu',
    password: 'SafePassword1!', confirmPassword: 'SafePassword1!', mobile_number: '1234567890',
  };

  it('accepts a complete student registration and rejects missing fields or invalid roles', () => {
    expect(invoke(validateRegister, registration).next).toHaveBeenCalled();

    const missing = invoke(validateRegister, { ...registration, email: ' ' });
    expect(missing.res.status).toHaveBeenCalledWith(400);

    const invalidRole = invoke(validateRegister, { ...registration, role: 'GUEST' });
    expect(invalidRole.res.status).toHaveBeenCalledWith(400);
  });

  it('requires an administrator code for admin registration', () => {
    const result = invoke(validateRegister, { ...registration, role: 'admin' });
    expect(result.res.status).toHaveBeenCalledWith(400);
    expect(result.res.json).toHaveBeenCalledWith({
      error: 'Administrator secret code is required to register as admin',
    });
  });

  it('validates login, forgot-password, and reset-password required fields', () => {
    expect(invoke(validateLogin, { email: 'a@b.test', password: 'secret' }).next).toHaveBeenCalled();
    expect(invoke(validateLogin, { email: '', password: '' }).res.status).toHaveBeenCalledWith(400);
    expect(invoke(validateForgotPassword, { email: 'a@b.test' }).next).toHaveBeenCalled();
    expect(invoke(validateForgotPassword, {}).res.status).toHaveBeenCalledWith(400);
    expect(invoke(validateResetPassword, { email: 'a@b.test', token: '123456', newPassword: 'NewPass1!' }).next)
      .toHaveBeenCalled();
    expect(invoke(validateResetPassword, { email: 'a@b.test', token: '', newPassword: '' }).res.status)
      .toHaveBeenCalledWith(400);
  });
});

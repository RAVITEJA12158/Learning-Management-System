function validateRegister(req, res, next) {
  const { name, username, email, password, confirmPassword, mobile_number, role, secretCode } = req.body || {}

  if ([name, username, email, password, confirmPassword, mobile_number].some(
    (value) => typeof value !== 'string' || !value.trim()
  )) {
    return res.status(400).json({ error: 'All registration fields are required' })
  }

  const requestedRole = (role || 'student').toLowerCase()
  if (!['student', 'faculty', 'admin'].includes(requestedRole)) {
    return res.status(400).json({ error: 'Role must be student, faculty, or admin' })
  }

  if (requestedRole === 'admin' && (!secretCode || !secretCode.trim())) {
    return res.status(400).json({ error: 'Administrator secret code is required to register as admin' })
  }

  next()
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {}
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  next()
}

module.exports = { validateRegister, validateLogin }

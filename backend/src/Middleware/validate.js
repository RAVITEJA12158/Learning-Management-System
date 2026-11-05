function validateRegister(req, res, next) {
  const { name, username, email, password, confirmPassword, mobile_number, role } = req.body || {}

  if ([name, username, email, password, confirmPassword, mobile_number].some(
    (value) => typeof value !== 'string' || !value.trim()
  )) {
    return res.status(400).json({ error: 'All registration fields are required' })
  }

  if (role !== undefined && typeof role !== 'string') {
    return res.status(400).json({ error: 'Role must be student or faculty' })
  }
  if (!['student', 'faculty'].includes((role || 'student').toLowerCase())) {
    return res.status(400).json({ error: 'Role must be student or faculty' })
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

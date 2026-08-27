function validateRegister(req, res, next) {
  const { username, email, password, confirmPassword, mobile_number, role } = req.body || {}

  if (!username || !email || !password || !confirmPassword || !mobile_number) {
    return res.status(400).json({ error: 'All registration fields are required' })
  }

  if (!['student', 'faculty'].includes((role || 'student').toLowerCase())) {
    return res.status(400).json({ error: 'Role must be student or faculty' })
  }

  next()
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  next()
}

module.exports = { validateRegister, validateLogin }

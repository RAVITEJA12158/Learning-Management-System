const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const match = typeof authHeader === 'string' && authHeader.match(/^Bearer ([^\s]+)$/i);
  if (!match) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = match[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (
      !decoded ||
      typeof decoded !== 'object' ||
      typeof decoded.userId !== 'string' ||
      !['STUDENT', 'FACULTY', 'ADMIN'].includes(decoded.role)
    ) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { authenticate, requireRole };

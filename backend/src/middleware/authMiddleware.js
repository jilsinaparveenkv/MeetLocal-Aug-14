const { verifyToken } = require('../utils/generateToken');

/**
 * Authentication Middleware
 * Protects endpoints by verifying incoming JWT tokens in the Authorization header.
 * Attaches decoded user profile to req.user.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user info { id, email, name }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

module.exports = authMiddleware;

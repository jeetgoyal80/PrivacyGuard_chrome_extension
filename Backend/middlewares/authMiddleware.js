const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

module.exports = (req, res, next) => {
  try {
    // Expect header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    // Verify token and decode payload
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Attach only the user ID to req.user
    req.user = { id: decoded.id };
    
    
   next();

  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ error: 'Token is invalid or expired' });
  }
};

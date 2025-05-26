const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

module.exports = async (req, res, next) => {
  try {
    // Expect header in the form: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach user to request
    req.user = { id: decoded.id };

    // (Optional) You could fetch full user from DB if needed:
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ error: 'Token is invalid or expired' });
  }
};

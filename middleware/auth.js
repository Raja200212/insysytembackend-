const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'website_electron_super_secret_jwt_key_2026');
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.is_admin) {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAdmin
};

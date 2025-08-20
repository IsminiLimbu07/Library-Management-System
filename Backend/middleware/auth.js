const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

// Librarian only access
const librarianOnly = (req, res, next) => {
  if (req.user && req.user.role === 'librarian') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Librarian role required.' });
  }
};

// Borrower only access
const borrowerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'borrower') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Borrower role required.' });
  }
};

module.exports = { protect, librarianOnly, borrowerOnly };
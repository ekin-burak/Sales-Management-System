const jwt = require('jsonwebtoken');
const { ValidationError } = require('../utils/errors');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ValidationError('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ValidationError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new ValidationError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ValidationError('Token expired'));
    } else {
      next(error);
    }
  }
};

module.exports = { authenticate }; 
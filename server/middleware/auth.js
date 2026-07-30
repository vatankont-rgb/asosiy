const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { formatResponse } = require('../utils/helpers');
const userRepository = require('../repositories/userRepository');

const authenticate = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token && req.cookies && req.cookies.yk_session) {
    token = req.cookies.yk_session;
  }

  if (!token) {
    return res.status(401).json(formatResponse({
      success: false,
      message: 'Access denied. No session token provided.',
      errors: ['Unauthorized']
    }));
  }

  try {
    const verified = jwt.verify(token, config.jwtSecret);
    req.user = verified;
    
    // Eski tokenlar uchun role ni bazadan olish
    if (!req.user.role) {
      const user = await userRepository.getByUsername(req.user.username);
      if (user) req.user.role = user.role;
    }
    
    next();
  } catch (err) {
    return res.status(401).json(formatResponse({
      success: false,
      message: 'Invalid session token or session expired.',
      errors: ['Unauthorized']
    }));
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(formatResponse({
        success: false,
        message: 'Unauthorized.',
        errors: ['Unauthorized']
      }));
    }

    const hasRole = roles.length === 0 || roles.includes(req.user.role) || req.user.role === 'Super Admin';
    if (!hasRole) {
      return res.status(403).json(formatResponse({
        success: false,
        message: 'Forbidden. You do not have permissions for this action.',
        errors: ['Forbidden']
      }));
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};

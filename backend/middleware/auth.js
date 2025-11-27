const JWTUtils = require('../utils/jwt');
const User = require('../models/User');
const logger = require('../utils/logger');

// Middleware to authenticate access token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        error: 'NO_TOKEN'
      });
    }

    const decoded = JWTUtils.verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
        error: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Token authentication error:', error);
    
    if (error.message === 'Access token expired') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
        error: 'TOKEN_EXPIRED'
      });
    } else if (error.message === 'Invalid access token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token',
        error: 'INVALID_TOKEN'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Token verification failed',
      error: 'VERIFICATION_FAILED'
    });
  }
};

// Middleware to authorize based on roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Middleware to optionally authenticate (for public routes that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = JWTUtils.verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Ignore errors for optional auth and continue
    next();
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  optionalAuth
};
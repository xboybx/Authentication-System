const jwt = require('jsonwebtoken');

class JWTUtils {
  // Generate access token
  static generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '15m',
      issuer: 'auth-system',
      audience: 'auth-users'
    });
  }

  // Generate refresh token
  static generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
      issuer: 'auth-system',
      audience: 'auth-users'
    });
  }

  // Verify access token
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
        issuer: 'auth-system',
        audience: 'auth-users'
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, {
        issuer: 'auth-system',
        audience: 'auth-users'
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  // Decode token without verification (for getting payload)
  static decodeToken(token) {
    return jwt.decode(token);
  }

  // Get token expiration time
  static getTokenExpiration(token) {
    const decoded = this.decodeToken(token);
    return decoded ? new Date(decoded.exp * 1000) : null;
  }

  // Check if token is about to expire (within threshold minutes)
  static isTokenAboutToExpire(token, thresholdMinutes = 5) {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return false;
    
    const now = new Date();
    const threshold = new Date(now.getTime() + (thresholdMinutes * 60 * 1000));
    
    return expiration <= threshold;
  }
}

module.exports = JWTUtils;
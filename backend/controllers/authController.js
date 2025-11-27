const { validationResult } = require('express-validator');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const JWTUtils = require('../utils/jwt');
const logger = require('../utils/logger');

class AuthController {
  // User registration
  static async register(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists with this email',
          error: 'DUPLICATE_EMAIL'
        });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password
      });

      await user.save();

      // logger.info(`New user registered: ${email}`);

      // // Remove password from response
      // const userResponse = user.toObject();
      // delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
  }

  // User login
  static async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      // User-Agent is a string that tells the server what browser/device/app is making the request.
      const userAgent = req.get('User-Agent') || 'Unknown';
      const ip = req.ip || req.connection.remoteAddress;

      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          error: 'INVALID_CREDENTIALS'
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        logger.warn(`Failed login attempt for email: ${email} from IP: ${ip}`);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          error: 'INVALID_CREDENTIALS'
        });
      }

      // Update last login
      await user.updateLastLogin();

      // Generate tokens
      const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
      };

      const accessToken = JWTUtils.generateAccessToken(tokenPayload);
      const refreshTokenValue = JWTUtils.generateRefreshToken(tokenPayload);

      // Save refresh token to database
      const refreshToken = new RefreshToken({
        user: user._id,
        token: refreshTokenValue,
        expiresAt: JWTUtils.getTokenExpiration(refreshTokenValue),
        createdByIp: ip,
        userAgent: userAgent
      });

      await refreshToken.save();

      logger.info(`User logged in: ${email} from IP: ${ip}`);

      // Remove password from user object
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          accessToken,
          refreshToken: refreshTokenValue
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      next(error);
    }
  }

  // ReCreate access token
  // Trade your long token for a new short token (and a new long token too!) 
  //because the acess token (short token) expires after 15 minutes
  static async refresh(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { refreshToken } = req.body;//with this refreshToken(LongTerm Token) we create new short and long token again cause the  Acesss Token(shortTerm) token expires right
      const userAgent = req.get('User-Agent') || 'Unknown';
      const ip = req.ip || req.connection.remoteAddress;

      // Verify refresh token
      let decoded;
      try {
        decoded = JWTUtils.verifyRefreshToken(refreshToken);
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
          error: 'INVALID_REFRESH_TOKEN'
        });
      }

      // Find refresh token in database
      const storedToken = await RefreshToken.findByToken(refreshToken).populate('user');

      if (!storedToken || !storedToken.isActive || storedToken.isExpired()) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token not found or expired',
          error: 'TOKEN_NOT_FOUND'
        });
      }

      const user = storedToken.user;
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive',
          error: 'USER_NOT_FOUND'
        });
      }

      // Revoke old refresh token
      await storedToken.revoke();//revoking the old refreshToken(LongTerm Token)
      //(mark as inactive) for the token after revoke

      // Generate new tokens
      const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
      };

      const newAccessToken = JWTUtils.generateAccessToken(tokenPayload);//new short term token
      const newRefreshTokenValue = JWTUtils.generateRefreshToken(tokenPayload);//new long term token

      // This is the NEW RefreshToken (LongTerm Token) being saved
      const newRefreshToken = new RefreshToken({
        user: user._id,
        token: newRefreshTokenValue,
        expiresAt: JWTUtils.getTokenExpiration(newRefreshTokenValue),
        createdByIp: ip,
        userAgent: userAgent,
        replacedByToken: storedToken.token//its the old refreshToken(LongTerm Token) that was revoked
      });

      await newRefreshToken.save();

      logger.info(`Token refreshed for user: ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshTokenValue
        }
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      next(error);
    }
  }

  // User logout
  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // Revoke refresh token if provided
        const storedToken = await RefreshToken.findByToken(refreshToken);
        if (storedToken) {
          await storedToken.revoke();
        }
      }

      // If user is authenticated, we can also revoke all their tokens
      if (req.user) {
        await RefreshToken.updateMany(
          { user: req.user._id, isActive: true },
          { isActive: false }
        );
        logger.info(`User logged out: ${req.user.email}`);
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      next(error);
    }
  }

  // Get user profile (protected route example)
  static async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user._id).select('-password');

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          user
        }
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      next(error);
    }
  }

  // Cleanup expired tokens (for maintenance)
  static async cleanupTokens(req, res, next) {
    try {
      const deletedCount = await RefreshToken.cleanupExpiredTokens();

      res.status(200).json({
        success: true,
        message: 'Token cleanup completed',
        data: {
          deletedTokens: deletedCount
        }
      });
    } catch (error) {
      logger.error('Token cleanup error:', error);
      next(error);
    }
  }
}

module.exports = AuthController;
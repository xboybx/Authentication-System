const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/security');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation
} = require('../validators/authValidators');

// Public routes
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);
router.post('/refresh', refreshTokenValidation, AuthController.refresh);// Refresh access token

router.post('/logout', AuthController.logout);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);

// Admin routes (for maintenance)
router.delete('/cleanup-tokens', authenticateToken, AuthController.cleanupTokens);

module.exports = router;
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const {
  corsOptions,
  securityHeaders,
  requestLogger,
  sanitizeInput,
  generalRateLimiter
} = require('./middleware/security');

// Import routes
const authRoutes = require('./routes/authRoutes');
const TokenScheduler = require('./utils/scheduler');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Start automatic token cleanup (runs every 6 hours)
TokenScheduler.startPeriodicCleanup();

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom middleware
app.use(requestLogger);
app.use(sanitizeInput);
app.use(generalRateLimiter);

// Trust proxy for accurate IP logging
app.set('trust proxy', 1);


// Ignore favicon requests
app.use('/favicon.ico', (req, res) => res.status(204).send());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth'
    }
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
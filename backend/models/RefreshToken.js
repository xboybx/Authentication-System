const mongoose = require('mongoose');
const crypto = require('crypto');

const refreshTokenSchema = new mongoose.Schema({//Longlived token for 7days
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdByIp: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  replacedByToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash token before saving
refreshTokenSchema.pre('save', function (next) {
  if (!this.isModified('token')) return next();

  // Hash the token for storage (we store the hash, not the actual token)
  this.token = crypto.createHash('sha256').update(this.token).digest('hex');
  next();
});

// Static method to find token by unhashed token
refreshTokenSchema.statics.findByToken = function (token) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return this.findOne({ token: tokenHash });
};

// Instance method to check if token is expired
refreshTokenSchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

// Instance method to revoke token
refreshTokenSchema.methods.revoke = async function () {
  this.isActive = false;
  await this.save();
};

// Static method to cleanup expired tokens
refreshTokenSchema.statics.cleanupExpiredTokens = async function () {
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false }
    ]
  });
  return result.deletedCount;
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
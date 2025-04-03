import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, // Required for email/password signup
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: '',
  },
  timezone: {
    type: String,
    default: 'America/New_York',
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system',
  },
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  pushNotifications: {
    type: Boolean,
    default: true,
  },
  biometricLogin: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  authMethods: [{
    provider: {
      type: String,
      enum: ['email', 'google', 'apple', 'facebook', 'twitter'],
      required: true
    },
    providerId: String,
    lastUsed: Date
  }],
  preferences: {
    colorScheme: {
      type: String,
      default: 'default'
    },
    reminderTiming: {
      type: Number, // minutes before deadline
      default: 30
    },
    weeklyDigest: {
      type: Boolean,
      default: true
    },
    dailyGoalNotifications: {
      type: Boolean,
      default: true
    }
  },
  deviceTokens: [{
    token: String,
    platform: {
      type: String,
      enum: ['ios', 'android', 'web']
    },
    lastActive: Date
  }],
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// Middleware to update lastActive
userSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to check if user has a specific auth method
userSchema.methods.hasAuthMethod = function(provider: string) {
  return this.authMethods.some((method: { provider: string }) => method.provider === provider);
};

// Method to add a new auth method
userSchema.methods.addAuthMethod = function(provider: string, providerId: string) {
  if (!this.hasAuthMethod(provider)) {
    this.authMethods.push({
      provider,
      providerId,
      lastUsed: new Date()
    });
  }
};

// Method to update device token
userSchema.methods.updateDeviceToken = function(token: string, platform: string) {
  const existingToken = this.deviceTokens.find((t: { token: string }) => t.token === token);
  if (existingToken) {
    existingToken.lastActive = new Date();
  } else {
    this.deviceTokens.push({
      token,
      platform,
      lastActive: new Date()
    });
  }
};

// Check if the model exists before creating it
const User = mongoose.models?.User || mongoose.model('User', userSchema);

export { User }; 
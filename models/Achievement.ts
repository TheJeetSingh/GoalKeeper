import mongoose, { Types } from 'mongoose';

export interface IAchievement {
  userId: Types.ObjectId;
  type: 'streak' | 'milestone' | 'completion' | 'social' | 'special';
  title: string;
  description: string;
  icon: string;
  level: number;
  points: number;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  completedAt?: Date;
  metadata?: {
    goalId?: Types.ObjectId;
    commitmentId?: Types.ObjectId;
    streakDays?: number;
    milestoneCount?: number;
  };
  requirements: {
    type: string;
    value: number;
    comparison: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
  }[];
  rewards?: {
    type: 'points' | 'badge' | 'level' | 'special';
    value: number | string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new mongoose.Schema<IAchievement>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['streak', 'milestone', 'completion', 'social', 'special'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  maxProgress: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  metadata: {
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
    commitmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commitment' },
    streakDays: Number,
    milestoneCount: Number
  },
  requirements: [{
    type: { type: String, required: true },
    value: { type: Number, required: true },
    comparison: {
      type: String,
      enum: ['gt', 'gte', 'lt', 'lte', 'eq'],
      required: true
    }
  }],
  rewards: [{
    type: {
      type: String,
      enum: ['points', 'badge', 'level', 'special'],
      required: true
    },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps on save
achievementSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to update progress
achievementSchema.methods.updateProgress = async function(value: number) {
  this.progress = Math.min(value, this.maxProgress);
  
  if (this.progress >= this.maxProgress && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
    
    // Create notification for achievement completion
    const { Notification } = require('./Notification');
    await Notification.createAchievementNotification(
      this.userId,
      this._id,
      `Achievement Unlocked: ${this.title}`,
      this.description
    );
  }
  
  await this.save();
};

// Method to check if requirements are met
achievementSchema.methods.checkRequirements = function(stats: Record<string, number>): boolean {
  return this.requirements.every(req => {
    const value = stats[req.type];
    if (value === undefined) return false;
    
    switch (req.comparison) {
      case 'gt': return value > req.value;
      case 'gte': return value >= req.value;
      case 'lt': return value < req.value;
      case 'lte': return value <= req.value;
      case 'eq': return value === req.value;
      default: return false;
    }
  });
};

// Static method to create a streak achievement
achievementSchema.statics.createStreakAchievement = async function(
  userId: Types.ObjectId,
  streakDays: number
) {
  const title = `${streakDays} Day Streak`;
  const points = streakDays * 10;
  
  return this.create({
    userId,
    type: 'streak',
    title,
    description: `Maintain a streak of ${streakDays} days`,
    icon: '🔥',
    points,
    maxProgress: streakDays,
    requirements: [{
      type: 'streak',
      value: streakDays,
      comparison: 'gte'
    }],
    rewards: [{
      type: 'points',
      value: points
    }, {
      type: 'badge',
      value: `streak-${streakDays}`
    }],
    metadata: {
      streakDays
    }
  });
};

// Static method to create a milestone achievement
achievementSchema.statics.createMilestoneAchievement = async function(
  userId: Types.ObjectId,
  goalId: Types.ObjectId,
  milestoneCount: number
) {
  const title = `${milestoneCount} Milestones Completed`;
  const points = milestoneCount * 20;
  
  return this.create({
    userId,
    type: 'milestone',
    title,
    description: `Complete ${milestoneCount} milestones`,
    icon: '🎯',
    points,
    maxProgress: milestoneCount,
    requirements: [{
      type: 'milestones',
      value: milestoneCount,
      comparison: 'gte'
    }],
    rewards: [{
      type: 'points',
      value: points
    }, {
      type: 'badge',
      value: `milestone-master-${milestoneCount}`
    }],
    metadata: {
      goalId,
      milestoneCount
    }
  });
};

const Achievement = mongoose.models?.Achievement || mongoose.model<IAchievement>('Achievement', achievementSchema);

export { Achievement }; 
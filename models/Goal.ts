import mongoose, { Types } from 'mongoose';

export interface IMilestone {
  title: string;
  description?: string;
  targetDate?: Date;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface IGoal {
  userId: Types.ObjectId;
  title: string;
  description: string;
  category: string;
  targetDate?: Date;
  milestones: IMilestone[];
  progress: number;
  isCompleted: boolean;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high';
  visibility: 'private' | 'public' | 'shared';
  sharedWith: Types.ObjectId[];
  tags: string[];
  metrics?: {
    type: string;
    target: number;
    current: number;
    unit: string;
  };
  parentGoal?: Types.ObjectId;
  subGoals: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const milestoneSchema = new mongoose.Schema<IMilestone>({
  title: { type: String, required: true },
  description: String,
  targetDate: Date,
  isCompleted: { type: Boolean, default: false },
  completedAt: Date
});

const goalSchema = new mongoose.Schema<IGoal>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  targetDate: Date,
  milestones: [milestoneSchema],
  progress: { type: Number, default: 0, min: 0, max: 100 },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  visibility: {
    type: String,
    enum: ['private', 'public', 'shared'],
    default: 'private'
  },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [String],
  metrics: {
    type: { type: String },
    target: Number,
    current: Number,
    unit: String
  },
  parentGoal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  subGoals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps on save
goalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate progress based on milestones and subgoals
goalSchema.methods.calculateProgress = async function() {
  let progress = 0;
  
  // Calculate progress from milestones
  if (this.milestones.length > 0) {
    const completedMilestones = this.milestones.filter(m => m.isCompleted).length;
    progress = (completedMilestones / this.milestones.length) * 100;
  }

  // Calculate progress from subgoals if they exist
  if (this.subGoals.length > 0) {
    const subGoals = await mongoose.model('Goal').find({
      _id: { $in: this.subGoals }
    });
    
    const subGoalProgress = subGoals.reduce((acc, goal) => acc + goal.progress, 0);
    progress = (progress + (subGoalProgress / subGoals.length)) / 2;
  }

  // Calculate progress from metrics if they exist
  if (this.metrics && this.metrics.target > 0) {
    const metricProgress = (this.metrics.current / this.metrics.target) * 100;
    progress = (progress + metricProgress) / 2;
  }

  this.progress = Math.min(Math.round(progress), 100);
  await this.save();
};

// Virtual for time remaining
goalSchema.virtual('timeRemaining').get(function() {
  if (!this.targetDate) return null;
  return this.targetDate.getTime() - Date.now();
});

// Virtual for status
goalSchema.virtual('status').get(function() {
  if (this.isCompleted) return 'completed';
  if (!this.targetDate) return 'in-progress';
  return Date.now() > this.targetDate.getTime() ? 'overdue' : 'on-track';
});

const Goal = mongoose.models?.Goal || mongoose.model<IGoal>('Goal', goalSchema);

export { Goal }; 
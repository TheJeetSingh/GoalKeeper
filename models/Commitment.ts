import mongoose, { Types } from 'mongoose';

export interface IReminder {
  type: 'push' | 'email' | 'in-app';
  time: Date;
  sent: boolean;
  sentAt?: Date;
}

export interface ICommitment {
  userId: Types.ObjectId;
  goalId: Types.ObjectId;
  title: string;
  description?: string;
  startDate: Date;
  dueDate: Date;
  isCompleted: boolean;
  completedAt?: Date;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number; // e.g., every 2 days
    daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
    endDate?: Date;
    count?: number; // number of occurrences
  };
  reminders: IReminder[];
  priority: 'low' | 'medium' | 'high';
  timeEstimate?: number; // in minutes
  timeSpent?: number; // in minutes
  subCommitments: Types.ObjectId[];
  parentCommitment?: Types.ObjectId;
  tags: string[];
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
  notes: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

const reminderSchema = new mongoose.Schema<IReminder>({
  type: {
    type: String,
    enum: ['push', 'email', 'in-app'],
    required: true
  },
  time: { type: Date, required: true },
  sent: { type: Boolean, default: false },
  sentAt: Date
});

const commitmentSchema = new mongoose.Schema<ICommitment>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  recurrence: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom']
    },
    interval: Number,
    daysOfWeek: [Number],
    endDate: Date,
    count: Number
  },
  reminders: [reminderSchema],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  timeEstimate: Number,
  timeSpent: Number,
  subCommitments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commitment' }],
  parentCommitment: { type: mongoose.Schema.Types.ObjectId, ref: 'Commitment' },
  tags: [String],
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'overdue'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps on save
commitmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Update status based on dates and completion
  if (this.isCompleted) {
    this.status = 'completed';
  } else if (Date.now() > this.dueDate.getTime()) {
    this.status = 'overdue';
  } else if (Date.now() >= this.startDate.getTime()) {
    this.status = 'in-progress';
  } else {
    this.status = 'pending';
  }
  
  next();
});

// Method to add a reminder
commitmentSchema.methods.addReminder = function(type: 'push' | 'email' | 'in-app', time: Date) {
  this.reminders.push({
    type,
    time,
    sent: false
  });
};

// Method to mark a reminder as sent
commitmentSchema.methods.markReminderSent = function(reminderId: Types.ObjectId) {
  const reminder = this.reminders.id(reminderId);
  if (reminder) {
    reminder.sent = true;
    reminder.sentAt = new Date();
  }
};

// Virtual for time remaining
commitmentSchema.virtual('timeRemaining').get(function() {
  return this.dueDate.getTime() - Date.now();
});

// Virtual for progress (based on subcommitments if they exist)
commitmentSchema.virtual('progress').get(async function() {
  if (this.isCompleted) return 100;
  if (!this.subCommitments.length) return 0;
  
  const subCommitments = await mongoose.model('Commitment').find({
    _id: { $in: this.subCommitments }
  });
  
  const completed = subCommitments.filter(c => c.isCompleted).length;
  return Math.round((completed / subCommitments.length) * 100);
});

// Method to generate next occurrence based on recurrence pattern
commitmentSchema.methods.generateNextOccurrence = function() {
  if (!this.recurrence) return null;

  const nextDate = new Date(this.dueDate);
  
  switch (this.recurrence.frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + this.recurrence.interval);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (this.recurrence.interval * 7));
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + this.recurrence.interval);
      break;
    case 'custom':
      if (this.recurrence.daysOfWeek && this.recurrence.daysOfWeek.length) {
        // Find next occurrence based on days of week
        let found = false;
        while (!found) {
          nextDate.setDate(nextDate.getDate() + 1);
          if (this.recurrence.daysOfWeek.includes(nextDate.getDay())) {
            found = true;
          }
        }
      }
      break;
  }

  // Check if we've reached the end of the recurrence
  if (this.recurrence.endDate && nextDate > this.recurrence.endDate) {
    return null;
  }
  if (this.recurrence.count !== undefined && this.recurrence.count <= 1) {
    return null;
  }

  return nextDate;
};

const Commitment = mongoose.models?.Commitment || mongoose.model<ICommitment>('Commitment', commitmentSchema);

export { Commitment }; 
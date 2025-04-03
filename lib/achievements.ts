import { Types } from 'mongoose';
import { Achievement } from '@/models/Achievement';
import { Goal } from '@/models/Goal';
import { Commitment } from '@/models/Commitment';
import { User } from '@/models/User';
import { Notification } from '@/models/Notification';

class AchievementService {
  // Check and award streak achievements
  async checkStreakAchievements(userId: Types.ObjectId, currentStreak: number) {
    const streakMilestones = [7, 30, 60, 90, 180, 365]; // Days
    
    for (const days of streakMilestones) {
      if (currentStreak >= days) {
        const existingAchievement = await Achievement.findOne({
          userId,
          type: 'streak',
          'metadata.streakDays': days,
          isCompleted: true
        });

        if (!existingAchievement) {
          await Achievement.createStreakAchievement(userId, days);
        }
      }
    }
  }

  // Check and award milestone achievements
  async checkMilestoneAchievements(userId: Types.ObjectId, goalId: Types.ObjectId) {
    const goal = await Goal.findById(goalId);
    if (!goal) return;

    const completedMilestones = goal.milestones.filter(m => m.isCompleted).length;
    const milestoneMilestones = [5, 10, 25, 50, 100]; // Number of milestones

    for (const count of milestoneMilestones) {
      if (completedMilestones >= count) {
        const existingAchievement = await Achievement.findOne({
          userId,
          type: 'milestone',
          'metadata.milestoneCount': count,
          isCompleted: true
        });

        if (!existingAchievement) {
          await Achievement.createMilestoneAchievement(userId, goalId, count);
        }
      }
    }
  }

  // Check and award completion achievements
  async checkCompletionAchievements(userId: Types.ObjectId) {
    const completedGoals = await Goal.countDocuments({ userId, isCompleted: true });
    const completedCommitments = await Commitment.countDocuments({ userId, isCompleted: true });

    const stats = {
      goals: completedGoals,
      commitments: completedCommitments
    };

    const achievements = await Achievement.find({
      userId,
      type: 'completion',
      isCompleted: false
    });

    for (const achievement of achievements) {
      if (achievement.checkRequirements(stats)) {
        await achievement.updateProgress(achievement.maxProgress);
      }
    }
  }

  // Create initial achievements for a new user
  async createInitialAchievements(userId: Types.ObjectId) {
    const achievements = [
      {
        type: 'completion',
        title: 'Getting Started',
        description: 'Complete your first goal',
        icon: '🎯',
        points: 100,
        maxProgress: 1,
        requirements: [{
          type: 'goals',
          value: 1,
          comparison: 'gte'
        }]
      },
      {
        type: 'completion',
        title: 'Commitment Master',
        description: 'Complete 50 commitments',
        icon: '✅',
        points: 500,
        maxProgress: 50,
        requirements: [{
          type: 'commitments',
          value: 50,
          comparison: 'gte'
        }]
      },
      {
        type: 'social',
        title: 'Team Player',
        description: 'Share a goal with another user',
        icon: '👥',
        points: 200,
        maxProgress: 1,
        requirements: [{
          type: 'shared_goals',
          value: 1,
          comparison: 'gte'
        }]
      }
    ];

    for (const achievement of achievements) {
      await Achievement.create({
        userId,
        ...achievement
      });
    }
  }

  // Update user level based on points
  async updateUserLevel(userId: Types.ObjectId) {
    const achievements = await Achievement.find({ userId, isCompleted: true });
    const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
    
    // Calculate level (example: every 1000 points = 1 level)
    const newLevel = Math.floor(totalPoints / 1000) + 1;
    
    const user = await User.findById(userId);
    if (user && (!user.level || user.level < newLevel)) {
      await User.findByIdAndUpdate(userId, {
        $set: { level: newLevel },
        $inc: { totalPoints: totalPoints }
      });

      // Create level up notification
      await Notification.create({
        userId,
        type: 'achievement',
        title: 'Level Up!',
        message: `Congratulations! You've reached level ${newLevel}!`,
        priority: 'high',
        actionRequired: false
      });
    }
  }

  // Get user achievements summary
  async getAchievementsSummary(userId: Types.ObjectId) {
    const achievements = await Achievement.find({ userId });
    const completed = achievements.filter(a => a.isCompleted);
    const inProgress = achievements.filter(a => !a.isCompleted);
    const totalPoints = completed.reduce((sum, achievement) => sum + achievement.points, 0);

    const user = await User.findById(userId);
    const level = user?.level || 1;
    const nextLevelPoints = level * 1000;
    const pointsToNextLevel = nextLevelPoints - totalPoints;

    return {
      totalAchievements: achievements.length,
      completedAchievements: completed.length,
      inProgressAchievements: inProgress.length,
      totalPoints,
      level,
      nextLevelPoints,
      pointsToNextLevel,
      recentAchievements: completed.slice(0, 5)
    };
  }
}

export const achievementService = new AchievementService(); 
import { Types } from 'mongoose';
import { Notification } from '@/models/Notification';
import { User } from '@/models/User';
import { Goal } from '@/models/Goal';
import { Commitment } from '@/models/Commitment';

class NotificationService {
  // Create a reminder notification
  async createReminder(
    userId: Types.ObjectId,
    type: 'goal' | 'commitment',
    targetId: Types.ObjectId,
    title: string,
    message: string,
    dueDate: Date
  ) {
    const notification = await Notification.create({
      userId,
      type: 'reminder',
      title,
      message,
      priority: 'medium',
      actionRequired: true,
      action: {
        type: 'view',
        targetId,
        targetType: type
      },
      metadata: {
        [type === 'goal' ? 'goalId' : 'commitmentId']: targetId,
        dueDate
      }
    });

    // Send push notification if enabled
    const user = await User.findById(userId);
    if (user?.pushNotifications && user.deviceTokens.length > 0) {
      await this.sendPushNotification(user.deviceTokens, {
        title,
        body: message,
        data: {
          type: 'reminder',
          targetType: type,
          targetId: targetId.toString()
        }
      });
    }

    return notification;
  }

  // Send push notification
  private async sendPushNotification(
    deviceTokens: { token: string; platform: string }[],
    notification: {
      title: string;
      body: string;
      data?: Record<string, string>;
    }
  ) {
    // Implementation depends on the push notification service (e.g., Firebase Cloud Messaging)
    // This is a placeholder for the actual implementation
    console.log('Sending push notification:', {
      tokens: deviceTokens.map(t => t.token),
      notification
    });
  }

  // Create a goal progress notification
  async createGoalProgressNotification(userId: Types.ObjectId, goalId: Types.ObjectId, progress: number) {
    const goal = await Goal.findById(goalId);
    if (!goal) return;

    const milestones = [25, 50, 75, 100];
    const currentMilestone = milestones.find(m => progress >= m && (!goal.metadata?.lastProgressNotification || goal.metadata.lastProgressNotification < m));

    if (currentMilestone) {
      const notification = await Notification.create({
        userId,
        type: 'goal',
        title: `${currentMilestone}% Progress on "${goal.title}"`,
        message: `You've reached ${currentMilestone}% completion of your goal!`,
        priority: 'medium',
        actionRequired: false,
        action: {
          type: 'view',
          targetId: goalId,
          targetType: 'goal'
        },
        metadata: {
          goalId,
          progress
        }
      });

      // Update goal's last progress notification
      await Goal.findByIdAndUpdate(goalId, {
        $set: {
          'metadata.lastProgressNotification': currentMilestone
        }
      });

      return notification;
    }
  }

  // Create a commitment due soon notification
  async createCommitmentDueNotification(userId: Types.ObjectId, commitmentId: Types.ObjectId) {
    const commitment = await Commitment.findById(commitmentId);
    if (!commitment || commitment.isCompleted) return;

    const now = new Date();
    const timeUntilDue = commitment.dueDate.getTime() - now.getTime();
    const hoursUntilDue = timeUntilDue / (1000 * 60 * 60);

    // Notify at 24 hours, 12 hours, and 1 hour before due
    const notificationThresholds = [24, 12, 1];
    const currentThreshold = notificationThresholds.find(t => 
      hoursUntilDue <= t && 
      (!commitment.metadata?.lastDueNotification || commitment.metadata.lastDueNotification > t)
    );

    if (currentThreshold) {
      const notification = await Notification.create({
        userId,
        type: 'commitment',
        title: `Commitment Due Soon: "${commitment.title}"`,
        message: `Your commitment is due in ${currentThreshold} hour${currentThreshold === 1 ? '' : 's'}!`,
        priority: currentThreshold === 1 ? 'high' : 'medium',
        actionRequired: true,
        action: {
          type: 'complete',
          targetId: commitmentId,
          targetType: 'commitment'
        },
        metadata: {
          commitmentId,
          dueDate: commitment.dueDate
        }
      });

      // Update commitment's last due notification
      await Commitment.findByIdAndUpdate(commitmentId, {
        $set: {
          'metadata.lastDueNotification': currentThreshold
        }
      });

      return notification;
    }
  }

  // Get user's unread notifications
  async getUnreadNotifications(userId: Types.ObjectId) {
    return Notification.find({
      userId,
      read: false
    }).sort({ createdAt: -1 });
  }

  // Mark notifications as read
  async markAsRead(userId: Types.ObjectId, notificationIds: Types.ObjectId[]) {
    await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        userId
      },
      {
        $set: {
          read: true,
          readAt: new Date()
        }
      }
    );
  }

  // Delete old notifications
  async deleteOldNotifications(userId: Types.ObjectId, daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await Notification.deleteMany({
      userId,
      createdAt: { $lt: cutoffDate }
    });
  }

  // Get notification statistics
  async getNotificationStats(userId: Types.ObjectId) {
    const [total, unread, highPriority] = await Promise.all([
      Notification.countDocuments({ userId }),
      Notification.countDocuments({ userId, read: false }),
      Notification.countDocuments({ userId, read: false, priority: 'high' })
    ]);

    return {
      total,
      unread,
      highPriority,
      hasUrgentNotifications: highPriority > 0
    };
  }
}

export const notificationService = new NotificationService(); 
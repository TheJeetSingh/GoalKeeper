import { Types } from 'mongoose';
import { User } from '@/models/User';
import { Goal } from '@/models/Goal';
import { Notification } from '@/models/Notification';

interface ShareGoalOptions {
  goalId: Types.ObjectId;
  sharedByUserId: Types.ObjectId;
  sharedWithUserIds: Types.ObjectId[];
  message?: string;
}

interface CommentOptions {
  goalId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  parentCommentId?: Types.ObjectId;
}

class SocialService {
  // Share a goal with other users
  async shareGoal({ goalId, sharedByUserId, sharedWithUserIds, message }: ShareGoalOptions) {
    const goal = await Goal.findById(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    if (goal.userId.toString() !== sharedByUserId.toString() && !goal.sharedWith.includes(sharedByUserId)) {
      throw new Error('Not authorized to share this goal');
    }

    // Update goal visibility and shared users
    await Goal.findByIdAndUpdate(goalId, {
      $set: { visibility: 'shared' },
      $addToSet: { sharedWith: { $each: sharedWithUserIds } }
    });

    // Get sharer's name
    const sharedByUser = await User.findById(sharedByUserId);
    if (!sharedByUser) {
      throw new Error('Sharing user not found');
    }

    // Create notifications for shared users
    const notifications = await Promise.all(
      sharedWithUserIds.map(userId =>
        Notification.create({
          userId,
          type: 'social',
          title: 'Goal Shared with You',
          message: message || `${sharedByUser.name} shared a goal with you: ${goal.title}`,
          priority: 'medium',
          actionRequired: true,
          action: {
            type: 'view',
            targetId: goalId,
            targetType: 'goal'
          },
          metadata: {
            goalId
          }
        })
      )
    );

    return {
      goal,
      notifications
    };
  }

  // Get shared goals for a user
  async getSharedGoals(userId: Types.ObjectId) {
    return Goal.find({
      $or: [
        { userId },
        { sharedWith: userId }
      ],
      visibility: 'shared'
    }).populate('userId', 'name avatar');
  }

  // Add a comment to a goal
  async addComment({ goalId, userId, content, parentCommentId }: CommentOptions) {
    const goal = await Goal.findById(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    if (goal.visibility === 'private' && goal.userId.toString() !== userId.toString()) {
      throw new Error('Not authorized to comment on this goal');
    }

    const comment = {
      userId,
      content,
      parentCommentId,
      createdAt: new Date()
    };

    await Goal.findByIdAndUpdate(goalId, {
      $push: { comments: comment }
    });

    // Notify goal owner and other participants of the new comment
    if (goal.userId.toString() !== userId.toString()) {
      await Notification.create({
        userId: goal.userId,
        type: 'social',
        title: 'New Comment on Your Goal',
        message: `Someone commented on your goal: ${goal.title}`,
        priority: 'low',
        actionRequired: false,
        action: {
          type: 'view',
          targetId: goalId,
          targetType: 'goal'
        },
        metadata: {
          goalId
        }
      });
    }

    // Notify other participants
    const otherParticipants = goal.sharedWith.filter(
      id => id.toString() !== userId.toString() && id.toString() !== goal.userId.toString()
    );

    if (otherParticipants.length > 0) {
      await Promise.all(
        otherParticipants.map(participantId =>
          Notification.create({
            userId: participantId,
            type: 'social',
            title: 'New Comment on Shared Goal',
            message: `New comment on a shared goal: ${goal.title}`,
            priority: 'low',
            actionRequired: false,
            action: {
              type: 'view',
              targetId: goalId,
              targetType: 'goal'
            },
            metadata: {
              goalId
            }
          })
        )
      );
    }

    return comment;
  }

  // Get comments for a goal
  async getComments(goalId: Types.ObjectId) {
    const goal = await Goal.findById(goalId).populate('comments.userId', 'name avatar');
    return goal?.comments || [];
  }

  // React to a goal (like, celebrate, etc.)
  async reactToGoal(goalId: Types.ObjectId, userId: Types.ObjectId, reaction: string) {
    const goal = await Goal.findById(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    if (goal.visibility === 'private' && goal.userId.toString() !== userId.toString()) {
      throw new Error('Not authorized to react to this goal');
    }

    const reactionData = {
      userId,
      type: reaction,
      createdAt: new Date()
    };

    await Goal.findByIdAndUpdate(goalId, {
      $push: { reactions: reactionData }
    });

    // Notify goal owner of the reaction
    if (goal.userId.toString() !== userId.toString()) {
      const reactor = await User.findById(userId);
      await Notification.create({
        userId: goal.userId,
        type: 'social',
        title: 'New Reaction on Your Goal',
        message: `${reactor?.name} reacted to your goal: ${goal.title}`,
        priority: 'low',
        actionRequired: false,
        action: {
          type: 'view',
          targetId: goalId,
          targetType: 'goal'
        },
        metadata: {
          goalId
        }
      });
    }

    return reactionData;
  }

  // Get social feed for a user
  async getSocialFeed(userId: Types.ObjectId) {
    const goals = await Goal.find({
      $or: [
        { userId },
        { sharedWith: userId },
        { visibility: 'public' }
      ]
    })
      .sort({ updatedAt: -1 })
      .populate('userId', 'name avatar')
      .populate('comments.userId', 'name avatar')
      .populate('reactions.userId', 'name avatar');

    return goals.map(goal => ({
      ...goal.toObject(),
      isOwner: goal.userId.toString() === userId.toString(),
      isShared: goal.sharedWith.some(id => id.toString() === userId.toString())
    }));
  }
}

export const socialService = new SocialService(); 
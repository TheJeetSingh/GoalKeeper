import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import { Commitment } from '@/models/Commitment';
import { Goal } from '@/models/Goal';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const commitment = await Commitment.findOne({ _id: params.id, userId })
      .populate('goal');

    if (!commitment) {
      return NextResponse.json(
        { error: 'Commitment not found' },
        { status: 404 }
      );
    }

    const { title, description, dueDate, completed } = await request.json();

    commitment.title = title;
    commitment.description = description;
    commitment.dueDate = dueDate ? new Date(dueDate) : commitment.dueDate;
    commitment.completed = completed;

    await commitment.save();

    // Update goal progress if completion status changed
    if (completed !== commitment.completed) {
      const allCommitments = await Commitment.find({ goalId: commitment.goalId });
      const totalCommitments = allCommitments.length;
      const completedCommitments = allCommitments.filter(c => c.completed).length;
      const progress = Math.round((completedCommitments / totalCommitments) * 100);

      await Goal.findByIdAndUpdate(commitment.goalId, { progress });
    }

    return NextResponse.json(commitment);
  } catch (error) {
    console.error('Update commitment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const commitment = await Commitment.findOne({ _id: params.id, userId })
      .populate('goal');

    if (!commitment) {
      return NextResponse.json(
        { error: 'Commitment not found' },
        { status: 404 }
      );
    }

    // Delete the commitment
    await Commitment.findByIdAndDelete(params.id);

    // Update goal progress
    const allCommitments = await Commitment.find({ goalId: commitment.goalId });
    const totalCommitments = allCommitments.length;
    
    if (totalCommitments > 0) {
      const completedCommitments = allCommitments.filter(c => c.completed).length;
      const progress = Math.round((completedCommitments / totalCommitments) * 100);

      await Goal.findByIdAndUpdate(commitment.goalId, { progress });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete commitment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
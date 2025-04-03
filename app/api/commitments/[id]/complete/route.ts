import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import { Commitment } from '@/models/Commitment';
import { Goal } from '@/models/Goal';

export async function POST(
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

    // Update commitment status
    commitment.completed = true;
    await commitment.save();

    // Update goal progress
    const allCommitments = await Commitment.find({ goalId: commitment.goalId });
    const totalCommitments = allCommitments.length;
    const completedCommitments = allCommitments.filter(c => c.completed).length;
    const progress = Math.round((completedCommitments / totalCommitments) * 100);

    await Goal.findByIdAndUpdate(commitment.goalId, { progress });

    return NextResponse.json(commitment);
  } catch (error) {
    console.error('Complete commitment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
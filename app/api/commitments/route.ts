import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import { Commitment } from '@/models/Commitment';
import { Goal } from '@/models/Goal';

export async function GET() {
  try {
    await connectDB();
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const commitments = await Commitment.find()
      .populate('goalId', 'title')
      .sort({ createdAt: -1 });
    return NextResponse.json(commitments);
  } catch (error) {
    console.error('Get commitments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { goalId, title, description, dueDate } = await request.json();

    if (!goalId || !title) {
      return NextResponse.json(
        { error: 'Goal ID and title are required' },
        { status: 400 }
      );
    }

    // Check if goal exists and belongs to user
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    const commitment = await Commitment.create({
      goalId,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    return NextResponse.json(commitment);
  } catch (error) {
    console.error('Create commitment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
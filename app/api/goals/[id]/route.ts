import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import { Goal } from '@/models/Goal';
import { Commitment } from '@/models/Commitment';

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

    const goal = await Goal.findOne({ _id: params.id, userId });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    const { title, description, category, dueDate, status } = await request.json();

    goal.title = title;
    goal.description = description;
    goal.category = category;
    goal.dueDate = dueDate ? new Date(dueDate) : null;
    goal.status = status;

    await goal.save();

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Update goal error:', error);
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

    const goal = await Goal.findOne({ _id: params.id, userId });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Delete all commitments associated with the goal
    await Commitment.deleteMany({ goalId: params.id });

    // Delete the goal
    await Goal.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete goal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
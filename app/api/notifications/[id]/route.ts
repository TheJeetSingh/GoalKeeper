import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';

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

    const notification = await Notification.findOne({ _id: params.id, userId });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    await Notification.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
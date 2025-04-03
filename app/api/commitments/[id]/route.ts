import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const commitment = await prisma.commitment.findFirst({
      where: { id: params.id, userId },
      include: { goal: true },
    });

    if (!commitment) {
      return NextResponse.json(
        { error: 'Commitment not found' },
        { status: 404 }
      );
    }

    const { title, description, dueDate, completed } = await request.json();

    const updatedCommitment = await prisma.commitment.update({
      where: { id: params.id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : commitment.dueDate,
        completed,
      },
      include: { goal: true },
    });

    // Update goal progress if completion status changed
    if (completed !== commitment.completed) {
      const allCommitments = await prisma.commitment.findMany({
        where: { goalId: commitment.goalId },
      });

      const totalCommitments = allCommitments.length;
      const completedCommitments = allCommitments.filter((c: { completed: boolean }) => c.completed).length;
      const progress = Math.round((completedCommitments / totalCommitments) * 100);

      await prisma.goal.update({
        where: { id: commitment.goalId },
        data: { progress },
      });
    }

    return NextResponse.json(updatedCommitment);
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
    const headersList = headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const commitment = await prisma.commitment.findFirst({
      where: { id: params.id, userId },
      include: { goal: true },
    });

    if (!commitment) {
      return NextResponse.json(
        { error: 'Commitment not found' },
        { status: 404 }
      );
    }

    // Delete the commitment
    await prisma.commitment.delete({
      where: { id: params.id },
    });

    // Update goal progress
    const allCommitments = await prisma.commitment.findMany({
      where: { goalId: commitment.goalId },
    });

    const totalCommitments = allCommitments.length;
    if (totalCommitments > 0) {
      const completedCommitments = allCommitments.filter((c: { completed: boolean }) => c.completed).length;
      const progress = Math.round((completedCommitments / totalCommitments) * 100);

      await prisma.goal.update({
        where: { id: commitment.goalId },
        data: { progress },
      });
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
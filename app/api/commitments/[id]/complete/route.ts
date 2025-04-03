import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(
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

    // Update commitment status
    const updatedCommitment = await prisma.commitment.update({
      where: { id: params.id },
      data: { completed: true },
      include: { goal: true },
    });

    // Update goal progress
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

    return NextResponse.json(updatedCommitment);
  } catch (error) {
    console.error('Complete commitment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
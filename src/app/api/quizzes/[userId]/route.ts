import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Quiz from '@/models/Quiz';

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;

  try {
    await connectToDatabase();

    const quizzes = await Quiz.find({ 'creator._id': userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Quiz from '@/models/Quiz';

type Params = {
  params: {
    userId: string;
  };
};

export async function GET(request: NextRequest, { params }: Params) {
  const { userId } = params;

  try {
    await connectToDatabase();

    const quizzes = await Quiz.find({ "creator._id": userId }).sort({
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

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Quiz from '@/models/Quiz';

// Define valid parameters to satisfy TypeScript
type RouteParams = {
  params: {
    userId: string;
  };
};

// Use the correct route handler signature
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { userId } = params;

  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch quizzes created by the user
    const quizzes = await Quiz.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    // Return the quizzes as a JSON response
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}
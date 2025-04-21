import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Quiz from '@/models/Quiz';

// Export a route handler using the syntax for Next.js 13+
export async function GET (req: Request)  {
  try {
    const userId = req.url.split('/').pop();
    
    // Connect to the database
    await connectToDatabase();

    // Fetch quizzes created by the user
    const quizzes = await Quiz.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    if (!quizzes) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Return the quizzes as a JSON response
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes', msg: error },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
// import { verifyAuth } from '@/lib/auth-middleware';

// Export a route handler using the syntax for Next.js 13+
export async function GET(req: Request) {
  try {
    // // Verify authentication
    // const authResult = await verifyAuth();
    // if (authResult.error || !authResult.decoded) {
    //   return NextResponse.json(
    //     { error: authResult.message || 'Unauthorized' },
    //     { status: authResult.status || 401 }
    //   );
    // }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();

    // Find a single quiz by ID
    const quiz = await Quiz.findById(id);
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    if(quiz.isDeleted == true){
      return NextResponse.json({
        message: "QUIZ DELETED"
      });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz', msg: error },
      { status: 500 }
    );
  }
}
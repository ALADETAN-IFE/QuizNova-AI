import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
// import mongoose from 'mongoose';

export async function GET (req: Request)  {
  try {
    const id = req.url.split('/').pop();
    await connectToDatabase();

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return NextResponse.json(
    //     { error: 'Invalid quiz ID format' },
    //     { status: 400 }
    //   );
    // }

    const quiz = await Quiz.findById(id);
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
} 
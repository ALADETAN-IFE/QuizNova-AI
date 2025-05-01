import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import mongoose from 'mongoose';
import { verifyAuth } from '@/lib/auth-middleware';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export async function POST(req: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth();
    if (authResult.error || !authResult.decoded) {
      return NextResponse.json(
        { error: authResult.message || 'Unauthorized' },
        { status: authResult.status || 401 }
      );
    }

    // Connect to database
    await connectToDatabase();
    const body = await req.json();

    // Validate required fields
    const missingFields = [];
    if (!body.title) missingFields.push('title');
    if (!body.description) missingFields.push('description');
    if (!body.difficulty) missingFields.push('difficulty');
    if (!body.questions) missingFields.push('questions');
    if (!body.createdBy) missingFields.push('createdBy');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate questions array
    if (!Array.isArray(body.questions) || body.questions.length === 0) {
      return NextResponse.json(
        { error: 'Questions must be a non-empty array' },
        { status: 400 }
      );
    }

    // // Convert createdBy to ObjectId
    // const createdById = new mongoose.Types.ObjectId(body.createdBy);
    // Use authenticated user's ID
    const createdById = new mongoose.Types.ObjectId(authResult.decoded.id);

    // Create quiz with validated data
    const quiz = await Quiz.create({
      title: body.title,
      description: body.description,
      difficulty: body.difficulty,
      questions: body.questions.map((q: Question) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
      createdBy: createdById,
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);

    // Handle specific error types
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }

    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { error: 'Invalid ID format', details: error.message },
        { status: 400 }
      );
    }

    // Handle connection errors
    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      return NextResponse.json(
        { error: 'Database connection error', details: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create quiz', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Verify authentication
    const authResult = await verifyAuth();
    if (authResult.error || !authResult.decoded) {
      return NextResponse.json(
        { error: authResult.message || 'Unauthorized' },
        { status: authResult.status || 401 }
      );
    }

    await connectToDatabase();
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes', details: (error as Error).message },
      { status: 500 }
    );
  }
} 
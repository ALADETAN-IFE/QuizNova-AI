import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Result from '@/models/Result';
import Quiz from '@/models/Quiz';
import mongoose from 'mongoose';
import { verifyAuth } from "@/lib/auth-middleware";

interface Answers {
  question: string;
  correctAnswer: string;
  selectedAnswer?: string;
  questionType?: 'obj' | 'subjective' | 'theory';
  isCorrect?: boolean;
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

  // Verify authentication
    const authResult = await verifyAuth();
    if (authResult.error || !authResult.decoded) {
      return NextResponse.json(
        { error: authResult.message || "Unauthorized" },
        { status: authResult.status || 401 }
      );
    }

    // Validate required fields
    const missingFields = [];
    if (!body.quiz) missingFields.push('quiz');
    if (!body.user) missingFields.push('user');
    if (!body.score) missingFields.push('score');
    if (!body.answers) missingFields.push('answers');
    if (!body.totalQuestions) missingFields.push('totalQuestions');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

      // Validate answers
      const invalidAnswers = body.answers.filter((answer: Answers) => {
        return !answer.question || !answer.selectedAnswer || !answer.correctAnswer;
      });
  
      if (invalidAnswers.length > 0) {
        return NextResponse.json(
          { error: 'Invalid answer data', details: invalidAnswers },
          { status: 400 }
        );
      }

    // Convert IDs to ObjectId
    const quizId = new mongoose.Types.ObjectId(body.quiz);
    const userId = new mongoose.Types.ObjectId(body.user);

    // Create result with validated data
    const result = await Result.create({
      quiz: quizId,
      user: userId,
      score: body.score,
      totalQuestions: body.totalQuestions,
      answers: body.answers || [],
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    
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

    return NextResponse.json(
      { error: 'Failed to save quiz result', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
      // Verify authentication
        const authResult = await verifyAuth();
        if (authResult.error || !authResult.decoded) {
          return NextResponse.json(
            { error: authResult.message || "Unauthorized" },
            { status: authResult.status || 401 }
          );
        }
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Ensure Quiz model is registered
    if (!mongoose.models.Quiz) {
      mongoose.model('Quiz', Quiz.schema);
    }

    // Verify quiz result ownership
    if (userId !== authResult.decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized - You can only get your own quiz results",
          msg : `userID: ${userId} and authResult.decoded.userId: ${authResult.decoded.userId} are not the same`
         },
        { status: 403 }
      );
    }

    const results = await Result.find({ user: userId })
      .populate('quiz')
      .sort({ createdAt: -1 });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results', details: (error as Error).message },
      { status: 500 }
    );
  }
} 
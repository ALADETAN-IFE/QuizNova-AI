import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Quiz from '@/models/Quiz';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const quiz = await Quiz.create({
      title: body.title,
      description: body.description,
      difficulty: body.difficulty,
      questions: body.questions,
      createdBy: body.createdBy,
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
} 
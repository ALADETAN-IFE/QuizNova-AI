import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import { verifyAuth } from "@/lib/auth-middleware";

// Export a route handler using the syntax for Next.js 13+
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

    const userId = req.url.split("/").pop();

    // Connect to the database
    await connectToDatabase();

    // Verify quiz ownership
    if (userId !== authResult.decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized - You can only access your own quizzes" },
        { status: 403 }
      );
    }

    // Fetch quizzes created by the user
    const quizzes = await Quiz.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    if (!quizzes) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Return the quizzes as a JSON response
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes", msg: error },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import Quiz from '@/models/Quiz';
// // import mongoose from 'mongoose';

// export async function GET (req: Request)  {
//   try {
//     const id = req.url.split('/').pop();
//     await connectToDatabase();

//     // if (!mongoose.Types.ObjectId.isValid(id)) {
//     //   return NextResponse.json(
//     //     { error: 'Invalid quiz ID format' },
//     //     { status: 400 }
//     //   );
//     // }

//     const quiz = await Quiz.findById(id);

//     // if (!quiz) {
//     //   return NextResponse.json(
//     //     { error: 'Quiz not found' },
//     //     { status: 404 }
//     //   );
//     // }

//     return NextResponse.json(quiz);
//   } catch (error) {
//     console.error('Error fetching quiz:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch quiz' },
//       { status: 500 }
//     );
//   }
// }

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

    // // Verify quiz ownership
    // if (userId !== authResult.decoded.userId) {
    //   return NextResponse.json(
    //     { error: "Unauthorized - You can only access your own quizzes" },
    //     { status: 403 }
    //   );
    // }

    // Fetch quizzes created by the user and filtering out the soft deleted ones
    const quizzes = await Quiz.find({ createdBy: userId, isDeleted: false }).sort({
      createdAt: -1,
    });


    if (!quizzes) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Return the quizzes as a JSON response
    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes", msg: error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth();
    if (authResult.error || !authResult.decoded) {
      return NextResponse.json(
        { error: authResult.message || "Unauthorized" },
        { status: authResult.status || 401 }
      );
    }

    const quizId = req.url.split("/").pop();

    // Connect to database
    await connectToDatabase();

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Verify quiz ownership
    if (quiz.createdBy.toString() !== authResult.decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized - You can only delete your own quizzes" },
        { status: 403 }
      );
    }

    // Delete the quiz
    // await Quiz.findByIdAndDelete(quizId);
    
    // Delete the quiz using soft delete
    await Quiz.findByIdAndUpdate(quizId, { isDeleted: true });


    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}

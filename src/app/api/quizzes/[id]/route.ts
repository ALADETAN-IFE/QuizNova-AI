import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import { verifyAuth } from "@/lib/auth-middleware";

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
    await Quiz.findByIdAndDelete(quizId);

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

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import Result from "@/models/Result";

export const config = {
  runtime: 'nodejs',
  schedule: '0 0 * * *', // Runs every day at midnight UTC (Vercel standard cron expression)
};

export async function GET() {
  try {
    await connectToDatabase();

    const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Find old soft-deleted quizzes
    const oldDeletedQuizzes = await Quiz.find({
      isDeleted: true,
      updatedAt: { $lt: THIRTY_DAYS_AGO },
    });

    if (oldDeletedQuizzes.length === 0) {
      return NextResponse.json({ message: "No old deleted quizzes found." });
    }

    const quizIds = oldDeletedQuizzes.map(q => q._id);

    // Delete related results
    await Result.deleteMany({ quizId: { $in: quizIds } });

    // Fully delete the quizzes
    await Quiz.deleteMany({ _id: { $in: quizIds } });

    return NextResponse.json({
      message: `Purged ${oldDeletedQuizzes.length} quizzes and their results.`,
    });
  } catch (error) {
    console.error("Cron purge error:", error);
    return NextResponse.json({ error: "Failed to purge old quizzes." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Update the user
    if (body.paymentStaus == "success") {
      const updatedUser = await User.findByIdAndUpdate(
        body.id,
        { plan: "premium" },
        { new: true, select: "plan" }
      );

      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(
        { user: updatedUser, mesage: "user has been upgraded successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error upgrading user:", error);
    return NextResponse.json(
      { error: "Failed to upgrade user", details: (error as Error).message },
      { status: 500 }
    );
  }
}

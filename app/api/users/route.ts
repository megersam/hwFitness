 
import connectDB from "@/lib/db";
import User from "@/Models/userModel";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connectDB();

 

// GET API to fetch all plans
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Fetch all plans sorted by createdAt in descending order
    const users = await User.find().sort({ createdAt: -1 });

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No plans found." }, { status: 404 });
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

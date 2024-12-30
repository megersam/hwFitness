import connectDB from "@/lib/db";
import PlanModel from "@/Models/planModel"; 
import { NextResponse } from "next/server";

// Connect to the database
connectDB();

export async function GET(): Promise<NextResponse> {
  try {
    // Fetch all plans with status: true
    const activePlans = await PlanModel.find({ status: true });

    // Return the active plans
    return NextResponse.json({
      message: "Plan with status true fetched successfully",
      prices: activePlans,
    });
  } catch (error) {
    console.error("Error fetching plans with status true:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

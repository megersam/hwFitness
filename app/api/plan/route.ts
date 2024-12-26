import connectDB from "@/lib/db";
import PlanModel from "@/Models/planModel";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connectDB();

// POST API to create a new plan
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const { planName, period, discount, percentage, price, total } = await req.json();

    // Validate required fields
    if (!planName || !period) {
      return NextResponse.json(
        { error: "Both planName and period are required." },
        { status: 400 }
      );
    }

    // Check for existing plan with the same planName and period
    const existingPlan = await PlanModel.findOne({ planName, period, price });
    if (existingPlan) {
      return NextResponse.json(
        { error: "A plan with the same planName, period and price already exists." },
        { status: 400 }
      );
    }

    // Create and save the new plan
    const newPlan = new PlanModel({
      planName,
      period,
      discount,
      percentage,
      price,
      total,
     
    });
    await newPlan.save();

    return NextResponse.json({
      message: "Plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}

// GET API to fetch all plans
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Fetch all plans sorted by createdAt in descending order
    const plans = await PlanModel.find().sort({ createdAt: -1 });

    if (!plans || plans.length === 0) {
      return NextResponse.json({ error: "No plans found." }, { status: 404 });
    }

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

import connectDB from "@/lib/db";
import PriceModel from "@/Models/priceModel";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import PlanModel from "@/Models/planModel";

// Connect to the database
connectDB();

  

// Connect to the database
connectDB();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const { id } = await params;// Destructure `id` from `params` synchronously

    // Validate the ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    // Parse the request body
    const { planName, period, discount, percentage, total, status } = await req.json();

    // Update the plan
    const updatedPlan = await PlanModel.findByIdAndUpdate(
      new ObjectId(id),
      {
        ...(planName && { planName }),
        ...(period && { period }),
        ...(discount !== undefined && { discount }),
        ...(percentage !== undefined && { percentage }),
        ...(total && { total }),
        ...(status && { status }),
        updatedAt: new Date(),
      },
      { new: true } // Return the updated document
    );

    if (!updatedPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Plan updated successfully", plan: updatedPlan });
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}



// Delete a plan by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    const deletedPlan = await PlanModel.findByIdAndDelete(new ObjectId(id));

    if (!deletedPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Plan deleted successfully", plan: deletedPlan });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}

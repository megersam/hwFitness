import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/Models/userModel';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await context.params;
  const { id } = params;

  await connectDB();

  const body = await req.json();
  
  console.log("Received data:", body);  // Log incoming data

  try {
    const updatedPlan = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedPlan) {
      console.error("Plan not found with ID:", id);  // Log if the user was not found
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPlan);
  } catch (error:any) {
    console.error("Error updating user:", error);  // Log the actual error
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}


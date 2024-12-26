import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PlanModel from '@/Models/planModel';

export async function PUT(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> } // Params is now a Promise
): Promise<NextResponse> {
  const params = await context.params; // Await the params
  const { id } = params;

  await connectDB();

  const body = await req.json(); // Parse the request body

  try {
    const updatedPlan = await PlanModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true } // Return the updated document
    );

    if (!updatedPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPlan);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

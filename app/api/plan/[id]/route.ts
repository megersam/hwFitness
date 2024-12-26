import { NextResponse } from 'next/server'; 
import connectDB from '@/lib/db';
import PlanModel from '@/Models/planModel';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, context: RouteContext): Promise<NextResponse> {
  const { id } = context.params;
  await connectDB();

  const body = await request.json(); // Parse the request body

  const updatedPlan = await PlanModel.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true } // Return the updated document
  );

  if (!updatedPlan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  return NextResponse.json(updatedPlan);
}
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db'; 
import CustomerModel from '@/Models/customerModel';

export async function PUT(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> } // Params is now a Promise
): Promise<NextResponse> {
  const params = await context.params; // Await the params
  const { id } = params;

  await connectDB();

  const body = await req.json(); // Parse the request body

  try {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true } // Return the updated document
    );

    if (!updatedCustomer) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> } // Params is now a Promise
): Promise<NextResponse> {
  const params = await context.params; // Await the params
  const { id } = params;

  await connectDB();

  try {
    // Find the customer by ID
    const customer = await CustomerModel.findById(id);

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
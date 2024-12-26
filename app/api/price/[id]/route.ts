import connectDB from "@/lib/db";
import PriceModel from "@/Models/priceModel";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Connect to the database
connectDB();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    // Await the params object to properly access the id
    const { id } = await params;

    const { price, status } = await req.json(); // Get price and status from the request body

    // Ensure the id is valid
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
    }

    // Find and update the price by ID
    const updatedPrice = await PriceModel.findByIdAndUpdate(
      new ObjectId(id), // Convert id to ObjectId
      { price, status, updatedAt: new Date() }, // Updated data
      { new: true } // Return the updated document
    );

    if (!updatedPrice) {
      return NextResponse.json({ error: "Price not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Price updated successfully", price: updatedPrice });
  } catch (error) {
    console.error("Error updating price:", error);
    return NextResponse.json({ error: "Failed to update price" }, { status: 500 });
  }
}

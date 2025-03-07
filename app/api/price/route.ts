import connectDB from "@/lib/db";
import PriceModel from "@/Models/priceModel";
import { NextRequest, NextResponse } from "next/server"; // Importing necessary types for Next.js API routes

// Connect to the database
connectDB();

// Define the POST function with proper typing
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const { price } = await req.json();

    // Check if the price already exists
    const existingPrice = await PriceModel.findOne({ price: price });
    if (existingPrice) {
      return NextResponse.json(
        { error: 'Price already exists' },
        { status: 400 }
      );
    }

    // Create and save the new price
    const newPrice = new PriceModel({ price });
    await newPrice.save();
    return NextResponse.json({
      message: 'Price created successfully',
      price: price,
    });
  } catch (error) {
    console.error('Error creating price:', error);
    return NextResponse.json(
      { error: 'Failed to create price' },
      { status: 500 }
    );
  }
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Get all prices from the database
    const prices = await PriceModel.find()
    .sort({ createdAt: -1 });

    if (!prices) {
      return NextResponse.json({ error: 'No prices found' }, { status: 404 });
    }

    return NextResponse.json({ prices });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}

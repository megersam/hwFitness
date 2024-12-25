import connectDB from "@/lib/db";
import PriceModel from "@/Models/priceModel";
import { NextResponse } from "next/server";

// Connect to the database
connectDB();

export async function GET(): Promise<NextResponse> {
  try {
    // Fetch all prices with status: true
    const activePrices = await PriceModel.find({ status: true });

    // Return the active prices
    return NextResponse.json({
      message: "Prices with status true fetched successfully",
      prices: activePrices,
    });
  } catch (error) {
    console.error("Error fetching prices with status true:", error);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}

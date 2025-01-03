import connectDB from "@/lib/db"; 
import SubscriptionModel from "@/Models/subscriptionModel";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connectDB();


export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const subscriptions = await SubscriptionModel.find()
     

    return NextResponse.json({ subscriptions });
  } catch (error:any) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions", details: error.message },
      { status: 500 }
    );
  }
}

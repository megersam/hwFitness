import connectDB from "@/lib/db";
import CustomerModel from "@/Models/customerModel";
import SubscriptionHistoryModel from "@/Models/subscriptionHistory";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connectDB();

// POST API to create a new customer 

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      gender,
      selectedPlan,
      selectedPlanPeriod,
      paymentMethod,
      paymentStatus,
      bankAccount,
      total,
      image,
      nextPaymentDate,
    } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !phoneNumber) {
      return NextResponse.json(
        { error: "First name, last name, and phone number are required." },
        { status: 400 }
      );
    }

    // Check for existing customer with the same phoneNumber
    const existingCustomer = await CustomerModel.findOne({ phoneNumber });
    if (existingCustomer) {
      return NextResponse.json(
        { error: "A customer with the same phone number already exists." },
        { status: 400 }
      );
    }

    // Create and save the new customer
    const newCustomer = new CustomerModel({
      firstName,
      middleName,
      lastName,
      phoneNumber,
      gender,
      selectedPlan,
      selectedPlanPeriod,
      paymentMethod,
      paymentStatus,
      bankAccount,
      total,
      image, // Cloudinary image URL
      nextPaymentDate,
    });

    const savedCustomer = await newCustomer.save();

    // Create and save the subscription history
    const subscriptionHistory = new SubscriptionHistoryModel({
      customerId: savedCustomer._id, // Map the customer ID
      selectedPlan,
      selectedPlanPeriod,
      startDate: new Date(),
      nextPaymentDate,
      paymentMethod,
      paymentStatus,
      total,
    });

    await subscriptionHistory.save();

    return NextResponse.json({
      message: "Customer and subscription history added successfully!",
      customer: savedCustomer,
      subscriptionHistory,
    });
  } catch (error) {
    console.error("Error creating customer and subscription history:", error);
    return NextResponse.json(
      { error: "Failed to add customer and subscription history" },
      { status: 500 }
    );
  }
}



// GET API to fetch all customers
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Fetch all customers sorted by createdAt in descending order
    const customers = await CustomerModel.find().sort({ createdAt: -1 });

    if (!customers || customers.length === 0) {
      return NextResponse.json({ error: "No customer found." }, { status: 404 });
    }

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
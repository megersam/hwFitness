import connectDB from "@/lib/db";
import CustomerModel from "@/Models/customerModel";
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
      paymentMethod,
      paymentStatus,
      bankAccount,
      total,
      image, // Cloudinary image URL
      nextPaymentDate,
    });

    await newCustomer.save();

    return NextResponse.json({
      message: "Customer added successfully!",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to add customer" },
      { status: 500 }
    );
  }
}

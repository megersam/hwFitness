import connectDB from "@/lib/db";
import CustomerModel from "@/Models/customerModel"; 
import SubscriptionModel from "@/Models/subscriptionModel";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connectDB();

// POST API to create a new customer 
 
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse the incoming JSON request body
    const {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      gender,
      image,
      selectedPlanName,
      selectedPlanPeriod,
      selectedPlanPrice, // Ensure this field is passed correctly
      paymentStatus,
      endDate,
    } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !phoneNumber) {
      return NextResponse.json(
        { error: "First name, last name, and phone number are required." },
        { status: 400 }
      );
    }

    // Check if a customer with the same phone number already exists
    const existingCustomer = await CustomerModel.findOne({ phoneNumber });
    if (existingCustomer) {
      return NextResponse.json(
        { error: "A customer with the same phone number already exists." },
        { status: 400 }
      );
    }

    // Create a new customer
    const newCustomer = new CustomerModel({
      firstName,
      middleName,
      lastName,
      phoneNumber,
      gender,
      image,
    });

    const savedCustomer = await newCustomer.save();

    // Step 2: Create a subscription for the customer
    const subscription = await SubscriptionModel.create({
      customerId: savedCustomer._id,
      selectedPlanName,
      selectedPlanPeriod,
      selectedPlanPrice, // Ensure the correct price is used
      paymentStatus,
      startDate: new Date(),
      endDate,  // Use the provided endDate from the frontend
    });

    await subscription.save();

    // Respond with success message
    return NextResponse.json({
      message: "Customer and subscription history added successfully!",
      customer: savedCustomer,
      subscription,
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

    // Current date for determining active subscriptions
    const currentDate = new Date();

    // Map customers with their corresponding subscriptions
    const customersWithSubscriptions = await Promise.all(
      customers.map(async (customer) => {
        // Fetch active subscription
        const activeSubscription = await SubscriptionModel.findOne({
          customerId: customer._id,
          startDate: { $lte: currentDate },
          endDate: { $gte: currentDate },
        });

        // Fetch subscription history (sorted by startDate descending)
        const subscriptionHistory = await SubscriptionModel.find({
          customerId: customer._id,
        }).sort({ startDate: -1 });

        return {
          ...customer.toObject(), // Convert the customer document to plain object
          activeSubscription,
          subscriptionHistory,
        };
      })
    );

    return NextResponse.json({ customers: customersWithSubscriptions });
  } catch (error) {
    console.error("Error fetching customers with subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers and subscriptions" },
      { status: 500 }
    );
  }
}
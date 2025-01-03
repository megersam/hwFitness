import connectDB from "@/lib/db"; 
import CustomerModel from "@/Models/customerModel";
import SubscriptionModel from "@/Models/subscriptionModel";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connectDB();


 
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Fetch all subscriptions
    const subscriptions = await SubscriptionModel.find();

    // Get today's date
    const today = new Date();

    // Fetch customer details for each subscription by customerId
    const subscriptionsWithCustomerData = await Promise.all(subscriptions.map(async (sub) => {
      const customer = await CustomerModel.findById(sub.customerId)
        .select("image firstName middleName lastName phoneNumber"); // Fetch specific customer fields

      // Classify the subscription based on the date
      const startDate = new Date(sub.startDate);
      const endDate = new Date(sub.endDate);

      const isCurrentPlan = startDate <= today && today <= endDate; // Current plan condition
      const isRecentPlan = startDate <= today && today > endDate;  // Recent plan condition

      return {
        ...sub.toObject(), // Spread subscription data
        customer, // Add the customer data to the subscription
        isCurrentPlan, // Flag for current plan
        isRecentPlan,  // Flag for recent plan
      };
    }));

    // Group subscriptions by customerId
    const groupedSubscriptions = subscriptionsWithCustomerData.reduce((acc, sub) => {
      // Check if the customer already exists in the accumulator
      const customerId = sub.customer._id.toString();
      if (!acc[customerId]) {
        // If customer doesn't exist, initialize a new entry for the customer
        acc[customerId] = {
          customer: sub.customer, // Add customer data
          currentPlans: [], // Initialize an empty array for current plans
          recentPlans: [],  // Initialize an empty array for recent plans
        };
      }

      // Push the subscription to either currentPlans or recentPlans
      if (sub.isCurrentPlan) {
        acc[customerId].currentPlans.push({
          _id: sub._id,
          selectedPlanName: sub.selectedPlanName,
          selectedPlanPeriod: sub.selectedPlanPeriod,
          selectedPlanPrice: sub.selectedPlanPrice,
          startDate: sub.startDate,
          endDate: sub.endDate,
          paymentStatus: sub.paymentStatus,
          createdAt: sub.createdAt,
          updatedAt: sub.updatedAt,
        });
      }

      if (sub.isRecentPlan) {
        acc[customerId].recentPlans.push({
          _id: sub._id,
          selectedPlanName: sub.selectedPlanName,
          selectedPlanPeriod: sub.selectedPlanPeriod,
          selectedPlanPrice: sub.selectedPlanPrice,
          startDate: sub.startDate,
          endDate: sub.endDate,
          paymentStatus: sub.paymentStatus,
          createdAt: sub.createdAt,
          updatedAt: sub.updatedAt,
        });
      }

      return acc;
    }, {});

    // Convert the grouped subscriptions object to an array
    const result = Object.values(groupedSubscriptions);

    return NextResponse.json({ customers: result });
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions", details: error.message },
      { status: 500 }
    );
  }
}




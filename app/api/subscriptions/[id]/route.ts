import connectDB from "@/lib/db";
import CustomerModel from "@/Models/customerModel";
import SubscriptionModel from "@/Models/subscriptionModel";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connectDB();

export async function GET(
  req: NextRequest,
  context: { params:Promise<{ id: string }>}
): Promise<NextResponse> {
  const params = await context.params;
  const { id: customerId } = params;

  try {
    // Validate the customer exists
    const customer = await CustomerModel.findById(customerId).select(
      "image firstName middleName lastName phoneNumber"
    );
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Fetch subscriptions for the given customer ID
    const subscriptions = await SubscriptionModel.find({ customerId });

    // Get today's date
    const today = new Date();

    // Process the subscriptions to classify as currentPlan or recentPlan
    const currentPlans: any[] = [];
    const recentPlans: any[] = [];

    subscriptions.forEach((sub) => {
      const startDate = new Date(sub.startDate);
      const endDate = new Date(sub.endDate);

      const subscriptionData = {
        _id: sub._id,
        selectedPlanName: sub.selectedPlanName,
        selectedPlanPeriod: sub.selectedPlanPeriod,
        selectedPlanPrice: sub.selectedPlanPrice,
        startDate: sub.startDate,
        endDate: sub.endDate,
        paymentStatus: sub.paymentStatus,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
      };

      if (startDate <= today && today <= endDate) {
        // Active plan
        currentPlans.push(subscriptionData);
      } else if (startDate <= today && today > endDate) {
        // Recent plan
        recentPlans.push(subscriptionData);
      }
    });

    // Structure the response
    const result = {
      customer,
      currentPlans,
      recentPlans,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions", details: error.message },
      { status: 500 }
    );
  }
}

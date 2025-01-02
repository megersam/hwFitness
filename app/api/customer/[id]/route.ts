import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db'; 
import CustomerModel from '@/Models/customerModel';
import SubscriptionModel from '@/Models/subscriptionModel';


export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await context.params;
  const { id } = params;

  await connectDB();

  try {
    // Fetch customer details
    const customer = await CustomerModel.findById(id);

    if (!customer) {
      return new NextResponse(
        `<html><body><h1>Customer Not Found</h1></body></html>`,
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Current date to determine the active subscription
    const currentDate = new Date();

    // Fetch the active subscription for the customer
    const activeSubscription = await SubscriptionModel.findOne({
      customerId: id,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).populate('selectedPlan', 'total'); 

    console.log(activeSubscription);
    // Prepare the subscription details
    const subscriptionDetails = activeSubscription
      ? `
        <p><strong>Subscription Plan:</strong> ${activeSubscription.planName}</p>
        <p><strong>Start Date:</strong> ${activeSubscription.startDate.toDateString()}</p>
        <p><strong>End Date:</strong> ${activeSubscription.endDate.toDateString()}</p>
        <p><strong>Status:</strong> Active</p>
      `
      : `<p>No active subscription</p>`;

    // Build the HTML response
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Customer Details</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          img { border-radius: 50%; width: 100px; height: 100px; }
          .customer-details { margin-top: 20px; }
          .subscription-details { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Customer Details</h1>
        <img src="${customer.image}" alt="Customer Image" />
        <div class="customer-details">
          <p><strong>Name:</strong> ${customer.firstName} ${customer.middleName || ''} ${customer.lastName}</p>
          <p><strong>Phone:</strong> ${customer.phoneNumber}</p>
          <p><strong>Gender:</strong> ${customer.gender}</p>
        </div>
        <h2>Subscription Details</h2>
        <div class="subscription-details">
          ${subscriptionDetails}
        </div>
      </body>
      </html>
    `;

    return new NextResponse(htmlContent, { headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    return new NextResponse(
      `<html><body><h1>Internal Server Error</h1></body></html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}




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


 
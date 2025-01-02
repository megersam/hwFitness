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
    });

    console.log(activeSubscription);
    // Prepare the subscription details
    const subscriptionDetails = activeSubscription
      ? `
         
        <p><strong>Start Date:</strong> ${activeSubscription.startDate.toDateString()}</p>
        <p><strong>End Date:</strong> ${activeSubscription.endDate.toDateString()}</p>
        <p><strong>Status:</strong> Active</p>
      `
      : `<p>No active subscription</p>`;

    // Build the HTML response
    const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Details</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap">
    <style>
      body {
        font-family: 'Roboto', Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
      }
      .card {
        background-color: #ffffff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        padding: 20px;
        margin: 20px 0;
        width: 100%;
        max-width: 600px;
      }
      .profile-card {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .profile-card img {
        border-radius: 50%;
        width: 100px;
        height: 100px;
      }
      .profile-card h2 {
        margin: 0;
        color: #333;
        font-weight: 700;
      }
      .underline {
        border-bottom: 2px solid #007BFF;
        display: inline-block;
        margin-bottom: 10px;
        padding-bottom: 5px;
      }
      p {
        margin: 10px 0;
        color: #555;
      }
      .subscription-card h3 {
        margin-top: 0;
        color: #007BFF;
      }
    </style>
  </head>
  <body>
    <div class="card profile-card">
      <img src="${customer.image}" alt="Customer Image">
      <div>
        <h2>${customer.firstName} ${customer.middleName || ''} ${customer.lastName}</h2>
        <p><strong>Phone:</strong> ${customer.phoneNumber}</p>
        <p><strong>Gender:</strong> ${customer.gender}</p>
      </div>
    </div>
    <div class="card subscription-card">
      <h3 class="underline">Subscription Details</h3>
      ${activeSubscription
        ? `
        <p><strong>Start Date:</strong> ${activeSubscription.startDate.toDateString()}</p>
        <p><strong>End Date:</strong> ${activeSubscription.endDate.toDateString()}</p>
        <p><strong>Status:</strong> Active</p>`
        : `<p>No active subscription</p>`}
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


 
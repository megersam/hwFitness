import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db'; 
import CustomerModel from '@/Models/customerModel';

export async function GET(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await context.params; 
  const { id } = params;

  await connectDB();

  try {
    const customer = await CustomerModel.findById(id);

    if (!customer) {
      return new NextResponse(
        `<html><body><h1>Customer Not Found</h1></body></html>`, 
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Customer Details</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          img { border-radius: 50%; width: 100px; height: 100px; }
          .customer-details { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Customer Details</h1>
        <img src="${customer.image}" alt="Customer Image" />
        <div class="customer-details">
          <p><strong>Name:</strong> ${customer.firstName} ${customer.middleName} ${customer.lastName}</p>
          <p><strong>Phone:</strong> ${customer.phoneNumber}</p>
          <p><strong>Gender:</strong> ${customer.gender}</p>
          <p><strong>Plan:</strong> ${customer.selectedPlan}</p>
          <p><strong>Payment Status:</strong> ${customer.paymentStatus}</p>
          <p><strong>Next Payment Date:</strong> ${customer.nextPaymentDate}</p>
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

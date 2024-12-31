// Example of CustomerPage.jsx or CustomerPage.tsx in your React or Next.js app

import React, { useEffect, useState } from 'react';

interface CustomerData {
  image?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  selectedPlan: string;
  selectedPlanPeriod: number;
  nextPaymentDate: string;
  paymentMethod: string;
  paymentStatus: string;
  total: string;
}

const CustomerPage = ({ customerId }: { customerId: string }) => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  useEffect(() => {
    // Fetch customer data using the customer ID
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`https://hw-fitness.vercel.app/api/customer/${customerId}`);
        if (response.ok) {
          const data = await response.json();
          setCustomerData(data);
        } else {
          console.error('Failed to fetch customer data');
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  if (!customerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <img
        src={customerData.image || '/logo.png'} // Display customer image or fallback to a default image
        alt={`${customerData.firstName} ${customerData.lastName}`}
        className="w-24 h-24 rounded-full mx-auto"
      />
      <h2 className="text-xl font-bold text-center mt-4">{`${customerData.firstName} ${customerData.lastName}`}</h2>
      <p className="text-gray-600 text-center">{customerData.phoneNumber}</p>
      <p className="text-gray-600 mt-2">
        Plan: {customerData.selectedPlan} ({customerData.selectedPlanPeriod} months)
      </p>
      <p className="text-gray-600 mt-2">Next Payment Date: {customerData.nextPaymentDate}</p>
      <p className="text-gray-600 mt-2">Payment Method: {customerData.paymentMethod}</p>
      <p className="text-gray-600 mt-2">Payment Status: {customerData.paymentStatus}</p>
      <p className="text-gray-600 mt-2">Total: {customerData.total}</p>
    </div>
  );
};

export default CustomerPage;

'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // useParams helps to get dynamic params from the URL

// Customer type definition for fetching the customer data
interface Customer {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  selectedPlan: string;
  selectedPlanPeriod: string;
  nextPaymentDate: string;
  paymentMethod: string;
  paymentStatus: string;
  total: string;
  image: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

const ViewCustomerData: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>(); // Extract customer ID from the URL
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch customer data by ID
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`/api/customer/${customerId}`); // API endpoint to fetch customer by ID
        if (response.ok) {
          const data = await response.json();
          setCustomer(data); // Store fetched customer data in state
        } else {
          throw new Error('Customer not found');
        }
      } catch (error) {
        console.error(error);
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Customer Details</h1>
      <div className="mt-4 flex gap-6">
        <img
          src={customer.image}
          alt="Customer"
          className="w-32 h-32 rounded-full border"
        />
        <div>
          <p className="font-bold">Name:</p>
          <p>{customer.firstName} {customer.middleName} {customer.lastName}</p>

          <p className="font-bold">Phone:</p>
          <p>{customer.phoneNumber}</p>

          <p className="font-bold">Gender:</p>
          <p>{customer.gender}</p>

          <p className="font-bold">Plan:</p>
          <p>{customer.selectedPlan}</p>

          <p className="font-bold">Payment Status:</p>
          <p>{customer.paymentStatus}</p>

          <p className="font-bold">Next Payment Date:</p>
          <p>{customer.nextPaymentDate}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerData;

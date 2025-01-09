"use client";

import React, { useEffect, useState } from "react";
import { SmallCard } from "./_components/smallCard";
import { PaymentStatus } from "./_components/payment";
import { RecentSales } from "./_components/recentCustomer";

const AdminPage = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  useEffect(() => {
    // Fetch Total Customers
    const fetchTotalCustomers = async () => {
      try {
        const response = await fetch("/api/customer");
        const data = await response.json();
        setTotalCustomers(data?.customers?.length || 0);
      } catch (error) {
        console.error("Error fetching total customers:", error);
      }
    };

    // Fetch Total Paid
    const fetchTotalPaid = async () => {
      try {
        const response = await fetch("/api/subscriptions");
        const data = await response.json();

        if (!data?.customers) {
          console.error("No customer data found");
          return;
        }

        const totalPaidAmount = data.customers.reduce((acc: number, customer: any) => {
          customer.currentPlans.forEach((sub: any) => {
            if (sub.paymentStatus === "Paid") {
              acc += sub.selectedPlanPrice;
            }
          });
          customer.recentPlans.forEach((sub: any) => {
            if (sub.paymentStatus === "Paid") {
              acc += sub.selectedPlanPrice;
            }
          });
          return acc;
        }, 0);

        setTotalPaid(totalPaidAmount || 0);
      } catch (error) {
        console.error("Error fetching total paid:", error);
      }
    };

    // Fetch Inactive Users
    const fetchInactiveUsers = async () => {
      try {
        const response = await fetch("/api/subscriptions");
        const data = await response.json();

        if (data?.customers) {
          const filteredCustomers = data.customers
            .map((item: { customer: any; currentPlans: any[] }) => ({
              ...item.customer,
              currentPlan: item.currentPlans?.[0] || null,
            }))
            .filter((customer: { currentPlan: any }) => !customer.currentPlan);

          setInactiveUsers(filteredCustomers.length);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchTotalCustomers();
    fetchTotalPaid();
    fetchInactiveUsers();
  }, []);

  return (
    <div className="bg-[#1E1E20] text-white min-h-screen p-4">
      <div className="grid grid-cols-1 md:flex md:flex-row md:gap-4 space-y-4 md:space-y-0">
        <div className="md:flex-1">
          <SmallCard title="Total Customers" balance={totalCustomers} iconType="users" />
        </div>
        <div className="md:flex-1">
          <SmallCard title="Total Paid" balance={totalPaid} iconType="wallet" />
        </div>
        <div className="md:flex-1">
          <SmallCard title="Inactive Users" balance={inactiveUsers} iconType="zap" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row h-auto gap-4 py-12">
        <div className="w-full md:w-1/2 bg-[#2A2A2C] p-4 rounded-lg shadow-md">
          <h1 className="text-lg font-semibold">Inactive Subscribers</h1>
          <div className="py-1">
            <RecentSales />
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-[#2A2A2C] p-4 rounded-lg shadow-md">
          <h1 className="text-lg font-semibold">Payment Request</h1>
          <div className="py-1">
            <PaymentStatus />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

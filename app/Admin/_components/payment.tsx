import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Subscription {
  _id: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
}

interface Customer {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  image: string;
  currentPlan: Subscription | null;
}

export function PaymentStatus() {
  const [loading, setLoading] = useState(true);
  const [pendingCustomers, setPendingCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/subscriptions");
        const data = await response.json();

        if (data?.customers) {
          const filteredCustomers = data.customers
            .map(
              (item: { customer: Customer; currentPlans: Subscription[] }) => ({
                ...item.customer,
                currentPlan: item.currentPlans?.[0] || null,
              })
            )
            .filter(
              (customer: { currentPlan: { paymentStatus: string; }; }) =>
                customer.currentPlan && customer.currentPlan.paymentStatus === "Pending"
            ); // Filter customers with a current plan and paymentStatus = "Pending"

          setPendingCustomers(filteredCustomers);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (pendingCustomers.length === 0) {
    return <p>No customers with pending payments found.</p>;
  }

  return (
    <Card className="h-[400px] p-4 overflow-y-auto w-[450px] bg-[#1E1E20] text-white rounded-md border-none">
      {pendingCustomers.map((item, index) => {
        // Extract initials
        const initials = `${item.firstName[0]}${item.lastName[0]}`;

        return (
          <div
            key={index}
            className="flex items-center space-y-4 mb-4 bg-[#1E1E20] p-4 rounded-md"
          >
            {/* Avatar */}
            <Avatar className="h-9 w-9 ml-4">
              <AvatarImage src={item.image} alt={`${item.firstName} ${item.lastName}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {item.firstName} {item.lastName}
              </p>
              <p className="text-sm text-gray-400">{item.phoneNumber}</p>
            </div>

            {/* Payment Status */}
            <div className="ml-auto font-medium text-sm text-yellow-500" style={{ minWidth: "80px", textAlign: "left" }}>
              Pending Payment
            </div>
          </div>
        );
      })}
    </Card>
  );
}

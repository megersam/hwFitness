import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar";
  import { Card } from "@/components/ui/card";
  import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
  import { useEffect, useState } from "react";
  import { toast } from "react-toastify";
  
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
  
  export function ReceptionPaymentStatus() {
    const [loading, setLoading] = useState(true);
    const [pendingCustomers, setPendingCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog visibility state
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
              );
  
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
  
    const handleUpdatePaymentStatus = async () => {
      if (!selectedCustomer || !selectedCustomer.currentPlan) return;
  
      const subscriptionId = selectedCustomer.currentPlan._id;
      console.log("Updating subscription ID:", subscriptionId);
      try {
        const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus,
          }),
        });
  
        if (response.ok) {
          const updatedCustomer = await response.json();
          console.log("Updated Customer:", updatedCustomer);
          toast.success("Payment status updated successfully!");
  
          setIsDialogOpen(false); // Close the dialog
          // Update the UI
          setPendingCustomers((prev) =>
            prev.filter((customer) => customer.currentPlan?._id !== subscriptionId)
          );
          setSelectedCustomer(null);
          
        } else {
          const errorData = await response.json();
          console.error("Failed to update payment status:", errorData.error);
          toast.error("Failed to update payment status. Please try again.");
          setIsDialogOpen(false); // Close the dialog
        }
      } catch (error) {
        console.error("Error updating payment status:", error); 
        toast.error("An error occurred while updating payment status.");
        setIsDialogOpen(false); // Close the dialog
      }
    };
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    if (pendingCustomers.length === 0) {
      return <p>No customers with pending payments found.</p>;
    }
  
    return (
      <Card className="h-[400px] p-4 overflow-y-auto w-[450px] bg-[#1E1E20] text-white rounded-md border-none">
      {pendingCustomers.map((item, index) => {
        const initials = `${item.firstName[0]}${item.lastName[0]}`;

        return (
          <div key={index} className="flex items-center space-y-4 mb-4 bg-[#1E1E20] p-4 rounded-md">
            <Avatar className="h-9 w-9 ml-4">
              <AvatarImage src={item.image} alt={`${item.firstName} ${item.lastName}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {item.firstName} {item.lastName}
              </p>
              <p className="text-sm text-gray-400">{item.phoneNumber}</p>
            </div>

            <div className="ml-auto font-medium text-sm text-yellow-500" style={{ minWidth: "80px", textAlign: "left" }}>
              {item.currentPlan ? item.currentPlan.paymentStatus : "No Plan"}
            </div>
          </div>
        );
      })}
    </Card>
    );
  }
  
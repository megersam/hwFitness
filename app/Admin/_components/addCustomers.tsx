'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

interface AddCompanyProps {
  visible: boolean;
  onClose: () => void;
}
// Define the type of the plan object
interface Plan {
  _id: string;
  planName: string;
  period: number;
  discount: boolean;
  percentage: number;
  total: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
export function AddCustomerDialog({ visible, onClose }: AddCompanyProps) {
  const [plans, setPlans] = useState<Plan[]>([]); // Explicitly define the type
  const [selectedTotal, setSelectedTotal] = useState<string>(""); // Store the selected total

  // Fetch plan prices from API
  const fetchPlanPrices = async () => {
    try {
      const response = await fetch("/api/customer/plan");
      const data = await response.json();
      if (data?.prices) {
        setPlans(data.prices);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };


  useEffect(() => {
    fetchPlanPrices();
  }, []);

  // Handle selection change
  // Handle selection change
  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedPlan = plans.find((plan) => plan._id === selectedId);
    if (selectedPlan) {
      setSelectedTotal(selectedPlan.total.toString()); // Convert number to string for input value
    } else {
      setSelectedTotal(""); // Reset if no plan is selected
    }
  };



  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Customers</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="sm:overflow-visible overflow-y-auto max-h-[70vh] grid gap-4 py-4 px-4 sm:px-0 flex flex-col items-center justify-center">
          {/* Profile Image and Form Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 w-full">
            {/* Profile Picture */}
            <div className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              <img
                src=" "
                alt=" "
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer">
                <span className="text-white text-sm">Change</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 w-full">
              {/* Horizontal Parallel Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="text-center sm:text-left">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    className="w-full"
                  />
                </div>

                {/* Father Name */}
                <div className="text-center sm:text-left">
                  <Label htmlFor="middleName">Father Name</Label>
                  <Input
                    id="middleName"
                    placeholder="Enter your father name"
                    className="w-full"
                  />
                </div>

                {/* Last Name */}
                <div className="text-center sm:text-left">
                  <Label htmlFor="lastName">G. Father Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your grand father name"
                    className="w-full"
                  />
                </div>

                {/* Phone Number */}
                <div className="text-center sm:text-left">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+251-966-916-168"
                    className="w-full"
                  />
                </div>

                {/* Gender */}
                <div className="text-center sm:text-left">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                {/* Selected Plan */}
                <div className="text-center sm:text-left">
                  <Label htmlFor="plan">Selected Plan</Label>
                  <select
                    id="plan"
                    className="w-full border rounded px-2 py-1"
                    onChange={handlePlanChange}
                  >
                    <option value="">Select</option>
                    {plans.map((plan: any) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.planName} -{" "}
                        {plan.planName === "Daily"
                          ? `${plan.period} ${plan.period > 1 ? "days" : "day"}`
                          : `${plan.period} ${plan.period > 1 ? "Months" : "Month"}`}

                      </option>
                    ))}
                  </select>
                </div>

                {/* Total */}
                <div className="text-center sm:text-left mt-4">
                  <Label htmlFor="total">Total</Label>
                  <Input
                    id="total"
                    name="total"
                    placeholder="Total price"
                    value={selectedTotal}
                    readOnly
                    className="w-full"
                  />
                </div>

                {/* Selected Payment */}
                <div className="text-center sm:text-left">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select
                    id="paymentMethod"
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="CBE">CBE</option>
                    <option value="Awash">Awash</option>
                    <option value="Sinqee">Sinqee</option>
                  </select>
                </div>

                {/* Bank Accounts */}
                <div className="text-center sm:text-left">
                  <Label htmlFor="account">Bank Account</Label>
                  <Input
                    id="account"
                    name="account"
                    readOnly
                    className="w-full"
                  />
                </div>

                {/* Payment Status */}
                <div className="text-center sm:text-left">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <select
                    id="paymentStatus"
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    <option value="Paid">Paid</option>
                    <option value="NotPaid">Not Paid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

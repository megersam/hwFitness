'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Download, Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ProfileCard from './profileCard'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { toast } from 'react-toastify'

interface Customer {
    _id: string
}

interface UpdateSubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
}
interface Customer {
    _id: string;
    image: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
}

interface Plan {
    _id: string;
    planName: string;
    period: number;
    price: number;
    total: number;
    selectedPlanName: string;
    selectedPlanPeriod: string;
    selectedPlanPrice: number;
    startDate: string;
    endDate: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
}
interface SubscriptionData {
    customer: Customer;
    currentPlans: Plan[];
    recentPlans: Plan[];
}
const UpdateSubscriptions: React.FC<UpdateSubscriptionDialogProps> = ({ isOpen, onClose, customer }) => {
    const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
    const customerId = customer?._id;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        gender: "",
        paymentMethod: "",
        paymentStatus: "",
        bankAccount: "",
        total: "",
        image: "", // The URL from Cloudinary will be stored here
        nextPaymentDate: null as string | null, // Allow null or string
    });

    const [selectedPlanDetails, setSelectedPlanDetails] = useState({
        planName: '',
        planPeriod: 0,
        planTotal: 0,
    });



    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/subscriptions/${customerId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }

                const data: SubscriptionData = await response.json();
                setSubscriptionData(data);
                console.log(data);
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching subscriptions.");
            } finally {
                setLoading(false);
            }
        };
        const fetchPlanPrices = async () => {
            try {
                const response = await fetch("/api/customer/plan");
                const data = await response.json();
                console.log(data)
                if (data?.prices) {
                    setPlans(data.prices);
                }
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        };

        fetchPlanPrices();
        fetchSubscriptions();
    }, [customerId]);





    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedPlan = plans.find((plan) => plan._id === selectedId);

        if (selectedPlan) {
            setSelectedPlanDetails({
                planName: selectedPlan.planName,
                planPeriod: selectedPlan.period,
                planTotal: selectedPlan.total,
            });

            setFormData({
                ...formData,
                total: selectedPlan.total.toString(),
                nextPaymentDate: calculateNextPaymentDate(selectedPlan),
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const calculateNextPaymentDate = (selectedPlan: Plan | undefined) => {
        if (!selectedPlan) return null;
        const now = new Date();
        if (selectedPlan.planName === "Daily") {
            now.setDate(now.getDate() + selectedPlan.period);
        } else {
            now.setMonth(now.getMonth() + selectedPlan.period);
        }
        return now.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    };

     const handleSubmit = () => {
        setLoading(true);
    
        const payload = {
          ...formData,
            customerId,
          selectedPlanName: selectedPlanDetails.planName,
          selectedPlanPeriod: selectedPlanDetails.planPeriod,
          selectedPlanPrice: selectedPlanDetails.planTotal, // Correctly map to `selectedPlanPrice`
          paymentStatus: formData.paymentStatus,
          endDate: formData.nextPaymentDate,
        };
        console.log("Payload:", payload);
        fetch("/api/subscriptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message) {
              toast.success("Subscription created successfully!");
            //   onCustomerAdded(); // Refresh data
              onClose(); // Close dialog
            } else if (data.error) {
              toast.error(`Error: ${data.error}`);
            }
          })
          .catch((error) => {
            console.error("Error saving Subscription:", error);
            toast.error("Failed to save Subscription. Please try again.");
          })
          .finally(() => setLoading(false));
      };





    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Customer Details</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col sm:flex-row bg-gray-100 mt-1 py-4 px-6 space-y-6 sm:space-y-0 sm:space-x-6">
                    {/* Left Column */}
                    <div className="flex flex-col space-y-6 flex-grow">
                        {/* Profile Card */}
                        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full border border-gray-200">
                            <div className="flex items-start space-x-6">
                                <img
                                    src={customer?.image || "/default-avatar.png"}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border border-gray-300"
                                />
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        {customer?.firstName} {customer?.middleName || ""} {customer?.lastName}
                                    </h2>
                                    <p className="text-gray-600 mt-2">
                                        <strong>Phone:</strong> {customer?.phoneNumber}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Current Subscription Section */}
                        <span className="bg-green-500 text-white text-sm w-48 font-bold px-3 py-1 rounded-md block text-center">
                            Active Plan
                        </span>


                        {subscriptionData?.currentPlans && subscriptionData.currentPlans.length > 0 ? (
                            subscriptionData.currentPlans.map((plan) => (
                                <div
                                    key={plan._id}
                                >
                                    {/* Plan Content */}
                                    <div className="flex flex-col bg-gray-100  px-6 space-y-4">
                                        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full border border-gray-200">
                                            <div className="flex flex-col space-y-2">
                                                <h2 className="text-2xl font-semibold text-gray-800">
                                                    {plan.selectedPlanName} {plan.selectedPlanPeriod}
                                                </h2>
                                                <span className="text-sm text-black-500 font-semibold">
                                                    Price: {plan.selectedPlanPrice}
                                                </span>
                                                <span className="text-sm text-green-500 font-semibold">
                                                    Start Date:{" "}
                                                    {new Date(plan.startDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                    }).replace(/,/, "-")}
                                                </span>
                                                <span className="text-sm text-red-500 font-semibold">
                                                    End Date:{" "}
                                                    {new Date(plan.endDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                    }).replace(/,/, "-")}
                                                </span>
                                                <span className="text-sm text-gray-500 font-semibold">
                                                    Payment: {plan.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ... */}
                                </div>
                            ))
                        ) : (
                            <div className="mt-5 text-center text-gray-700">
                                <p>No active subscription</p>
                            </div>
                        )}

                        {/* Recent Subscription Section */}
                        <span className="bg-red-500 text-white text-sm w-48 font-bold px-3 py-1 rounded-md block text-center">
                            Recent Plan
                        </span>
                        {subscriptionData?.recentPlans && subscriptionData.recentPlans.length > 0 ? (
                            subscriptionData.recentPlans.map((plan) => (
                                <div
                                    key={plan._id}
                                >
                                    {/* Plan Content */}
                                    <div className="flex flex-col bg-gray-100  px-6 space-y-4">
                                        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full border border-gray-200">
                                            <div className="flex flex-col space-y-2">
                                                <h2 className="text-2xl font-semibold text-gray-800">
                                                    {plan.selectedPlanName} {plan.selectedPlanPeriod}
                                                </h2>
                                                <span className="text-sm text-black-500 font-semibold">
                                                    Price: {plan.selectedPlanPrice}
                                                </span>
                                                <span className="text-sm text-green-500 font-semibold">
                                                    Start Date:{" "}
                                                    {new Date(plan.startDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                    }).replace(/,/, "-")}
                                                </span>
                                                <span className="text-sm text-red-500 font-semibold">
                                                    End Date:{" "}
                                                    {new Date(plan.endDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                    }).replace(/,/, "-")}
                                                </span>
                                                <span className="text-sm text-gray-500 font-semibold">
                                                    Payment: {plan.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ... */}
                                </div>
                            ))
                        ) : (
                            <div className="mt-5 text-center text-gray-700">
                                <p>No Recent subscription</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col bg-white shadow-lg rounded-lg p-6 max-w-xs w-full border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">Update Subscriptions</h3>
                        <p className="text-gray-600 mt-2">Here you can add additional subscriptios.</p>
                        {/* Example content */}
                        <div className="mt-4 space-y-4">
                            <div className="text-center sm:text-left">
                                <Label htmlFor="plan">Selected Plan</Label>
                                <select
                                    id="plan"
                                    className="w-full border rounded px-2 py-1"
                                    onChange={handlePlanChange}
                                >
                                    <option value="">Select</option>
                                    {plans.map((plan) => (
                                        <option key={plan._id} value={plan._id}>
                                            {plan.planName} -{" "}
                                            {plan.planName === "Daily"
                                                ? `${plan.period} ${plan.period > 1 ? "days" : "day"}`
                                                : `${plan.period} ${plan.period > 1 ? "Months" : "Month"}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-center sm:text-left">
                                <Label htmlFor="totla">Total</Label>
                                <Input
                                    id="total"
                                    name="total"
                                    placeholder="Total price"
                                    value={formData.total}
                                    readOnly
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="text-center sm:text-left">
                                <Label htmlFor="paymentMethod">Payment Method</Label>
                                <select
                                    id="paymentMethod"
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-2 py-1"
                                >
                                    <option value="">Select</option>
                                    <option value="Cash">Cash</option>
                                    <option value="CBE">CBE</option>
                                    <option value="Awash">Awash</option>
                                    <option value="Sinqee">Sinqee</option>
                                </select>
                            </div>
                            <div className="text-center sm:text-left">
                                <Label htmlFor="paymentStatus">Payment Status</Label>
                                <select
                                    id="paymentStatus"
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-2 py-1"
                                >
                                    <option value="">Select</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Not Paid">Not Paid</option>
                                </select>
                            </div>
                            <Button 
                            onClick={handleSubmit} 
                            className='bg-yellow-500 text-white hover:bg-yellow-600'
                            type="submit">
                                {loading && (
                                    <Loader size="35px" className="animate-spin" />
                                )}
                                {loading ? 'Updating Subscription...' : 'Update Subscription'}
                            </Button>
                        </div>

                    </div>
                </div>

            </DialogContent>
        </Dialog>



    )
}

export default UpdateSubscriptions
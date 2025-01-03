'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Download, Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ProfileCard from './profileCard'
import Image from 'next/image'

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

        fetchSubscriptions();
    }, [customerId]);




    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1000px] max-h-full overflow-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Customer Details</DialogTitle>
                    <p>{customer?._id}</p>
                </DialogHeader>

                <div className="flex flex-col bg-gray-100 py-4 space-y-5">
                    {/* Profile Card */}
                    <div className="bg-white shadow-lg rounded-lg p-5 max-w-lg w-full">
                        <div className="flex items-start space-x-5">
                            <img
                                src={customer?.image || "/default-avatar.png"}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {customer?.firstName} {customer?.middleName || ""} {customer?.lastName}
                                </h2>
                                <p className="text-gray-600">
                                    <strong>Phone:</strong> {customer?.phoneNumber}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Active Plan Card */}
                     
                        <span className="bg-green-500 text-white text-sm w-48 font-bold px-3 py-1 rounded-md block text-center">
                            Active Plan
                        </span>
                   

                    {/* Current Subscriptions */}
                    {subscriptionData?.currentPlans && subscriptionData.currentPlans.length > 0 ? (
                        subscriptionData.currentPlans.map((plan) => (
                            <div
                                key={plan._id}
                                className="flex items-center bg-white shadow-md rounded-lg p-5 max-w-lg w-full"
                            >
                                {/* Icon Section */}
                                <div className="bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-md">
                                    <CalendarIcon size="20px" />
                                </div>

                                {/* Text Section */}
                                <div className="ml-4 flex flex-col space-y-2 flex-grow">
                                    <p className="text-sm font-bold text-gray-700">
                                        {plan.selectedPlanName} ({plan.selectedPlanPeriod})
                                    </p>
                                    <p className="text-sm font-bold text-gray-700">{plan.selectedPlanPrice}</p>
                                    <span
                                        className={`text-sm font-bold px-2 py-1 w-16 rounded ${plan.paymentStatus === "Paid"
                                                ? "bg-green-500 text-white"
                                                : plan.paymentStatus === "Pending"
                                                    ? "bg-yellow-500 text-white"
                                                    : "bg-red-500 text-white"
                                            }`}
                                    >
                                        {plan.paymentStatus}
                                    </span>
                                </div>

                                {/* Date Section */}
                                <div className="ml-auto flex flex-col items-center space-y-2">
                                    <div className="bg-gray-200 rounded-md px-4 py-2">
                                        <p className="text-sm font-semibold text-gray-700">Start Date</p>
                                        <p>
                                            {new Date(plan.startDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            }).replace(/,/, "-")}
                                        </p>
                                    </div>
                                    <div className="bg-gray-200 rounded-md px-4 py-2">
                                        <p className="text-sm font-semibold text-red-500">End Date</p>
                                        <p>
                                            {new Date(plan.endDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            }).replace(/,/, "-")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="mt-5 text-center text-gray-700">
                            <p>No active subscription</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="py-2 px-6 text-sm font-medium text-gray-600 border border-gray-300 rounded-md"
                    >
                        Cancel
                    </Button>
                    <Button type="button" className="relative">
                        Update Subscription
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default UpdateSubscriptions
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
            <DialogContent className="sm:max-w-[1000px] max-h-[100vh] overflow-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Customer Details</DialogTitle>
                    <p>{customer?._id}</p>

                </DialogHeader>

                <div className="flex flex-col items-left bg-gray-100 py-4">
                    <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
                        {/* Profile Page */}
                        <div className="flex items-left space-x-4">
                            <img
                                src={customer?.image || "/default-avatar.png"}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {customer?.firstName} {customer?.middleName || ""}{" "}
                                    {customer?.lastName}
                                </h2>
                                <p className="text-gray-600">
                                    <strong>Phone:</strong> {customer?.phoneNumber}
                                </p>

                            </div>
                        </div>


                    </div>

                     
                    {/* Current Subscriptions */}
                    {subscriptionData?.currentPlans && subscriptionData.currentPlans.length > 0 ? (
                        subscriptionData.currentPlans.map((plan) => (
                            <div
                                key={plan._id}
                                className="flex items-center bg-white mt-10 p-8 rounded-lg shadow-md w-full max-w-lg"
                            >
                                 
                                {/* Icon Section */}
                                <div className="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded-md">
                                    <CalendarIcon size="40px" />
                                </div>

                                {/* Text Section */}
                                <div className="ml-4 flex flex-col space-y-2 flex-grow align-left">
                                    <div className="  rounded-md px-3 py-1">
                                        <p className="text-sm text-gray-700 font-bold">{plan.selectedPlanName}</p>
                                    </div>
                                    <div className=" rounded-md px-3 py-1">
                                        <p className="text-sm text-gray-700 font-bold">{plan.selectedPlanPeriod}</p>
                                    </div>
                                </div>

                                {plan.paymentStatus}

                                {/* Date Section */}
                                <div className="ml-auto flex flex-col items-center align-right">
                                    <div className="bg-gray-200 rounded-md px-4 py-2 mb-2">
                                        {/* Start Date */}
                                        <p className="text-sm text-gray-700 font-semibold">Start Date</p>
                                        {new Date(plan.startDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: '2-digit',
                                            year: 'numeric',
                                        }).replace(/,/, '-')}

                                    </div>
                                    <div className="bg-gray-200 rounded-md px-4 py-2">
                                        {/* End Date in red */}
                                        <p className="text-sm text-red-500 font-semibold"> End Date  </p>
                                        {new Date(plan.endDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: '2-digit',
                                            year: 'numeric',
                                        }).replace(/,/, '-')}

                                    </div>
                                </div>
                            </div>

                        ))
                    ) : (
                        <div className="mt-10 text-center text-gray-700">
                            <p>No active subscription</p>
                        </div>
                    )}



                    {/* previous subscriptions. */}


                </div>





                {/* Footer */}
                <DialogFooter className="space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        // onClick={handleCancel}
                        className="py-2 px-6 text-sm font-medium text-gray-600 border border-gray-300 rounded-md"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        // onClick={handleSubmit}
                        // disabled={loading}
                        className="relative"
                    >
                        {/* {loading && (
                            <Loader size="35px" className="animate-spin absolute left-4" />
                        )}
                        {loading ? 'Updating...' : 'Update'} */}
                        Update Subscription
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateSubscriptions
'use client';
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import UpdateSubscriptions from "./updateSubscriptions";

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

interface CustomersTableProps {
    shouldRefresh: boolean; // Prop to trigger the refresh
}

const SubscriptionTable: React.FC<CustomersTableProps> = ({ shouldRefresh }) => {
    const [loading, setLoading] = useState(true);
    const [customerData, setCustomerData] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/subscriptions');
                const data = await response.json();

                if (data?.customers) {
                    setCustomerData(
                        data.customers.map((item: { customer: Customer; currentPlans: Subscription[] }) => ({
                            ...item.customer,
                            currentPlan: item.currentPlans?.[0] || null, // Assuming first current plan
                        }))
                    );
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
    }, [shouldRefresh]);

    const filteredCustomers = customerData.filter((customer) => {
        const fullName = `${customer.firstName} ${customer.middleName} ${customer.lastName}`.toLowerCase();
        const phone = customer.phoneNumber.toLowerCase();
        return (
            fullName.includes(searchQuery.toLowerCase()) ||
            phone.includes(searchQuery.toLowerCase())
        );
    });

    const handleRowClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedCustomer(null);
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-[#1E1E1E]">
            <div className="py-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 rounded-lg border w-80"
                    placeholder="Search by name or phone"
                />
            </div>

            <table className="w-full text-sm text-left text-gray-400 bg-[#1E1E1E]">
                <thead className="text-xs text-gray-500 uppercase bg-gray-300 dark:bg-gray-600 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">Profile</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Phone</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Payment Status</th> 
                    </tr>
                </thead>
                <tbody>
                    {loading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4"><Skeleton className="h-10 w-10 rounded-full" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                                <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                            </tr>
                        ))
                        : filteredCustomers.map((customer) => (
                            <tr 
                            key={customer._id} 
                            onClick={() => handleRowClick(customer)}
                            tabIndex={0}
                            typeof="button"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleRowClick(customer);
                                }
                            }}
                             className="bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">
                                    <img src={customer.image} alt="Profile" className="w-10 h-10 rounded-full" />
                                </td>
                                <td className="px-6 py-4">{customer.firstName} {customer.middleName} {customer.lastName}</td>
                                <td className="px-6 py-4">{customer.phoneNumber}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded ${
                                            customer.currentPlan
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                        }`}
                                    >
                                        {customer.currentPlan ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {/* {customer.currentPlan?.paymentStatus || "N/A"} */}
                                    <span
                                        className={`px-2 py-1 rounded ${
                                            customer.currentPlan?.paymentStatus
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                        }`}
                                    >
                                        {customer.currentPlan?.paymentStatus || "N/A"}
                                    </span>
                                </td>
                                 
                            </tr>
                        ))}
                </tbody>
            </table>
            <UpdateSubscriptions
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                 customer={selectedCustomer}
            />
        </div>
    );
};

export default SubscriptionTable;

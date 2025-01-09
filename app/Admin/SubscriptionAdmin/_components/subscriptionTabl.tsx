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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filteredStatus, setFilteredStatus] = useState("All");
    const [filteredSubscriptionStatus, setFilteredSubscriptionStatus] = useState("All"); // For Subscription Status

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

        const matchesFilter =
            filteredSubscriptionStatus === "All" ||
            (filteredSubscriptionStatus === "Paid" && customer.currentPlan?.paymentStatus === "Paid") ||
            (filteredSubscriptionStatus === "Not Paid" && customer.currentPlan?.paymentStatus === "Not Paid") ||
            (filteredSubscriptionStatus === "Pending" && customer.currentPlan?.paymentStatus === "Pending") ||
            (filteredSubscriptionStatus === "Active" && customer.currentPlan) ||
            (filteredSubscriptionStatus === "Inactive" && !customer.currentPlan);

        return (
            (fullName.includes(searchQuery.toLowerCase()) || phone.includes(searchQuery.toLowerCase())) &&
            matchesFilter
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

    const getStatusColor = (paymentStatus: string) => {
        switch (paymentStatus) {
            case "Paid":
                return "text-green-500";
            case "Not Paid":
                return "text-red-500";
            case "Pending":
                return "text-yellow-500";
            case "All":
                return "text-white-500";
            case "Active":
                return "text-green-500";
            case "Inactive":
                return "text-red-500";
            default:
                return "text-white-500";
        }
    };
    const handleFilterChange = (status: any) => {
        setFilteredSubscriptionStatus(status);
        setDropdownOpen(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    // Further filter customers based on the search query (case-insensitive search)
    const searchedCustomers = filteredCustomers.filter((customer) => {
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
        const phone = customer.phoneNumber.toLowerCase();
        return (
            fullName.includes(searchQuery.toLowerCase()) ||
            phone.includes(searchQuery.toLowerCase())
        );
    });
    // Calculate pagination
    const totalPages = Math.ceil(searchedCustomers.length / itemsPerPage);
    const paginatedCustomers = searchedCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
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
            <div>
                <button
                    id="subscriptionStatusDropdown"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="inline-flex items-center text-white bg-[#1E1E1E] border border-black focus:outline-none hover:bg-[#1E1E1E] focus:ring-4 focus:ring-black-200 font-medium rounded-lg text-sm px-3 py-1.5"
                >
                    <span className="sr-only">Subscription & Payment Status</span>
                    <span className={getStatusColor(filteredSubscriptionStatus)}>{filteredSubscriptionStatus}</span>
                    <svg
                        className="w-2.5 h-2.5 ml-2.5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                        aria-hidden="true"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1l4 4 4-4"
                        />
                    </svg>
                </button>
                {dropdownOpen && (
                    <div className="absolute mt-2 z-10 bg-[#1E1E1E] divide-y divide-gray-200 rounded-lg shadow w-44">
                        <ul className="py-1 text-sm text-gray-600 dark:text-gray-300">
                            <li>
                                <a
                                    onClick={() => handleFilterChange("All")}
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-300"
                                >
                                    All
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleFilterChange("Paid")}
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-300 text-green-400"
                                >
                                    Paid
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleFilterChange("Not Paid")}
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-300 text-red-400"
                                >
                                    Not Paid
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleFilterChange("Pending")}
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-300 text-yellow-400"
                                >
                                    Pending
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleFilterChange("Active")}
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-300 text-green-400"
                                >
                                    Active
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleFilterChange("Inactive")}
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-300 text-red-400"
                                >
                                    Inactive
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>



            <table className="w-full text-sm text-left text-gray-400 bg-[#1E1E1E] mt-10">
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
                        : paginatedCustomers.map((customer) => (
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
                                        className={`px-2 py-1 rounded ${customer.currentPlan
                                            ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white"
                                            }`}
                                    >
                                        {customer.currentPlan ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded ${customer.currentPlan?.paymentStatus
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

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 px-4 py-3 bg-gray-300 border-t border-gray-200 rounded-lg shadow-md">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === 1
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-yellow-600 text-white hover:bg-yellow-600"
                        }`}
                >
                    Previous
                </button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === totalPages
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-yellow-600 text-white hover:bg-yellow-600"
                        }`}
                >
                    Next
                </button>
            </div>
            <UpdateSubscriptions
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                customer={selectedCustomer}
            />
        </div>
    );
};

export default SubscriptionTable;

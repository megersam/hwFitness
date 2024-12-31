'use client'
import React, { useEffect, useState } from "react";
import { plans } from "./plans";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewPlanDialog } from "./viewPlan";

interface Plan {
    _id: string;
    planName: string;
    period: number;
    discount: boolean;
    price: number,
    total: number,
    percentage: number,
    status: boolean;


}
interface Row {
    _id: string;
    planName: string;
    period: number;
    discount: boolean;
    price: number,
    total: number,
    percentage: number,
    status: boolean;  // Or Date, depending on how you store the date
    // Add any other properties your row has
}

interface PlanTableProps {
    shouldRefresh: boolean; // Prop to trigger the refresh
}

const PlansTable: React.FC<PlanTableProps> = ({ shouldRefresh }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filteredStatus, setFilteredStatus] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items per page
    const [isLoading, setIsLoading] = useState(true);
    const [plans, setPlans] = useState<Plan[]>([]);

    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const fetchPlans = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/plan');
            const data = await response.json();
            if (data.plans) {
                setPlans(data.plans);
            }
            console.log(data.plans);
        } catch (error) {
            console.error('Error fetching prices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch prices from the API
    useEffect(() => {
        fetchPlans();
    }, [shouldRefresh]);
    // shouldRefresh


    const handleRowSelect = (row: Row) => {
        setSelectedPlan(row); // Set the selected price
        setIsDialogOpen(true); // Open the dialog
    };



    // Filter customers based on the selected status
    const filteredPlans = plans.filter((plan) => {
        if (filteredStatus === "All") return true;
       // return plan.status === filteredStatus;
    });

    // Further filter customers based on the search query (case-insensitive search)
    const searchedPlans = filteredPlans.filter((Plan) => {
        const name = `${Plan.planName}`.toLowerCase();
        return (
            name.includes(searchQuery.toLowerCase())
        );
    });

    // Calculate pagination
    const totalPages = Math.ceil(searchedPlans.length / itemsPerPage);
    const paginatedPlans = searchedPlans.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Function to handle the status change and close the dropdown
    const handleStatusChange = (status: string) => {
        setFilteredStatus(status);
        setCurrentPage(1); // Reset to the first page when the filter changes
        setDropdownOpen(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "text-green-500";
            case "Not Active":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };

    const statusColors = {
        true: "bg-green-500 text-white", // Active status
        false: "bg-red-500 text-white",   // Inactive status
    };

    const closeDialog = () => {
        setIsDialogOpen(false);

    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between flex-col md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">


                {/* Search Input */}
                <div className="relative">
                    <label htmlFor="table-search" className="sr-only">
                        Search
                    </label>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 19l-4-4m0-7a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="table-search-customers"
                        value={searchQuery} // Bind input value to state
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                        className="block p-2 pl-10 text-sm text-gray-900 border border-primary rounded-lg w-80 bg-white focus:ring-primary focus:border-primary dark:border-gray-600 dark:placeholder-primary dark:text-white dark:focus:ring-primary dark:focus:border-blue-500"
                        placeholder="Search for Plans"
                    />
                </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input
                                    id="checkbox-all-search"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="checkbox-all-search" className="sr-only">
                                    checkbox
                                </label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Period
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Discount
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Percentage
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Total
                        </th>

                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {isLoading
                        ? Array.from({ length: itemsPerPage }).map((_, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="p-4">
                                    <Skeleton className="h-4 w-4 rounded-md" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-20" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-32" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-16" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-16" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-16" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-16" />
                                </td>
                            </tr>
                        ))
                        : paginatedPlans.map((plan, index) => (

                            <tr
                                key={plan._id || index}
                                onClick={() => handleRowSelect(plan)}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor="checkbox-table-search-1" className="sr-only">
                                            checkbox
                                        </label>
                                    </div>
                                </td>
                                <th
                                    scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                                >

                                    <div className="pl-3">
                                        <div className="text-base font-semibold">{plan.planName}</div>

                                    </div>
                                </th>
                                <td className="px-6 py-4 text-base font-semibold">{plan.period}</td>
                                <td className="px-6 py-4 text-base font-semibold">
                                    {plan.discount === true ? (
                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                    ) : (
                                        <XCircleIcon className="h-6 w-6 text-red-500" />
                                    )}
                                </td>
                                <td className="px-6 py-4 text-base font-semibold">{plan.percentage || 'N/A'}</td>

                                <td className="text-base font-semibold">{plan.total}</td>
                                <div className="flex items-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[plan.status as unknown as keyof typeof statusColors]}`}
                                    >
                                        {plan.status ? "Active" : "Inactive"}
                                    </span>

                                </div>

                            </tr>
                        ))}
                </tbody>
            </table>










            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-lg shadow-md">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === 1
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                >
                    Previous
                </button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === totalPages
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                >
                    Next
                </button>
            </div>

 
            {/* Dialog */}
            {isDialogOpen && selectedPlan && (
                <ViewPlanDialog
                    plan={selectedPlan}  // Pass the selected row to the dialog
                    onClose={closeDialog}  // Close dialog function
                    refreshPlans={fetchPlans} // Pass refresh function to EditPriceDialog
                />
            )}
        </div>
    );
};

export default PlansTable;

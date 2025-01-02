'use client'
import React, { useEffect, useState } from "react";
import { customers } from "./customer";
import { Skeleton } from "@/components/ui/skeleton";
import ViewCustomerDialog from "./viewCustomers";

interface Customer {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    selectedPlan: string;
    selectedPlanPeriod: string;
    nextPaymentDate: string;
    paymentMethod: string;
    paymentStatus: string;
    total: string;
    image: string;
    startDate: string;
    createdAt: string;
    updatedAt: string;
}
interface CustomersTableProps {
    shouldRefresh: boolean; // Prop to trigger the refresh
}

const CustomerTable: React.FC<CustomersTableProps> = ({ shouldRefresh }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filteredStatus, setFilteredStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [loading, setLoading] = useState(true);
    const [customerData, setCustomerData] = useState<Customer[]>([]);

    // Inside the CustomerTable component
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);


    useEffect(() => {
        // Simulate fetching data asynchronously
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/customer'); // Adjust API path if needed
                const data = await response.json();
                console.log(data);
                if (Array.isArray(data)) {
                    setCustomerData(data);
                } else if (data.customers) {
                    setCustomerData(data.customers);
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

    // Filter customers based on the selected status
    const filteredCustomers = Array.isArray(customerData)
        ? customerData.filter((customer) => {
            if (filteredStatus === "All") return true;
            return customer.paymentStatus === filteredStatus;
        })
        : [];

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

    // Function to handle the status change and close the dropdown
    const handleStatusChange = (status: string) => {
        setFilteredStatus(status);
        setCurrentPage(1); // Reset to the first page when the filter changes
        setDropdownOpen(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getStatusColor = (paymentStatus: string) => {
        switch (paymentStatus) {
            case "Paid":
                return "text-green-500";
            case "Not Paid":
                return "text-red-500";
            case "Pending":
                return "text-yellow-500";
            default:
                return "text-white-500";
        }
    };

    const statusColors: Record<Customer["paymentStatus"], string> = {
        Pending: "bg-yellow-500 text-white",
        Paid: "bg-green-500 text-white",
        NotPaid: "bg-red-500 text-white",
    };


    // Inside the CustomerTable component
    const handleRowClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedCustomer(null);
    };



  // Format the date to "MMM-dd-yyyy"
  const formattedDate = customerData[0]?.createdAt
  ? new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
  }).format(new Date(customerData[0]?.createdAt))
  : "N/A"; // Provide a fallback value




    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-[#1E1E1E]">
            {/* Header */}
            <div className="flex items-center justify-between flex-col md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-[#1E1E1E] dark:bg-gray-800">
                {/* Dropdown Button */}
                <div>
                    <button
                        id="dropdownActionButton"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="inline-flex items-center text-white bg-[#1E1E1E] border border-black focus:outline-none hover:bg-[#1E1E1E] focus:ring-4 focus:ring-black-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-700 dark:text-gray-300 dark:border-black dark:hover:bg-[#1E1E1E] dark:focus:ring-black"
                        type="button"
                    >
                        <span className="sr-only text-white">Status button</span>
                        <span className={getStatusColor(filteredStatus)}>{filteredStatus}</span>
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
                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute mt-2 z-10 bg-[#1E1E1E] divide-y divide-gray-200 rounded-lg shadow w-44 dark:bg-[#1E1E1E] dark:divide-gray-500">
                            <ul className="py-1 text-sm text-white-600 dark:text-gray-300">
                                <li>
                                    <a
                                        onClick={() => handleStatusChange("All")}
                                        href="#"
                                        className="block px-4 py-2 hover:bg-gray-300 text-white dark:hover:bg-gray-500 dark:hover:text-white"
                                    >
                                        All Customers
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => handleStatusChange("Paid")}
                                        href="#"
                                        className="block px-4 py-2 text-green-400 hover:bg-gray-300 dark:hover:bg-gray-500 dark:hover:text-white"
                                    >
                                        Paid
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => handleStatusChange("NotPaid")}
                                        href="#"
                                        className="block px-4 py-2 text-red-400 hover:bg-gray-300 dark:hover:bg-gray-500"
                                    >
                                        Not Paid
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => handleStatusChange("Pending")}
                                        href="#"
                                        className="block px-4 py-2 text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-500"
                                    >
                                        Pending
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Search Input */}
                <div className="relative">
                    <label htmlFor="table-search" className="sr-only">
                        Search
                    </label>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-400 dark:text-gray-500"
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block p-2 pl-10 text-sm text-gray-800 border border-secondary rounded-lg w-80 bg-gray-200 focus:ring-secondary focus:border-secondary dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-secondary dark:focus:border-gray-400"
                        placeholder="Search for customers"
                    />
                </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm text-left text-gray-400 bg-[#1E1E1E] dark:text-gray-500">
                <thead className="text-xs text-gray-500 uppercase bg-gray-300 dark:bg-gray-600 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input
                                    id="checkbox-all-search"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-500 bg-gray-200 border-gray-300 rounded focus:ring-blue-400 dark:focus:ring-blue-500 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label htmlFor="checkbox-all-search text-white-500" className="sr-only">
                                    checkbox
                                </label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Created At
                        </th>
                      
                    </tr>
                </thead>
                <tbody>
                    {loading
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
                                 
                            </tr>
                        ))
                        :
                        paginatedCustomers.map((customer) => (
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
                                className="bg-gray-100 border-b dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-500 bg-gray-200 border-gray-300 rounded focus:ring-blue-400 dark:focus:ring-blue-500 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        />
                                        <label htmlFor="checkbox-table-search-1" className="sr-only">
                                            checkbox
                                        </label>
                                    </div>
                                </td>
                                <th
                                    scope="row"
                                    className="flex items-center px-6 py-4 text-gray-700 whitespace-nowrap dark:text-gray-200"
                                >
                                    <img
                                        className="w-10 h-10 rounded-full"
                                        src={customer.image}
                                    />
                                    <div className="pl-3">
                                        <div className="text-base font-semibold">{customer.firstName} {customer.middleName} {customer.lastName}</div>
                                        <div className="font-normal text-black-500">
                                            {customer.phoneNumber}
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4 text-base color-black">{formattedDate}</td>
                                 
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
           
            <ViewCustomerDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                customer={selectedCustomer}
            />
        </div>


    );
};

export default CustomerTable;

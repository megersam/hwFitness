'use client'
import React, { useState } from "react";
import { customers } from "./customer";

interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    profile: string;
    phoneNumber: string;
    status: string;
    subscriptionEndDate: string;
}

const CustomerTable: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filteredStatus, setFilteredStatus] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items per page

    // Filter customers based on the selected status
    const filteredCustomers = customers.filter((customer) => {
        if (filteredStatus === "All") return true;
        return customer.status === filteredStatus;
    });

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "text-green-500";
            case "Expired":
                return "text-red-500";
            case "Pending":
                return "text-yellow-500";
            default:
                return "text-gray-500";
        }
    };

    const statusColors: Record<Customer["status"], string> = {
        Pending: "bg-yellow-500 text-white",
        Active: "bg-green-500 text-white",
        Expired: "bg-red-500 text-white",
    };

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
                    <span className="sr-only">Status button</span>
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
                        <ul className="py-1 text-sm text-gray-600 dark:text-gray-300">
                            <li>
                                <a
                                    onClick={() => handleStatusChange("All")}
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-300 text-white dark:hover:bg-gray-500 dark:hover:text-white"
                                >
                                    Recent Customers
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleStatusChange("Active")}
                                    href="#"
                                    className="block px-4 py-2 text-green-400 hover:bg-gray-300 dark:hover:bg-gray-500 dark:hover:text-white"
                                >
                                    Activate customers
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleStatusChange("Expired")}
                                    href="#"
                                    className="block px-4 py-2 text-red-400 hover:bg-gray-300 dark:hover:bg-gray-500"
                                >
                                    Subscription Expired
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => handleStatusChange("Pending")}
                                    href="#"
                                    className="block px-4 py-2 text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-500"
                                >
                                    Subscription Pending
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
                        Subscription End Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Status
                    </th>
                </tr>
            </thead>
            <tbody>
                {paginatedCustomers.map((customer) => (
                    <tr className="bg-gray-100 border-b dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
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
                                src={customer.profile}
                            />
                            <div className="pl-3">
                                <div className="text-base font-semibold">{customer.firstName} {customer.lastName}</div>
                                <div className="font-normal text-black-500">
                                    {customer.phoneNumber}
                                </div>
                            </div>
                        </th>
                        <td className="px-6 py-4 text-base color-black">{customer.subscriptionEndDate}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[customer.status]
                                        }`}
                                >
                                    {customer.status}
                                </span>
                            </div>
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
    </div>
    

    );
};

export default CustomerTable;

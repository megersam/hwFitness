'use client'
import React, { useState } from "react";
import { Price } from "./price"; 

interface Price {
    id: number;
    price: string;
    status: string;
    date: string; 
}

const PriceTable: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filteredStatus, setFilteredStatus] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items per page

    // Filter customers based on the selected status
    const filteredPrice = Price.filter((price) => {
        if (filteredStatus === "All") return true;
        return price.status === filteredStatus;
    });

    // Further filter customers based on the search query (case-insensitive search)
    const searchedPrices = filteredPrice.filter((Price) => {
        const PriceName = `${Price.price}`.toLowerCase();
        return (
            PriceName.includes(searchQuery.toLowerCase())
        );
    });

    // Calculate pagination
    const totalPages = Math.ceil(searchedPrices.length / itemsPerPage);
    const paginatedPrices = searchedPrices.slice(
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

    const statusColors: Record<Price["status"], string> = {
        Pending: "bg-yellow-500 text-white",
        Active: "bg-green-500 text-white",
        "Not Active": "bg-red-500 text-white",
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between flex-col md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">
                {/* Dropdown Button */}
                <div>
                    <button
                        id="dropdownActionButton"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
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
                        <div className="absolute mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                <li>
                                    <a
                                        onClick={() => handleStatusChange("All")}
                                        href="#"
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Recent Plans
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => handleStatusChange("Active")}
                                        href="#"
                                        className="block px-4 py-2 text-green-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Activate Plans
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => handleStatusChange("Not Active")}
                                        href="#"
                                        className="block px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        Not Active
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
                        placeholder="Search for Price"
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
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                         
                    </tr>
                </thead>
                <tbody>
                    {paginatedPrices.map((price) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
                                    <div className="text-base font-semibold">{price.price}</div>

                                </div>
                            </th>
                            <td className="px-6 py-4">{price.date}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[price.status]
                                            }`}
                                    >
                                        {price.status}
                                    </span>
                                </div>
                            </td>
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
        </div>
    );
};

export default PriceTable;

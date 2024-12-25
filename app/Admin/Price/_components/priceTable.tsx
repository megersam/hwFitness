'use client'
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you've installed ShadCN and have this component
import { EditPriceDialog } from "./editPrice";
interface Price {
    _id: string;
    price: number;
    status: boolean;
    createdAt: string;
}
interface Row {
    _id: string;  
    price: number       // or number depending on your data
    status: boolean;
    createdAt: string;  // Or Date, depending on how you store the date
    // Add any other properties your row has
  }
const PriceTable: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [prices, setPrices] = useState<Price[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredStatus, setFilteredStatus] = useState<boolean | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(""); 
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPrice, setSelectedPrice] = useState<Price | null>(null); // Manage the selected price
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Manage dialog visibility
    const itemsPerPage = 5;

      // Fetch prices
  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/price');
      const data = await response.json();
      if (data.prices) {
        setPrices(data.prices);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setIsLoading(false);
    }
  };
    // Fetch prices from the API
    useEffect(() => {
        fetchPrices();
      }, []);

    const filteredPrices = prices.filter((price) => {
        if (filteredStatus === null) return true;
        return price.status === filteredStatus;
    });

    const searchedPrices = filteredPrices.filter((price) => {
        const priceName = `${price.price}`.toLowerCase();
        return priceName.includes(searchQuery.toLowerCase());
    });

    const totalPages = Math.ceil(searchedPrices.length / itemsPerPage);
    const paginatedPrices = searchedPrices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleStatusChange = (status: string) => {
        setFilteredStatus(status === "All" ? null : status === "Active");
        setCurrentPage(1);
        setDropdownOpen(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRowSelect = (row: Row) => {
        setSelectedPrice(row); // Set the selected price
        setIsDialogOpen(true); // Open the dialog
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedPrice(null);
    };

    // Define the getStatusColor function
    const getStatusColor = (status: boolean) => {
        return status ? "text-green-500" : "text-red-500"; // Active = green, Inactive = red
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
                        <span className={getStatusColor(filteredStatus)}>
                            {filteredStatus === null ? "All" : filteredStatus ? "Active" : "Inactive"}
                        </span>
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
                                        All
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => handleStatusChange("Active")}
                                        href="#"
                                        className="block px-4 py-2 text-green-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Activate  
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => handleStatusChange("Not Active")}
                                        href="#"
                                        className="block px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        Inactive
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
                    <input
                        type="text"
                        id="table-search-customers"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Status</th>
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
                            </tr>
                        ))
                        : paginatedPrices.map((price, index) => (
                            <tr
                                key={price._id || index}
                                onClick={() => handleRowSelect(price)}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </td>
                                <td className="px-6 py-4">{price.price}</td>
                                <td className="px-6 py-4">
                                    {new Date(price.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                    })}
                                </td>
                                <td className="px-6 py-4">
                                    {price.status ? (
                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                    ) : (
                                        <XCircleIcon className="h-6 w-6 text-red-500" />
                                    )}
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
              {/* Dialog */}
              {isDialogOpen && selectedPrice && (
                <EditPriceDialog
                price={selectedPrice}  // Pass the selected row to the dialog
                    onClose={closeDialog}  // Close dialog function
                    refreshPrices={fetchPrices} // Pass refresh function to EditPriceDialog
                />
            )}
        </div>
    );
};

export default PriceTable;

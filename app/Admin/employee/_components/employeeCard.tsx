'use client'

import React, { useState } from "react";

// Employee type definition
type Employee = {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  sex: string;
  phoneNumber: string;
  role: string;
  email: string;
  password: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string; // Optional image URL
};
interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
}

const EmployeeCard:  React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Generate initials from firstName and lastName
  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName[0].toUpperCase() : "";
    const lastInitial = lastName ? lastName[0].toUpperCase() : "";
    return `${firstInitial}${lastInitial}` || "N/A";
  };

  const initials = getInitials(employee.firstName, employee.lastName);

  return (
    <div onClick={onClick} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
      <div className="flex justify-end px-4 pt-4">
        <button
          id="dropdownButton"
          onClick={toggleDropdown}
          className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
          type="button"
        >
          <span className="sr-only">Open dropdown</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
        </button>
        {dropdownOpen && (
          <div
            id="dropdown"
            className="absolute right-4 top-12 z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul className="py-2" aria-labelledby="dropdownButton">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Edit
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Delete
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center pb-10">
        {employee.imageUrl ? (
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={employee.imageUrl}
            alt={`${employee.firstName} ${employee.middleName} image`}
          />
        ) : (
          <div className="w-24 h-24 mb-3 flex items-center justify-center rounded-full shadow-lg bg-gray-300">
            <span className="text-xl font-medium text-gray-700 dark:text-gray-900">
              {initials}
            </span>
          </div>
        )}
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {employee.firstName} {employee.middleName} {employee.lastName}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {employee.role}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {employee.phoneNumber}
        </span>
      </div>
    </div>
  );
};


export default EmployeeCard;

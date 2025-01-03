import React from "react";

interface Customer {
  image: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
}

interface ProfileCardProps {
  customer: Customer;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ customer }) => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 duration-300">
      <div className="relative">
        <img
          src={customer.image}
          alt="Customer"
          className="h-40 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-xl font-bold">
            {customer.firstName} {customer.middleName || ""} {customer.lastName}
          </h2>
          <p className="text-sm opacity-90">{customer.phoneNumber}</p>
        </div>
      </div>
      <div className="p-4">
        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;

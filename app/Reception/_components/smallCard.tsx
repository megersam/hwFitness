"use client"

import { Card } from "@/components/ui/card";
import { Wallet, User, Users, Zap } from "lucide-react";

interface SmallCardProps {
  balance: number;
  title: string;
  iconType: "wallet" | "user" | "users" | "zap"; // New prop for icon
}

export function SmallCard({ balance, title, iconType }: SmallCardProps) {
  let IconComponent;
  let formattedBalance = balance;

  // Determine icon and format the balance
  switch (iconType) {
    case "wallet":
      IconComponent = Wallet;
      break;
    case "user":
      IconComponent = User;
      break;
    case "users":
      IconComponent = Users;
      break;
    case "zap":
      IconComponent = Zap;
      break;
    default:
      IconComponent = Wallet;
  }

  // For Total Customers and Inactive Users, show integer values without .00
  if (title === "Total Customers" || title === "Inactive Users") {
    formattedBalance = Math.floor(balance); // Round down to integer
  }

  return (
    <Card className="bg-yellow-400 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full">
      <div className="flex items-start gap-3">
        <div className="bg-white p-2 rounded-full">
          <IconComponent className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-yellow-900/70">{title}</p>
          <p className="text-2xl font-bold text-yellow-900">
            {title === "Total Paid" ? `$${formattedBalance.toFixed(2)}` : formattedBalance}
          </p>
        </div>
      </div>
    </Card>
  );
}

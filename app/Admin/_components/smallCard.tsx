"use client"

import { Bar, BarChart, Line, LineChart } from "recharts";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency, DollarSign, Subscript, User } from "lucide-react";

// ChartConfig type definition
interface ChartConfig {
  revenue: {
    label: string;
    color: string;
  };
  subscription: {
    label: string;
    color: string;
  };
}

// ChartContainer component
interface ChartContainerProps {
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ config, className, children }) => {
  return (
    <div className={className}>
      {/* You can use the config properties here if needed */}
      {children}
    </div>
  );
};

// Sample data
const data = [
  {
    revenue: 10400,
    subscription: 240,
  },
  {
    revenue: 14405,
    subscription: 300,
  },
  {
    revenue: 9400,
    subscription: 200,
  }
];

// Chart config
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "primary",
  },
  subscription: {
    label: "Subscriptions",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function SmallCard() {
  return (
    <div className="grid gap-8 sm:grid-cols-3 xl:grid-cols-3 py-10">
    {/* First card */}
    <Card className="h-[100px] bg-yellow-500 text-white border-none shadow-none"> {/* Ensure no border or shadow */}
      <CardHeader className="flex justify-center items-center py-1">
        <CardTitle className="text-center text-sm font-normal text-lg">
          Total Revenue
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-0 flex items-center justify-between">
        {/* Icon on the left */}
        <div className="flex-shrink-0">
          <DollarSign size={40} className="text-white" /> {/* Icon color is white */}
        </div>
        {/* Data on the right */}
        <div className="text-lg font-normal">15,231.89</div>
      </CardContent>
    </Card>
  
    {/* Second card */}
    <Card className="h-[100px] bg-yellow-500 text-white border-none shadow-none"> {/* Ensure no border or shadow */}
      <CardHeader className="flex justify-center items-center py-1">
        <CardTitle className="text-center text-sm font-normal text-lg">
          Total Customers
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-0 flex items-center justify-between">
        {/* Icon on the left */}
        <div className="flex-shrink-0">
          <User size={40} className="text-white" /> {/* Icon color is white */}
        </div>
        {/* Data on the right */}
        <div className="text-lg font-normal">30</div>
      </CardContent>
    </Card>
  
    {/* Third card */}
    <Card className="h-[100px] bg-yellow-500 text-white border-none shadow-none"> {/* Ensure no border or shadow */}
      <CardHeader className="flex justify-center items-center py-1">
        <CardTitle className="text-center text-sm font-normal text-lg">
          Expired Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-0 flex items-center justify-between">
        {/* Icon on the left */}
        <div className="flex-shrink-0">
          <Subscript size={40} className="text-white" /> {/* Icon color is white */}
        </div>
        {/* Data on the right */}
        <div className="text-lg font-normal">89</div>
      </CardContent>
    </Card>
  </div>
  

  );
}

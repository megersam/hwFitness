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
      {/* first card */}
      <Card className="h-[100px]"> {/* Set the height of the card */}
        {/* Center the CardHeader */}
        <CardHeader className="flex justify-center items-center py-1">
          <CardTitle className="text-center text-sm font-normal text-lg font-bold">
            Total Revenue
          </CardTitle>
        </CardHeader>
        {/* Align icon and data in CardContent */}
        <CardContent className="pb-0 flex items-center justify-between">
          {/* Icon on the left */}
          <div className="text-black flex-shrink-0">
            {/* Replace with your actual icon */}
            <DollarSign size={40} /> {/* Use consistent size */}
          </div>
          {/* Data on the right */}
          <div className="text-lg font-semibold">15,231.89</div> {/* Match text size */}
        </CardContent>
      </Card>



      {/* second card */}
      <Card className="h-[100px]"> {/* Set the height of the card */}
        {/* Center the CardHeader */}
        <CardHeader className="flex justify-center items-center py-1">
          <CardTitle className="text-center text-sm font-normal text-lg font-bold">
            Total Customers
          </CardTitle>
        </CardHeader>
        {/* Align icon and data in CardContent */}
        <CardContent className="pb-0 flex items-center justify-between">
          {/* Icon on the left */}
          <div className="text-black flex-shrink-0">
            {/* Replace with your actual icon */}
            <User size={40} /> {/* Use consistent size */}
          </div>
          {/* Data on the right */}
          <div className="text-lg font-semibold">30</div> {/* Match text size */}
        </CardContent>
      </Card>



      {/* third card */}
      <Card className="h-[100px]"> {/* Set the height of the card */}
        {/* Center the CardHeader */}
        <CardHeader className="flex justify-center items-center py-1">
          <CardTitle className="text-center text-sm font-normal text-lg font-bold">
            Expiered Subscriptions
          </CardTitle>
        </CardHeader>
        {/* Align icon and data in CardContent */}
        <CardContent className="pb-0 flex items-center justify-between">
          {/* Icon on the left */}
          <div className="text-black flex-shrink-0">
            {/* Replace with your actual icon */}
            <Subscript size={40} /> {/* Use consistent size */}
          </div>
          {/* Data on the right */}
          <div className="text-lg font-semibold">89</div> {/* Match text size */}
        </CardContent>
      </Card>
    </div>
  );
}

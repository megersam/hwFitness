"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function AdminChart() {
  return (
    <Card className="bg-[#1E1E20] text-white border border-[#1E1E20] rounded-md">
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            {/* Grid Lines */}
            <CartesianGrid vertical={false} stroke="#444" /> {/* Lighter grid lines */}

            {/* X-Axis */}
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: '#fff' }} /* Make axis labels white */
              tickFormatter={(value) => value.slice(0, 3)} /* Shorten month names */
            />

            {/* Tooltip */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />

            {/* Bars */}
            <Bar dataKey="desktop" fill="#FFD700" radius={4} /> {/* Yellow for desktop */}
            <Bar dataKey="mobile" fill="#FFC107" radius={4} /> {/* Yellow for mobile */}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>


  )
}

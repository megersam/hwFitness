'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";

interface AddPlanProps {
    visible: boolean;
    onClose: () => void;
}

export function AddPlanDialog({ visible, onClose }: AddPlanProps) {
    const [plan, setPlan] = useState(""); // Track selected plan (Daily/Monthly)
    const [duration, setDuration] = useState(1); // Track duration
    const [discount, setDiscount] = useState(""); // Track discount (true/false)
    const [percentage, setPercentage] = useState(0); // Track discount percentage
    const [total, setTotal] = useState(0); // Track calculated total
    const [price, setPrice] = useState(0); // Price fetched from the API
    
  const [loading, setLoading] = useState<boolean>(false); // Track loading state

    // Fetch the price when the dialog opens
    useEffect(() => {
        if (visible) {
            fetchPrice();
        }
    }, [visible]);

    // Fetch price from the API
    const fetchPrice = async () => {
        try {
            const response = await fetch('/api/price/status'); // Adjust the endpoint as needed
            const data = await response.json();

            if (data.prices && data.prices.length > 0) {
                // Assume we use the first price if multiple are returned
                setPrice(data.prices[0].price);
            } else {
                console.warn("No active prices found.");
            }
        } catch (error) {
            console.error("Error fetching price:", error);
        }
    };

    // Handle plan change
    const handlePlanChange = (event: any) => {
        setPlan(event.target.value);
        calculateTotal(event.target.value, duration, discount, percentage);
    };

    // Handle duration change
    const handleDurationChange = (event: any) => {
        const value = parseInt(event.target.value, 10);
        setDuration(value);
        calculateTotal(plan, value, discount, percentage);
    };

    // Handle discount change
    const handleDiscountChange = (event: any) => {
        const value = event.target.value;
        setDiscount(value);
        calculateTotal(plan, duration, value, percentage);
    };

    // Handle percentage change
    const handlePercentageChange = (event: any) => {
        const value = parseFloat(event.target.value);
        setPercentage(value);
        calculateTotal(plan, duration, discount, value);
    };

    // Calculate total price
    const calculateTotal = (
        selectedPlan: string,
        selectedDuration: number,
        hasDiscount: string,
        discountPercent: number
    ) => {
        let totalPrice = 0;

        if (selectedPlan === "Daily") {
            totalPrice = price * selectedDuration; // Daily total
        } else if (selectedPlan === "Monthly") {
            totalPrice = price * 30 * selectedDuration; // Monthly total (30 days per month)
        }

        // Apply discount if applicable
        if (hasDiscount === "true" && discountPercent > 0) {
            totalPrice -= (totalPrice * discountPercent) / 100;
        }

        setTotal(totalPrice);
    };

    // Handle Save button click
    const handleSave = () => {
        setLoading(true);
        const data = {
            plan,
            duration,
            discount,
            percentage,
            price,
            total,
        };
        console.log("Inputted Data:", data);
        setLoading(false);
    };

    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Plans</DialogTitle>
                </DialogHeader>

                <div className="sm:overflow-visible overflow-y-auto max-h-[70vh] grid gap-4 py-4 px-4 sm:px-0 flex flex-col items-center justify-center">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 w-full">
                        <div className="flex-1 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Select Plan */}
                                <div className="text-center sm:text-left">
                                    <Label htmlFor="plan">Select Plan</Label>
                                    <select
                                        id="plan"
                                        value={plan}
                                        onChange={handlePlanChange}
                                        className="w-full border rounded px-2 py-1"
                                    >
                                        <option value="">Select</option>
                                        <option value="Daily">Daily</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                </div>

                                {/* Duration */}
                                <div className="text-center sm:text-left">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={duration}
                                        onChange={handleDurationChange}
                                        className="w-full"
                                    />
                                </div>

                                {/* Discount */}
                                <div className="text-center sm:text-left">
                                    <Label htmlFor="discount">Discount</Label>
                                    <select
                                        id="discount"
                                        value={discount}
                                        onChange={handleDiscountChange}
                                        className="w-full border rounded px-2 py-1"
                                    >
                                        <option value="">Select</option>
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                </div>

                                {/* Percentage */}
                                {discount === "true" && (
                                    <div className="text-center sm:text-left mt-4">
                                        <Label htmlFor="percentage">Percentage</Label>
                                        <Input
                                            id="percentage"
                                            type="number"
                                            value={percentage}
                                            onChange={handlePercentageChange}
                                            className="w-full"
                                        />
                                    </div>
                                )}

                                {/* Price */}
                                <div className="text-center sm:text-left">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        value={price}
                                        readOnly
                                        className="w-full"
                                    />
                                </div>

                                {/* Total */}
                                <div className="text-center sm:text-left">
                                    <Label htmlFor="total">Total</Label>
                                    <Input
                                        id="total"
                                        value={total.toFixed(2)} // Format total to 2 decimal places
                                        readOnly
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        type="submit">
                        {loading && (
                            <Loader size="35px" className="animate-spin" />
                        )}
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

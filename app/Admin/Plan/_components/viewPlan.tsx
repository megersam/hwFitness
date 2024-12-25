'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';  // Importing toast for notifications
import { Loader } from 'lucide-react'; // Importing spinner icon from lucide-react

interface Row {
    _id: string;
    planName: string;
    period: number;
    discount: boolean;
    price: number;
    total: number;
    percentage: number;
    status: string;
}

interface ViewPlanProps {
    plan: Row | null;
    onClose: () => void;
    refreshPlans: () => void; // Function to refresh the price list
}

export const ViewPlanDialog: React.FC<ViewPlanProps> = ({ plan, onClose, refreshPlans }) => {
    const [price] = useState<number>(plan?.price || 0);
    const [duration, setDuration] = useState<number>(plan?.period || 1);
    const [discount, setDiscount] = useState<boolean>(plan?.discount || false);
    const [planName, setPlanName] = useState<string>(plan?.planName || 'Daily');
    const [percentage, setPercentage] = useState<number>(plan?.percentage || 0);
    const [total, setTotal] = useState<number>(plan?.total || 0);  // Initial total value

    const [loading, setLoading] = useState<boolean>(false); // Track loading state

    // Calculate total price
    const calculateTotal = (
        selectedPlan: string,
        selectedDuration: number,
        hasDiscount: boolean,
        discountPercent: number
    ) => {
        let totalPrice = 0;

        if (selectedPlan === "Daily") {
            totalPrice = price * selectedDuration; // Daily total
        } else if (selectedPlan === "Monthly") {
            totalPrice = price * 30 * selectedDuration; // Monthly total (30 days per month)
        }

        // Apply discount if applicable
        if (hasDiscount && discountPercent > 0) {
            totalPrice -= (totalPrice * discountPercent) / 100;
        }

        setTotal(totalPrice); // Update the total
    };

    // Recalculate total whenever relevant fields change
    useEffect(() => {
        calculateTotal(planName, duration, discount, percentage);
    }, [planName, duration, discount, percentage]);

    const handleSave = async () => {
        if (!plan) return;

        setLoading(true);
        try {
            const updatedPlan = { ...plan, price, period: duration, discount, percentage };

            const response = await axios.put(`/api/plan/${plan._id}`, updatedPlan);
            if (response.status === 200) {
                toast.success("Plan updated successfully!");
                refreshPlans(); // Refresh the plans after successful update
                onClose(); // Close the dialog
            }
        } catch (error) {
            console.error("Error updating plan", error);
            toast.error("Failed to update plan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={Boolean(plan)} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Update Plan</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Plan Name Selector */}
                    <div>
                        <Label htmlFor="plan-name">Select Plan</Label>
                        <select
                            id="plan-name"
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                        >
                            <option value="Daily">Daily</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>

                    {/* Duration */}
                    <div>
                        <Label htmlFor="duration">Period (Months)</Label>
                        <Input
                            id="duration"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            value={price}
                            readOnly
                        />
                    </div>

                    {/* Discount Selector */}
                    <div>
                        <Label htmlFor="discount">Discount</Label>
                        <select
                            id="discount"
                            value={discount ? "true" : "false"}
                            onChange={(e) => setDiscount(e.target.value === "true")}
                            className="w-full border rounded px-2 py-1"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>

                    {/* Percentage (only if discount is true) */}
                    {discount && (
                        <div>
                            <Label htmlFor="percentage">Discount Percentage</Label>
                            <Input
                                id="percentage"
                                type="number"
                                value={percentage}
                                onChange={(e) => setPercentage(Number(e.target.value))}
                            />
                        </div>
                    )}

                    {/* Total */}
                    <div>
                        <Label htmlFor="total">Total</Label>
                        <Input
                            id="total"
                            value={total.toFixed(2)} // Display total with 2 decimal places
                            readOnly
                            className="bg-gray-100"
                        />
                    </div>
                </div>

                {/* Dialog Footer */}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} className="mr-2">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className={loading ? "bg-gray-300" : "bg-blue-500"}>
                        {loading ? <Loader className="animate-spin w-4 h-4" /> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

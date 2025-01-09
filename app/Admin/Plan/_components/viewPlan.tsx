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
    status: boolean;
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
    const [total, setTotal] = useState<number>(plan?.total || 0);  
    const [planStatus, setPlanStatus] = useState<boolean>(plan?.status || true); // Set the initial status as boolean
    const [loading, setLoading] = useState<boolean>(false); 
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Ensure that the planStatus is updated when `plan` changes
        if (plan) {
            setPlanStatus(plan.status); // Update planStatus with the boolean value from plan
        }
    }, [plan]); // This will run whenever the `plan` prop changes

    // Calculate total price and update on planName, duration, discount, or percentage change
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

        setIsSaving(true);
        try {
            // Prepare the updated plan, including the status field (as boolean)
            const updatedPlan = {
                ...plan,
                planName, 
                period: duration,
                discount,
                percentage,
                total,
                status: planStatus // Include status as boolean (true for Active, false for Inactive)
            };

            const response = await axios.put(`/api/plan/${plan._id}`, updatedPlan);
            if (response.status === 200) {
                toast.success("Plan updated successfully!");
                refreshPlans(); 
                onClose(); 
            }
        } catch (error) {
            console.error("Error updating plan", error);
            toast.error("Failed to update plan.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!plan) return;

        setIsDeleting(true);
        try {
            const response = await axios.delete(`/api/plan/${plan._id}`);
            if (response.status === 200) {
                toast.success("Plan deleted successfully!");
                refreshPlans();
                onClose();
            }
        } catch (error) {
            console.error("Error deleting plan", error);
            toast.error("Failed to delete plan.");
        } finally {
            setIsDeleting(false);
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
                            onChange={(e) => {
                                const newDiscount = e.target.value === "true";
                                setDiscount(newDiscount);
                                if (!newDiscount) {
                                    setPercentage(0);
                                }
                            }}
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
                            onChange={(e) => setTotal(Number(e.target.value))}
                            readOnly
                            className="bg-gray-100"
                        />
                    </div>

                    {/* Status Selector */}
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            value={planStatus ? "true" : "false"} // Display as "true" or "false"
                            onChange={(e) => setPlanStatus(e.target.value === "true")} // Convert back to boolean
                            className="w-full border rounded px-2 py-1"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Dialog Footer */}
                <DialogFooter>
                    {/* <Button
                        variant="outline"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`bg-red-500 ${isDeleting ? "cursor-not-allowed opacity-75" : ""} w-32 h-12 flex items-center justify-center`}>
                        {isDeleting ? <Loader className="animate-spin w-4 h-4" /> : "Delete"}
                    </Button> */}
                    <Button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`bg-yellow-500 hover:bg-yellow-600 ${isSaving ? "cursor-not-allowed opacity-75" : ""} w-32 h-12 flex items-center justify-center`}>
                        {isSaving ? <Loader className="animate-spin w-4 h-4" /> : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify'; // Importing toast for notifications
import { Loader } from 'lucide-react'; // Importing spinner icon from lucide-react
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup and RadioGroupItem

interface Row {
    _id: string;
    price: number;
    status: boolean;
    createdAt: string;
}
interface EditPriceDialogProps {
    price: Row | null;
    onClose: () => void;
}

export const EditPriceDialog: React.FC<EditPriceDialogProps> = ({ price, onClose }) => {
    const [priceValue, setPriceValue] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [priceStatus, setPriceStatus] = useState(price?.status || false);

    // Synchronize state with prop change (for price and status)
    useEffect(() => {
        if (price) {
            setPriceValue(price.price);  // Update price when prop changes
            setPriceStatus(price.status);  // Update status when prop changes
        }
    }, [price]); // Add price as dependency to re-sync state on prop change

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Start loading spinner

        try {
            const response = await axios.put(`/api/price/${price?._id}`, {
                price: priceValue,
                status: priceStatus, // Include status in the update
            });

            // Show success toast
            toast.success('Price updated successfully!');
            onClose(); // Close dialog
        } catch (error) {
            // Show error toast if update fails
            toast.error('Failed to update price. Please try again.');
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Update Price</DialogTitle>
                </DialogHeader>

                {price && (
                    <div className="py-4 px-4 sm:px-0 flex flex-col items-start justify-center w-full">
                        <div className="w-full space-y-4">
                            {/* Price Field */}
                            <div className="flex items-center space-x-4">
                                <div className="w-1/3">
                                    <Label htmlFor="price">Price</Label>
                                </div>
                                <div className="w-2/3">
                                    <Input
                                        id="price"
                                        type="number"
                                        name="price"
                                        readOnly
                                        value={priceValue}
                                        onChange={(e) => setPriceValue(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Status Field */}
                            <div className="flex items-center space-x-4">
                                <div className="w-1/3">
                                    <Label htmlFor="status" className="text-gray-800">Status</Label>
                                </div>
                                <div className="w-2/3">
                                    <RadioGroup
                                        value={priceStatus ? "active" : "inactive"} // Controlled value, based on state
                                        onValueChange={(value: string) => {
                                            // Update the priceStatus state based on selected value
                                            setPriceStatus(value === "active");
                                        }}
                                        className="flex space-x-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="active"
                                                id="active"
                                                className="h-4 w-4 border-2 border-gray-300 text-green-500 focus:ring-green-500"
                                            />
                                            <Label htmlFor="active" className="text-gray-800">Active</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="inactive"
                                                id="inactive"
                                                className="h-4 w-4 border-2 border-red-300 text-red-500 focus:ring-red-500"
                                            />
                                            <Label htmlFor="inactive" className="text-red-800">Inactive</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            {/* Created Date Field */}
                            <div className="flex items-center space-x-4">
                                <div className="w-1/3">
                                    <Label htmlFor="date">Created Date</Label>
                                </div>
                                <div className="w-2/3">
                                    <Input
                                        id="date"
                                        type="date"
                                        name="date"
                                        readOnly
                                        value={new Date(price?.createdAt).toISOString().split('T')[0]}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className="relative"
                    >
                        {loading && <Loader size="35px" className="animate-spin" />}
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

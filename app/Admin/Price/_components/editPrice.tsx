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
    refreshPrices: () => void; // Function to refresh the price list
}

export const EditPriceDialog: React.FC<EditPriceDialogProps> = ({ price, onClose, refreshPrices  }) => {
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
    
        if (!price) {
            // Handle the case where `price` is null or undefined
            toast.error('Price data is missing');
            setLoading(false);
            return;
        }
    
        // Prepare the data to be sent to the API
        const dataToUpdate = {
            price: priceValue,
            status: priceStatus, // status is boolean, so we send it directly (true or false)
            createdAt: price.createdAt ? new Date(price.createdAt).toISOString() : new Date().toISOString(), // Fallback to current date if createdAt is undefined
        };
    
        // Log the data to be updated
        console.log('Data to update:', dataToUpdate);
    
        try {
            // Make the PUT request to the API to update the price status
            const response = await fetch(`/api/price/${price._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate),
            });
    
            const responseData = await response.json();
            if (response.ok) {
                // Show success toast
                toast.success('Price updated successfully!');
                refreshPrices();
            } else {
                // Handle error if the response is not successful
                toast.error(`Failed to update price: ${responseData.error}`);
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error('Error updating price:', error);
            toast.error('Failed to update price');
        } finally {
            setLoading(false); // Stop loading spinner
            onClose(); // Close dialog
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
                        className="relative bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                        {loading && <Loader size="35px" className="animate-spin" />}
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

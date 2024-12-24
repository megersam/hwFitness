'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface AddPlanProps {
    visible: boolean;
    onClose: () => void;
}

export function AddPlanDialog({ visible, onClose }: AddPlanProps) {
    const [discount, setDiscount] = useState(""); // Track the discount value

    const handleDiscountChange = (event: any) => {
        setDiscount(event.target.value); // Update discount value when dropdown changes
    };
    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Plans</DialogTitle>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="sm:overflow-visible overflow-y-auto max-h-[70vh] grid gap-4 py-4 px-4 sm:px-0 flex flex-col items-center justify-center">
                    {/* Profile Image and Form Section */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 w-full">
                        {/* Profile Picture */}


                        {/* Form Fields */}
                        <div className="flex-1 w-full">
                            {/* Horizontal Parallel Layout */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Select Type */}
                                <div className="text-center sm:text-left">
                                    <Label htmlFor="gender">Select Plan</Label>
                                    <select
                                        id="gender"
                                        required={true}
                                        className="w-full border rounded px-2 py-1"
                                    >
                                        <option value="">Select</option>
                                        <option value="Daily">Daily</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                </div>

                                {/* Father Name */}
                                <div className="text-center sm:text-left">
                                    <Label htmlFor="middleName">Duration</Label>
                                    <Input
                                        id="middleName"
                                        placeholder="Enter the durations"
                                        className="w-full"
                                        type="number"
                                        defaultValue='1'
                                    />
                                </div>

                                {/* Discount  */}
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
                                {discount === "true" && ( // Render only if discount is "true"
                                    <div className="text-center sm:text-left mt-4">
                                        <Label htmlFor="percentages">Percentages</Label>
                                        <Input
                                            id="percentages"
                                            type="number"
                                            className="w-full"
                                        />
                                    </div>
                                )}

                                 {/* Price */}
                                 <div className="text-center sm:text-left">
                                    <Label htmlFor="account">Price</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        readOnly
                                        className="w-full"
                                        value='30'
                                    />
                                </div>

                                {/* Total With Discount */}
                                <div className="text-center sm:text-left">
                                    <Label htmlFor="total">Total</Label>
                                    <Input
                                        id="total"
                                        name="total"
                                        placeholder="Total price"
                                        readOnly
                                        className="w-full"
                                    />
                                </div>
  
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter>
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

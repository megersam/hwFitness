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
import { useState } from "react";

interface AddPriceProps {
    visible: boolean;
    onClose: () => void; 
}

export function AddPriceDialog({ visible, onClose }: AddPriceProps) {
  
    const [price, setPrice] = useState<number>(0);

    const handleSave = () => {
         
        onClose();
    };

    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Price</DialogTitle>
                </DialogHeader>

                <div className="py-4 px-4 sm:px-0 flex flex-col items-center justify-center">
                    <div className="w-full">
                        <div className="text-center sm:text-left">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(parseFloat(e.target.value) )}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" onClick={handleSave}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

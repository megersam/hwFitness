'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';  // Importing toast for notifications
import { Loader } from 'lucide-react'; // Importing spinner icon from lucide-react

interface AddPriceProps {
  visible: boolean;
  onClose: () => void;
}

export function AddPriceDialog({ visible, onClose }: AddPriceProps) {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false); // Track loading state

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start the loading state

    try {
      const response = await axios.post('/api/price', { price });

      // Success: Show toast and reset price input
      toast.success('Price added successfully!');
      setPrice(0);  // Optionally reset price field
      onClose(); // Close dialog

    } catch (error) {
      // Handle error and show correct error message from the response
      if (axios.isAxiosError(error) && error.response) {
        // Check if error response exists and extract message
        const errorMessage = error.response.data.error || 'Something went wrong. Please try again.';
        toast.error(errorMessage);  // Show error message in toast
      } else {
        // If no response, show a generic error message
        toast.error('Failed to add price. Please try again.');
      }

      console.error('Error creating Price:', error);
    } finally {
      setLoading(false); // End the loading state
    }
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
                name="price"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading} // Disable button while loading
            className="relative"
          >
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

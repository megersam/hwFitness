// components/ViewCustomerDialog.tsx
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Customer {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    phoneNumber: string;
    image: string;
    paymentStatus: string;
    nextPaymentDate: string;
    paymentMethod: string;
    total: string;
}

interface ViewCustomerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
}

const ViewCustomerDialog: React.FC<ViewCustomerDialogProps> = ({ isOpen, onClose, customer }) => {
    if (!customer) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Customer Details</DialogTitle>
                    <DialogDescription>
                        Detailed information about the customer.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <img
                            src={customer.image}
                            alt={`${customer.firstName} ${customer.lastName}`}
                            className="w-20 h-20 rounded-full"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{`${customer.firstName} ${customer.middleName} ${customer.lastName}`}</h2>
                            <p className="text-gray-600">{customer.phoneNumber}</p>
                        </div>
                    </div>
                    <div>
                        <strong>Gender:</strong> {customer.gender}
                    </div>
                    <div>
                        <strong>Payment Status:</strong> {customer.paymentStatus}
                    </div>
                    <div>
                        <strong>Next Payment Date:</strong> {customer.nextPaymentDate}
                    </div>
                    <div>
                        <strong>Payment Method:</strong> {customer.paymentMethod}
                    </div>
                    <div>
                        <strong>Total:</strong> {customer.total}
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={onClose} variant="secondary">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewCustomerDialog;

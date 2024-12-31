'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';  // Import QRCodeSVG

interface Customer {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    selectedPlan: string;
    selectedPlanPeriod: string;
    nextPaymentDate: string;
    paymentMethod: string;
    paymentStatus: string;
    total: string;
    image: string;
    startDate: string;
    createdAt: string;
    updatedAt: string;
}

interface ViewCustomerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
}

const ViewCustomerDialog: React.FC<ViewCustomerDialogProps> = ({ isOpen, onClose, customer }) => {
    if (!customer) return null;

    const [loading, setLoading] = useState(false);

    // Local state to track updates
    const [formData, setFormData] = useState<Customer>(customer);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (value: string) => {
        setFormData((prev) => ({ ...prev, gender: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/customer/${formData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update customer');
            }

            toast.success('Customer updated successfully!');
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while updating the customer.');

        } finally {
            setLoading(false);
            onClose();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            uploadImageToCloudinary(file); // Upload to Cloudinary after selection
        }
    };
    const uploadImageToCloudinary = async (image: File) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "urji_imaginify"); // replace with your upload preset
        formData.append("cloud_name", "dtar6akzv"); // replace with your cloud name

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dtar6akzv/image/upload`, // Cloudinary upload URL
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await response.json();

            if (data.secure_url) {
                setImageUrl(data.secure_url); // Update image URL state

                // Update the customer image in formData
                setFormData((prev) => ({ ...prev, image: data.secure_url }));

                // Immediately update the customer image in the backend
                await updateCustomerImage(data.secure_url);
            } else {
                console.error("Image upload failed", data);
            }
        } catch (error) {
            console.error("Error uploading image", error);
        }
    };

    const updateCustomerImage = async (imageUrl: string) => {
        try {
            const response = await fetch(`/api/customer/${formData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageUrl }), // Only update the image field
            });

            if (!response.ok) {
                throw new Error('Failed to update customer image');
            }

            toast.success('Customer image updated successfully!');
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while updating the customer image.');
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1000px] max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Customer Details</DialogTitle>
                    <DialogDescription>
                        Detailed information about the customer.
                    </DialogDescription>
                </DialogHeader>

                {/* Personal Information Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {/* Image */}
                        <div className="col-span-1 flex items-center justify-center border rounded-md h-32 bg-gray-100">
                            <input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label htmlFor="image">
                                <img
                                    src={formData.image}
                                    alt="Customer"
                                    className="w-32 h-32 rounded-full cursor-pointer"
                                />
                            </label>
                        </div>
                        {/* Inputs */}
                        <div className="col-span-3 grid grid-cols-3 gap-4">
                            <Input
                                name="firstName"
                                id="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <Input
                                name="middleName"
                                id="middleName"
                                placeholder="Middle Name"
                                value={formData.middleName}
                                onChange={handleChange}
                            />
                            <Input
                                name="lastName"
                                id="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            <Select
                                value={formData.gender}
                                onValueChange={handleGenderChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Gender">
                                        {formData.gender}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                name="phoneNumber"
                                id="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* QR Code - Positioned Below Inputs */}
                <div className="flex justify-center mb-8">
                    <QRCodeSVG
                        value={`https://hw-fitness.vercel.app/viewCustomer/${customer._id}`} // URL containing the customer ID
                        size={256} // Size of the QR code
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        imageSettings={{
                            src: "/logo.png",
                            height: 20,
                            width: 20,
                            excavate: true,
                            opacity: 1,
                        }}
                        className="border border-gray-300 rounded-md"
                    />
                </div>



                {/* Footer */}
                <DialogFooter className="space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="py-2 px-6 text-sm font-medium text-gray-600 border border-gray-300 rounded-md"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="relative"
                    >
                        {loading && (
                            <Loader size="35px" className="animate-spin absolute left-4" />
                        )}
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewCustomerDialog;

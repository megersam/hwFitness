'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';  // Import QRCodeSVG
import { jsPDF } from "jspdf"; // Install jsPDF
import html2canvas from "html2canvas"; // Install html2canvas

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

    const FullName = `${customer.firstName} ${customer.middleName} ${customer.lastName}`;

    const downloadQRCode = async () => {
        const qrCodeElement = document.getElementById("qr-code"); // Reference to the QR code container

        if (!qrCodeElement) {
            console.error("QR code element not found");
            return;
        }

        // Convert the QR code element to a canvas
        const canvas = await html2canvas(qrCodeElement, { scale: 2 });

        // Initialize jsPDF
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL("image/png");

        // Add the QR code image to the PDF
        pdf.addImage(imgData, "PNG", 10, 10, 50, 50); // Adjust position and size as needed

        // Trigger the download
        pdf.save(`${FullName}-qr-code.pdf`); // File name
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
                <div className="flex flex-col items-center mb-8 space-y-4">
                    {/* QR Code Container */}
                    <div id="qr-code" className="border border-gray-300 rounded-md">
                        <QRCodeSVG
                            value={`https://hw-fitness.vercel.app/api/customer/${customer._id}`} // URL containing the customer ID
                            size={128} // Size of the QR code
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            imageSettings={{
                                src: "/icon.png", // Logo image
                                height: 20,
                                width: 20,
                                excavate: true,
                                opacity: 1,
                            }}
                            className="border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Button Positioned Below */}
                    <Button
                        type="button"
                        className='bg-yellow-500 text-white hover:bg-yellow-600'
                        onClick={downloadQRCode}
                    >
                        <Download size={24} className="ml-2" />
                        Download
                    </Button>
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
                        className="relative bg-yellow-500 text-white hover:bg-yellow-600"
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

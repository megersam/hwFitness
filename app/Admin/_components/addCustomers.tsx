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
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface AddCompanyProps {
  visible: boolean;
  onClose: () => void;
  onCustomerAdded: () => void;
}

interface Plan {
  _id: string;
  planName: string;
  period: number;
  discount: boolean;
  percentage: number;
  total: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}


export function AddCustomerDialog({ visible, onClose, onCustomerAdded }: AddCompanyProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Track loading state

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    paymentMethod: "",
    paymentStatus: "",
    bankAccount: "",
    total: "",
    image: "", // The URL from Cloudinary will be stored here
    nextPaymentDate: null as string | null, // Allow null or string
  });

  useEffect(() => {
    const fetchPlanPrices = async () => {
      try {
        const response = await fetch("/api/customer/plan");
        const data = await response.json();
        if (data?.prices) {
          setPlans(data.prices);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlanPrices();
  }, []);

  const calculateNextPaymentDate = (selectedPlan: Plan | undefined) => {
    if (!selectedPlan) return null;
    const now = new Date();
    if (selectedPlan.planName === "Daily") {
      now.setDate(now.getDate() + selectedPlan.period);
    } else {
      now.setMonth(now.getMonth() + selectedPlan.period);
    }
    return now.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedPlanId(selectedId);
    const selectedPlan = plans.find((plan) => plan._id === selectedId);
    if (selectedPlan) {
      setFormData({
        ...formData,
        total: selectedPlan.total.toString(),
        nextPaymentDate: calculateNextPaymentDate(selectedPlan),
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

     // Handle the image selection
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      uploadImageToCloudinary(file); // Upload to Cloudinary after selection
    }
  };
  
  // Upload the image to Cloudinary
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
        // Now you can store the `data.secure_url` (Cloudinary ID) in MongoDB
      } else {
        console.error("Image upload failed", data);
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleSubmit = ( ) => {
    setLoading(true);
   
 
    // Ensure the image URL is part of the formData when submitting
    const selectedPlan = plans.find((plan) => plan._id === selectedPlanId);
  
    // Prepare the data to be sent to the backend
    const customerData = {
      ...formData,
      image: imageUrl, // Add the image URL to the form data
      selectedPlan: selectedPlan ? selectedPlan.planName : undefined,
    };
  
    console.log(customerData); // You can log the customer data to verify
  
    // Send the form data to the backend
    fetch('/api/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData), // Send the complete data
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Customer saved:', data);
        if (data.message) {
          toast.success('Customer saved successfully!');
          onCustomerAdded(); // Trigger re-fetching the customer data
          onClose(); // Close the dialog
        } else if (data.error) {
          toast.error(`Error: ${data.error}`);
        }
      })
      .catch((error) => {
        console.error('Error saving customer:', error);
        toast.error('Failed to save customer. Please try again.');
      });
    setLoading(false);
  };


   

   


  

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Customers</DialogTitle>
        </DialogHeader>

        <div className="sm:overflow-visible overflow-y-auto max-h-[70vh] grid gap-4 py-4 px-4 sm:px-0 flex flex-col items-center justify-center">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 w-full">
          <div className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {/* Display selected image inside the circle */}
              {imageUrl ? (
                <img src={imageUrl} alt="Selected" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  
                </div>
              )}
              {/* File input for selecting or capturing image */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer z-0">
                <span className="text-white text-sm">Change</span>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center sm:text-left">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    className="w-full"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="text-center sm:text-left">
                  <Label htmlFor="middleName">Father Name</Label>
                  <Input
                    id="middleName"
                    placeholder="Enter your father name"
                    className="w-full"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="text-center sm:text-left">
                  <Label htmlFor="lastName">G. Father Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your grand father name"
                    className="w-full"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="text-center sm:text-left">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+251-966-916-168"
                    className="w-full"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="text-center sm:text-left">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                <div className="text-center sm:text-left">
                  <Label htmlFor="plan">Selected Plan</Label>
                  <select
                    id="plan"
                    className="w-full border rounded px-2 py-1"
                    onChange={handlePlanChange}
                  >
                    <option value="">Select</option>
                    {plans.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.planName} -{" "}
                        {plan.planName === "Daily"
                          ? `${plan.period} ${plan.period > 1 ? "days" : "day"}`
                          : `${plan.period} ${plan.period > 1 ? "Months" : "Month"}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-center sm:text-left mt-4">
                  <Label htmlFor="total">Total</Label>
                  <Input
                    id="total"
                    name="total"
                    placeholder="Total price"
                    value={formData.total}
                    readOnly
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="text-center sm:text-left">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select
                    id="paymentMethod"
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="CBE">CBE</option>
                    <option value="Awash">Awash</option>
                    <option value="Sinqee">Sinqee</option>
                  </select>
                </div>

                <div className="text-center sm:text-left">
                  <Label htmlFor="account">Bank Account</Label>
                  <Input id="account" name="account" readOnly className="w-full" />
                </div>

                <div className="text-center sm:text-left">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <select
                    id="paymentStatus"
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    <option value="Paid">Paid</option>
                    <option value="NotPaid">Not Paid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} type="submit">
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

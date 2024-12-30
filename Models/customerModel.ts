import mongoose, { Document, Schema } from 'mongoose';

interface Customer extends Document {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  selectedPlan: string | null;
  paymentMethod: string;
  paymentStatus: string;
  bankAccount: string;
  total: string;
  image: string; // URL from Cloudinary
  nextPaymentDate: string | null;
}

const customerSchema = new Schema<Customer>({
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  paymentMethod: { type: String},
  paymentStatus: { type: String, required: true },
  bankAccount: { type: String},
  total: { type: String, required: true },
  image: { type: String}, // Store the Cloudinary URL
  nextPaymentDate: { type: String, default: null },
});

const CustomerModel = mongoose.models.Customer || mongoose.model<Customer>('Customer', customerSchema);

export default CustomerModel;

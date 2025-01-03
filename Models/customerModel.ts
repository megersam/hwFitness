import mongoose, { Document, Schema } from 'mongoose';

interface Customer extends Document {
  firstName: string;
  middleName: string;
  lastName: string;
  image: string;
  phoneNumber: string;
  gender: string;   
  createdAt?: Date;
  updatedAt?: Date;
}

const customerSchema = new Schema<Customer>({
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  gender: { type: String, required: true },    
  image: { type: String}, // Store the Cloudinary URL 
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},
{ timestamps: true 
}
);

const CustomerModel = mongoose.models.Customer || mongoose.model<Customer>('Customer', customerSchema);
export default CustomerModel;

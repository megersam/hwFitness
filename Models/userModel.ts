// models/user.model.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the user interface
interface IUser extends Document {
  firstName: string;
  middleName: string;
  lastName: string;
  sex: string;
  phoneNumber: string;
  role: string;
  email: string;
  password: string;
  status: boolean;
}

// Define the schema for the user
const userSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    sex: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Create the User model
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;

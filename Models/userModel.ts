import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  clerkID: string;
  email: string;
  password: string;
  role: string;
  status: boolean;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  clerkID: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'employee' }, // Default value set to 'employee'
  status: { type: Boolean, default: true },    // Default value set to true
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;

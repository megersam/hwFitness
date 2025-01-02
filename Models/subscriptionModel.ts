import { ObjectId } from 'mongodb';
import mongoose, { Document, Schema, Types } from 'mongoose';

interface Subscription extends Document {
  customerId: ObjectId;
  planId: ObjectId ;
  startDate: Date; 
  endDate: Date | null; 
  paymentStatus: 'Pending' | 'Paid' | 'Not Paid';
  createdAt?: Date;
  updatedAt?: Date;
}

const subscriptionSchema = new Schema<Subscription>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    planId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Plan',
      required: true
       },
   
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null }, 
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Not Paid'], required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const SubscriptionModel =
  mongoose.models.Subscription ||
  mongoose.model<Subscription>('Subscription', subscriptionSchema);

export default SubscriptionModel;

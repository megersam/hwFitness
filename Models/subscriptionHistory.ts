import { ObjectId } from 'mongodb';
import mongoose, { Document, Schema, Types } from 'mongoose';

interface SubscriptionHistory extends Document {
  customerId: ObjectId;
  selectedPlan: string | null;
  selectedPlanPeriod: string | null;
  startDate: Date; 
  nextPaymentDate: Date | null;
  paymentMethod: string;
  paymentStatus: string;
  total: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const subscriptionHistorySchema = new Schema<SubscriptionHistory>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    selectedPlan: { 
      type: String, 
      default: null },
    selectedPlanPeriod: {
      type: String,
      default: null,
    },
    startDate: { type: Date, default: Date.now },
    nextPaymentDate: { type: Date, default: null },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    total: { type: String, required: true },
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

const SubscriptionHistoryModel =
  mongoose.models.SubscriptionHistory ||
  mongoose.model<SubscriptionHistory>('SubscriptionHistory', subscriptionHistorySchema);

export default SubscriptionHistoryModel;

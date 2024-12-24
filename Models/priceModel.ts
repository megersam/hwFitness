import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the schema
export interface IPrice extends Document {
  price?: number;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema with TypeScript types
const priceSchema: Schema<IPrice> = new Schema(
  {
    price: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
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

// Define the model with the interface
const PriceModel: Model<IPrice> =
  mongoose.models.Price || mongoose.model<IPrice>("Price", priceSchema);

export default PriceModel;

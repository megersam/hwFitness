import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the schema
export interface IPlan extends Document {
    planName?: string;
    period?: number;
    discount?: boolean;
    percentage?: number;
    price?: number;
    total?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the schema with TypeScript types
const planSchema: Schema<IPlan> = new Schema(
    {
        planName: {
            type: String,
            required: true
        },
        period: {
            type: Number,
            required: true
        },
        discount: {
            type: Boolean,
            default: false
        },
        percentage: {
            type: Number,

        },
        price: {
            type: Number,
        },
        total: {
            type: Number,
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
const PlanModel: Model<IPlan> =
    mongoose.models.Plan || mongoose.model<IPlan>("Plan", planSchema);

export default PlanModel;

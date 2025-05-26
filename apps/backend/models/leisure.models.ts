import mongoose, { Schema } from "mongoose";

const leisureSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, //
  lenderName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  }, //
  lentTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  lenderPhoneNumber: {
    type: String,
    match: /^\+?[1-9]\d{1,14}$/,
  },
  LenderEmail: {
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  lenderAddress: {
    type: String,
    trim: true,
    lowercase: true,
  },
  totalamount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  totalTimePeriod: {
    type: Number,
    required: true,
    min: 0,
    default: 1, // in months
  },
  leftOutAmount: {
    type: Number,
    required: true,
    min: 0,
  }, // amount left to be paid
  interestPercent: {
    type: Number,
    required: true,
    min: 0,
    default: 0, // in percentage
  },
  interestRecieved: {
    type: Number,
    required: true,
    min: 0,
    default: 0, // interest received so far
  },
  lendingmethod: {
    type: String,
    enum: ["CI", "SI", "Recurring"],
    default: "SI", // Compound In, Simple Interest, Recurring
  },
  isCompleted: {
    type: String,
    enum: ["complete", "pending"],
    default: "pending", // whether the lending is complete or pending
  },
  boundedVia: {
    type: String,
    enum: ["contract", "verbal", "none"],
    default: "none", // how the lending was bounded
  },
});
const Leisure = mongoose.model("Leisure", leisureSchema);
export default Leisure;
export type LeisureType = {
  userId: string;
  lenderName: string;
  lentTo?: string; // User ID of the person to whom money is lent
  lenderPhoneNumber?: string;
  LenderEmail?: string;
  lenderAddress?: string;
  totalamount: number;
  totalTimePeriod: number; // in months
  leftOutAmount?: number; // amount left to be paid
  interestPercent: number; // in percentage
  interestRecieved?: number; // interest received so far
  lendingmethod?: "CI" | "SI" | "Recurring"; // Compound In, Simple Interest, Recurring
  isCompleted?: "complete" | "pending"; // whether the lending is complete or pending
  boundedVia?: "contract" | "verbal" | "none"; // how the lending was bounded
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

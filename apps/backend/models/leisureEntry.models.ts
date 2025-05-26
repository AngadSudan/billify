import mongoose, { Schema } from "mongoose";
const leisureEntrySchema = new Schema(
  {
    leisureId: {
      type: Schema.Types.ObjectId,
      ref: "Leisure",
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    PaidAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const LeisureEntry = mongoose.model("LeisureEntry", leisureEntrySchema);
export default LeisureEntry;
export type LeisureEntryType = {
  leisureId: string;
  amountPaid: number;
  PaidAt: Date;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

import mongoose, { Schema } from "mongoose";
import { z } from "zod";

const notebookSchema = new Schema(
  {
    notebookName: {
      type: String,
      required: true,
    },
    notebookdescription: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cashFlowMechanism: {
      type: String,
      enum: ["50-30-20", "80-20", "70-20-10", "60-20-20"],
      default: "manual",
    },
  },
  { timestamps: true }
);
const Notebook = mongoose.model("Notebook", notebookSchema);
export default Notebook;
export type NotebookType = {
  notebookName: string;
  notebookdescription: string;
  createdBy: string;
  cashFlowMechanism: "50-30-20" | "80-20" | "70-20-10" | "60-20-20" | "manual";
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

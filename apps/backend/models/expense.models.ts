import mongoose, { Schema } from "mongoose";
const expenseSchema = new Schema(
  {
    spentBy: {
      // the current user who is spending
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    spentTo: {
      // the person or entity to whom the money is spent
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    spentOn: {
      // what was the task like grocery
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    notebookId: {
      type: Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);
const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
export type ExpenseType = {
  spentBy: string;
  spentTo: string;
  amount: number;
  spentOn: string;
  notebookId: string;
  tags: string[];
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

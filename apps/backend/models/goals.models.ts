import mongoose, { Schema } from "mongoose";

const goalSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goalAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  currentAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  Deadline: {
    type: Date,
    required: true,
  },
  isCompleted: {
    type: String,
    enum: ["completed", "incomplete"],
    default: "incomplete",
  },
  timeframe: {
    type: String,
    enum: ["long", "short", "mid"],
    default: "short",
  },
  dropStatus: { type: String, enum: ["active", "inactive"], default: "active" },
});

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
export type GoalType = {
  userId: string;
  goalAmount: number;
  currentAmount: number;
  Deadline: Date;
  isCompleted: "completed" | "incomplete";
  timeframe: "long" | "short" | "mid";
  dropStatus?: "active" | "inactive";
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

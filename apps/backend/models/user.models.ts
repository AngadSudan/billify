import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export interface UserType extends Document {
  name: string;
  email: string;
  password: string;
  address?: string;
  accessToken?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  generateAuthToken?: () => Promise<string>;
  comparePassword?: (candidatePassword: string) => Promise<boolean>;
}
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      lowercase: true,
    },
    accessToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET!
  );
  this.accessToken = token;
  return token;
};
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model<UserType>("User", userSchema);

export default User;
// export type UserType = {
//   name: string;
//   email: string;
//   password: string;
//   phoneNumber?: string;
//   address?: string;
//   accessToken?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
//   _id?: string;
//   isVerified?: boolean;
//   generateAuthToken?: () => Promise<string>;
//   comparePassword?: () => Promise<boolean>;
// };

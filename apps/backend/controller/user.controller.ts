import { ApiResponse } from "../utils/index.ts";
import User from "../models/user.models.ts";
import type { UserType } from "../models/user.models.ts";
import type { Request, Response } from "express";

const generateAccessToken = async (user: UserType | any): Promise<void> => {
  const userId = user._id.toString()!;
  if (!userId) {
    throw new Error("User ID is required to generate access token");
  }
  const dbUser = await User.findById(userId);
  if (!dbUser) {
    throw new Error("User not found");
  }
  const token = await user?.generateAuthToken();
  return token;
};
const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res
        .status(200)
        .json(new ApiResponse(400, "All fields are required", null));
      return;
    }

    const dbUser = await User.find({
      email: email,
    });
    if (dbUser.length > 0) {
      res.status(200).json(new ApiResponse(400, "User already exists", null));
      return;
    }

    const createdUser = await User.create({
      name,
      email,
      password,
    });

    if (!createdUser) {
      res.status(200).json(new ApiResponse(400, "User creation failed", null));
      return;
    }

    const token = await generateAccessToken(createdUser);
    res.status(200).json(
      new ApiResponse(200, "User created successfully", {
        user: createdUser,
        token,
      })
    );
    return;
  } catch (error: Error | any) {
    console.log(error);
    res
      .status(500)
      .json(
        new ApiResponse(200, error.message || "Internal Server Error", null)
      );
    return;
  }
};
const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(200)
        .json(new ApiResponse(400, "All fields are required", null));
      return;
    }

    const dbUser = await User.findOne({ email });
    if (!dbUser) {
      res.status(200).json(new ApiResponse(400, "User not found", null));
      return;
    }

    const isPasswordValid = await dbUser?.comparePassword(password);
    if (!isPasswordValid) {
      res.status(200).json(new ApiResponse(400, "Invalid credentials", null));
      return;
    }

    const token = await generateAccessToken(dbUser);
    res.status(200).json(
      new ApiResponse(200, "Login successful", {
        user: dbUser,
        token,
      })
    );
    return;
  } catch (error: Error | any) {
    console.log(error);
    res
      .status(500)
      .json(
        new ApiResponse(200, error.message || "Internal Server Error", null)
      );
    return;
  }
};
const updateUserInformation = async (req: Request, res: Response) => {
  try {
  } catch (error: Error | any) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(200, error.message || "Internal Server Error", null)
      );
  }
};
const getUserInformation = async (req: Request, res: Response) => {
  try {
  } catch (error: Error | any) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(200, error.message || "Internal Server Error", null)
      );
  }
};
const deleteUser = async (req: Request, res: Response) => {
  try {
  } catch (error: Error | any) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(200, error.message || "Internal Server Error", null)
      );
  }
};

export {
  registerUser,
  loginUser,
  updateUserInformation,
  getUserInformation,
  deleteUser,
};

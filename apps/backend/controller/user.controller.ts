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
    //TODO: Implement user information update logic
    const userId = req.user._id;
    const data = req.body;
    if (!userId) {
      res.status(400).json(new ApiResponse(400, "User ID is required", null));
      return;
    }

    const dbUser = await User.findById(userId);
    if (!dbUser) {
      res.status(404).json(new ApiResponse(404, "User not found", null));
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: data.name || dbUser.name,
        address: data.address || dbUser.address,
      },
      { new: true }
    );

    if (!updatedUser) {
      res.status(500).json(new ApiResponse(500, "Error updating user", null));
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, "User updated successfully", updatedUser));
    return;
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
    //TODO: Implement user information retrieval logic
    //TODO: DO AFTER EXPENSE SECTIONS ARE DONE
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
  const user = req.user._id;
  if (!user) {
    return res
      .status(400)
      .json(new ApiResponse(400, "User ID is required", null));
  }
  try {
    const dbUser = await User.findById(user);
    if (!dbUser) {
      return res.status(404).json(new ApiResponse(404, "User not found", null));
    }

    const deletedUser = await User.findByIdAndDelete(user);
    if (!deletedUser) {
      return res
        .status(500)
        .json(new ApiResponse(500, "Error deleting user", null));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "User deleted successfully", null));
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

//TODO: NEXT_AUTH OR PASSPORT JS for google signups

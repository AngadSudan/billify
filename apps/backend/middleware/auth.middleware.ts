import { verify } from "jsonwebtoken";
import { ApiResponse } from "../utils/index.ts";
import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  try {
    const decoded = await verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json(new ApiResponse(403, "Invalid token", null));
    return;
  }
};

export default verifyToken;

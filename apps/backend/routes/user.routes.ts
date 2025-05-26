import { Router } from "express";
import { registerUser } from "../controller/user.controller";

const userRouter = Router();
userRouter.post("/register", registerUser);

export default userRouter;

import { Router } from "express";
import type { Request, Response } from "express";
import { uploadFile } from "../utils/fileUpload.ts";
import upload from "../middleware/multer.middleware.ts";

const testingRouter = Router();

testingRouter.post(
  "/image-upload",
  upload.single("image"),
  async (req: Request & { file?: Express.Multer.File }, res: Response) => {
    try {
      console.log(req?.file);
      const response = await uploadFile(
        req?.file,
        req.file?.originalname || "default-image-name"
      );
      res.json({
        status: 200,
        message: "Image uploaded successfully",
        data: response,
      });
    } catch (error) {
      res.json({
        req,
        res,
      });
    }
  }
);
export default testingRouter;

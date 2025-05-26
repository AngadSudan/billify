import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "./utils/index.ts";
import db from "@monorepo/db";
import MonitorRoutes from "./middleware/monitor.ts";
import { testingRouter, userRouter } from "./routes/index.ts";
const app = express();
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  limit: 75,
  message: "Too many requests from this IP, please try again after 10 minutes",
});

app.use(MonitorRoutes);
app.use(helmet());
app.use("/api", limiter);
app.use(hpp());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: Bun.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remeber-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);
app.use(
  (
    error: { stack: any; status: any; message: any },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(error.stack);
    res.status(error.status || 500).json({
      status: error.status || 500,
      error: error.message || "Internal Server Error",
      ...(Bun.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
);
app.get("/", (req: Request, res: Response) => {
  res.json(
    new ApiResponse(200, "successfully hit home endpoint", {
      data: "hello there this is working now",
    })
  );
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/test", testingRouter);
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    error: "Not Found",
  });
});
db(Bun.env.MONGO_URL!)
  .then(() => {
    app.listen(Bun.env.PORT || 8000, () => {
      console.log(
        `The server has start from bun in ${Bun.env.NODE_ENV || "development"} mode at port ${Bun.env.PORT || 8000}`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  });
export default app;

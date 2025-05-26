import chalk from "chalk";
import type { Request, Response, NextFunction } from "express";
export default async function MonitorRoutes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();
  res.on("finish", () => {
    const endTime = Date.now();
    console.log(
      `${chalk.bold(req.path)} took ${chalk.green(`${endTime - startTime}ms`)} hit by ${chalk.blue(req.ip)} and statusCode ${
        res.statusCode < 400
          ? chalk.blue(res.statusCode)
          : chalk.red(res.statusCode)
      } `
    );
  });
  next();
}

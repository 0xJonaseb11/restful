import { Request, Response, NextFunction } from "express";

import { ZodError } from "zod";


export class AppError extends Error {

  constructor(
    public statusCode: number, 
    message: string
  ) {

    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

  }

}


export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err instanceof AppError) {

    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });

  }


  if (err instanceof ZodError) {

    return res.status(400).json({

      status: "fail",

      errors: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),

    });

  }


  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });

};

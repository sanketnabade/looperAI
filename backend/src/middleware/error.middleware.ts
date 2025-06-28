import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

interface ErrorResponse {
  error: string;
  details?: any;
  code?: number;
}

export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  let statusCode = 500;
  const response: ErrorResponse = {
    error: "Internal server error",
  };

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    response.error = "Validation Error";
    response.details = Object.values(err.errors).map((e) => e.message);
  }
  // Mongoose CastError (invalid ID)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    response.error = "Invalid ID format";
  }
  // Custom AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    response.error = err.message;
    if (err.code) response.code = parseInt(err.code);
  }
  // MongoDB connection error
  else if (err.name === "MongoError" || err.name === "MongoServerError") {
    statusCode = 503;
    response.error = "Database error";
  }
  // JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    response.error = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    response.error = "Token expired";
  }

  res.status(statusCode).json(response);
};

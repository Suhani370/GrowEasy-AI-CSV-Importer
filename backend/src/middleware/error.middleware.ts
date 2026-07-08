import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import multer from "multer";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        success: false,
        message: "CSV file size must not exceed 10 MB",
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error instanceof Error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
import { Request, Response } from "express";
import { parseCsvBuffer } from "../services/csv.service.js";

export const uploadAndParseCsv = (
  req: Request,
  res: Response
): void => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
      return;
    }

    const records = parseCsvBuffer(req.file.buffer);

    if (records.length === 0) {
      res.status(400).json({
        success: false,
        message: "CSV file contains no data rows",
      });
      return;
    }

    res.status(200).json({
      success: true,
      fileName: req.file.originalname,
      totalRows: records.length,
      records,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse CSV";

    res.status(400).json({
      success: false,
      message,
    });
  }
};
import express from "express";
import request from "supertest";
import multer from "multer";
import { describe, expect, it } from "vitest";
import { errorHandler } from "../src/middleware/error.middleware.js";

const app = express();

app.get("/multer-size-error", (_req, _res, next) => {
  next(new multer.MulterError("LIMIT_FILE_SIZE"));
});
app.get("/multer-generic-error", (_req, _res, next) => {
  next(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
});

app.use(errorHandler);
describe("errorHandler middleware", () => {
  it("returns 413 for file size limit errors", async () => {
    const response = await request(app)
      .get("/multer-size-error");

    expect(response.status).toBe(413);

    expect(response.body).toEqual({
      success: false,
      message: "CSV file size must not exceed 10 MB",
    });
  });
    it("returns 400 for generic Multer errors", async () => {
    const response = await request(app)
      .get("/multer-generic-error");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { uploadCsv } from "../src/middleware/upload.middleware.js";

const app = express();

app.post(
  "/upload",
  uploadCsv.single("file"),
  (req, res) => {
    res.status(200).json({
      success: true,
      filename: req.file?.originalname,
    });
  }
);
describe("uploadCsv middleware", () => {
  it("accepts a valid CSV file", async () => {
    const csv = [
      "name,email",
      "Suhani,suhani@example.com",
    ].join("\n");

    const response = await request(app)
      .post("/upload")
      .attach("file", Buffer.from(csv), {
        filename: "leads.csv",
        contentType: "text/csv",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      filename: "leads.csv",
    });
  });

  it("rejects a non-CSV file", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("file", Buffer.from("hello world"), {
        filename: "notes.txt",
        contentType: "text/plain",
      });

    expect(response.status).toBe(500);
  });
    it("rejects a CSV file larger than 10 MB", async () => {
    const oversizedCsv = Buffer.alloc(
      10 * 1024 * 1024 + 1,
      "a"
    );

    const response = await request(app)
      .post("/upload")
      .attach("file", oversizedCsv, {
        filename: "large.csv",
        contentType: "text/csv",
      });

    expect(response.status).toBe(500);
  });
  });
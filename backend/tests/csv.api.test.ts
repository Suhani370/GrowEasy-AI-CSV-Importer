import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";

describe("POST /api/csv/upload", () => {
  it("uploads and parses a valid CSV file", async () => {
    const csv = [
      "name,email,city",
      "Suhani,suhani@example.com,Patna",
      "Aman,aman@example.com,Delhi",
    ].join("\n");

    const response = await request(app)
      .post("/api/csv/upload")
      .attach("file", Buffer.from(csv), {
        filename: "leads.csv",
        contentType: "text/csv",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.fileName).toBe("leads.csv");
    expect(response.body.totalRows).toBe(2);
    expect(response.body.records).toHaveLength(2);
  });

  it("returns 400 when no file is uploaded", async () => {
    const response = await request(app).post("/api/csv/upload");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "CSV file is required",
    });
  });

  it("returns 400 when CSV contains only headers", async () => {
    const csv = "name,email,city";

    const response = await request(app)
      .post("/api/csv/upload")
      .attach("file", Buffer.from(csv), {
        filename: "empty.csv",
        contentType: "text/csv",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "CSV file contains no data rows",
    });
  });

  it("rejects non-CSV files", async () => {
    const response = await request(app)
      .post("/api/csv/upload")
      .attach("file", Buffer.from("not a csv file"), {
        filename: "notes.txt",
        contentType: "text/plain",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Only CSV files are allowed",
    });
  });
});
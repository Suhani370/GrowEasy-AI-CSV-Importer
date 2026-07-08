import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { extractCrmRecordsMock } = vi.hoisted(() => ({
  extractCrmRecordsMock: vi.fn(),
}));

vi.mock("../src/services/ai.service.js", () => ({
  extractCrmRecords: extractCrmRecordsMock,
}));

import app from "../src/app.js";

describe("POST /api/import/process", () => {
  beforeEach(() => {
    extractCrmRecordsMock.mockReset();
  });

  it("imports a valid CSV using AI extraction", async () => {
    extractCrmRecordsMock.mockResolvedValue({
      records: [
        {
          created_at: "2026-07-08T10:00:00.000Z",
          name: "Suhani",
          email: "suhani@example.com",
          country_code: "+91",
          mobile_without_country_code: "9876543210",
          company: "",
          city: "Patna",
          state: "Bihar",
          country: "India",
          lead_owner: "",
          crm_status: "GOOD_LEAD_FOLLOW_UP",
          crm_note: "",
          data_source: "leads_on_demand",
          possession_time: "",
          description: "",
        },
      ],
      skippedRecords: [],
      totalImported: 1,
      totalSkipped: 0,
    });

    const csv = [
      "FullName,Email,Phone",
      "Suhani,suhani@example.com,+919876543210",
    ].join("\n");

    const response = await request(app)
      .post("/api/import/process")
      .attach("file", Buffer.from(csv), {
        filename: "leads.csv",
        contentType: "text/csv",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.totalImported).toBe(1);
    expect(response.body.totalSkipped).toBe(0);
    expect(response.body.records).toHaveLength(1);

    expect(extractCrmRecordsMock).toHaveBeenCalledTimes(1);
  });

  it("returns 400 when no CSV file is uploaded", async () => {
  const response = await request(app).post("/api/import/process");

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "CSV file is required",
    });

    expect(extractCrmRecordsMock).not.toHaveBeenCalled();
  });

  it("returns 400 when CSV contains only headers", async () => {
    const csv = "FullName,Email,Phone";

   const response = await request(app).post("/api/import/process")

      .attach("file", Buffer.from(csv), {
        filename: "empty.csv",
        contentType: "text/csv",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "CSV contains no records",
    });

    expect(extractCrmRecordsMock).not.toHaveBeenCalled();
  });

  it("returns 500 when AI extraction fails", async () => {
    extractCrmRecordsMock.mockRejectedValue(
      new Error("AI extraction unavailable")
    );

    const csv = [
      "FullName,Email",
      "Suhani,suhani@example.com",
    ].join("\n");

    const response = await request(app).post("/api/import/process")
      .attach("file", Buffer.from(csv), {
        filename: "leads.csv",
        contentType: "text/csv",
      });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      success: false,
      message: "AI extraction unavailable",
    });

    expect(extractCrmRecordsMock).toHaveBeenCalledTimes(1);
  });
});
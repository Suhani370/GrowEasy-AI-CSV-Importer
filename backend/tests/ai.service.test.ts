import { beforeEach, describe, expect, it, vi } from "vitest";

const generateContentMock = vi.fn();

vi.mock("../src/services/ai-client.service.js", () => ({
  getAiClient: () => ({
    models: {
      generateContent: generateContentMock,
    },
  }),
}));

import { processBatch } from "../src/services/ai.service.js";

describe("processBatch", () => {
  beforeEach(() => {
    generateContentMock.mockReset();
  });

  it("processes a valid AI response", async () => {
    const batch = [
      {
        FullName: "Suhani",
        Email: "suhani@example.com",
        Phone: "+919876543210",
      },
    ];

    generateContentMock.mockResolvedValue({
      text: JSON.stringify({
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
      }),
    });

    const result = await processBatch(batch);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Suhani");
    expect(result[0].email).toBe("suhani@example.com");
    expect(result[0].crm_status).toBe(
      "GOOD_LEAD_FOLLOW_UP"
    );

    expect(generateContentMock).toHaveBeenCalledTimes(1);
  });

  it("retries after a temporary AI failure and then succeeds", async () => {
    const batch = [
      {
        FullName: "Suhani",
        Email: "suhani@example.com",
      },
    ];

    generateContentMock
      .mockRejectedValueOnce(
        new Error("Temporary AI failure")
      )
      .mockResolvedValueOnce({
        text: JSON.stringify({
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
        }),
      });

    const result = await processBatch(batch);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Suhani");

    expect(generateContentMock).toHaveBeenCalledTimes(2);
  });
  it("throws after all retry attempts fail", async () => {
  const batch = [
    {
      FullName: "Suhani",
      Email: "suhani@example.com",
    },
  ];

  generateContentMock.mockRejectedValue(
    new Error("AI service unavailable")
  );

  await expect(processBatch(batch)).rejects.toThrow(
    "AI service unavailable"
  );

  expect(generateContentMock).toHaveBeenCalledTimes(3);
});
});
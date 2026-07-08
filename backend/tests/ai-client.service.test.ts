import { afterEach, describe, expect, it } from "vitest";
import { getAiClient } from "../src/services/ai-client.service.js";

const originalApiKey = process.env.GEMINI_API_KEY;

afterEach(() => {
  if (originalApiKey === undefined) {
    delete process.env.GEMINI_API_KEY;
  } else {
    process.env.GEMINI_API_KEY = originalApiKey;
  }
});

describe("getAiClient", () => {
  it("throws when GEMINI_API_KEY is missing", () => {
    delete process.env.GEMINI_API_KEY;

    expect(() => getAiClient()).toThrow(
      "GEMINI_API_KEY is not configured"
    );
  });

  it("creates an AI client when API key exists", () => {
    process.env.GEMINI_API_KEY = "test-api-key";

    const client = getAiClient();

    expect(client).toBeDefined();
    expect(client.models).toBeDefined();
  });
});
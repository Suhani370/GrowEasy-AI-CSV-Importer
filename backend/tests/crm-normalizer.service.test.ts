import { describe, expect, it } from "vitest";
import { normalizeCrmRecord } from "../src/services/crm-normalizer.service.js";
import type { CrmRecord } from "../src/types/crm.types.js";

const baseRecord: CrmRecord = {
  created_at: "2026-07-08T10:00:00.000Z",
  name: "Suhani",
  email: "suhani@example.com",
  country_code: "+91",
  mobile_without_country_code: "9876543210",
  company: "GrowEasy",
  city: "Patna",
  state: "Bihar",
  country: "India",
  lead_owner: "Sales Team",
  crm_status: "GOOD_LEAD_FOLLOW_UP",
  crm_note: "Interested lead",
  data_source: "leads_on_demand",
  possession_time: "",
  description: "Test lead",
};
describe("normalizeCrmRecord", () => {
  it("preserves valid CRM values", () => {
    const result = normalizeCrmRecord(baseRecord);

    expect(result.crm_status).toBe("GOOD_LEAD_FOLLOW_UP");
    expect(result.data_source).toBe("leads_on_demand");
    expect(result.created_at).toBe(
      "2026-07-08T10:00:00.000Z"
    );
  });
    it("clears an invalid CRM status", () => {
    const result = normalizeCrmRecord({
      ...baseRecord,
      crm_status: "UNKNOWN_STATUS",
    });

    expect(result.crm_status).toBe("");
  });
    it("clears an invalid data source", () => {
    const result = normalizeCrmRecord({
      ...baseRecord,
      data_source: "random_source",
    });

    expect(result.data_source).toBe("");
  });
    it("clears an invalid created_at date", () => {
    const result = normalizeCrmRecord({
      ...baseRecord,
      created_at: "not-a-valid-date",
    });

    expect(result.created_at).toBe("");
  });

  it("does not mutate the original record", () => {
    const original = {
      ...baseRecord,
      crm_status: "INVALID_STATUS",
    };

    normalizeCrmRecord(original);

    expect(original.crm_status).toBe("INVALID_STATUS");
  });
});
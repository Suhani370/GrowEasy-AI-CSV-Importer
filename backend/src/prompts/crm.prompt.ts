import type { CsvRecord } from "../services/csv.service.js";

export const buildCrmExtractionPrompt = (
  records: CsvRecord[]
): string => {
  return `
You are an expert CRM data normalization engine.

Your task is to convert arbitrary CSV records into GrowEasy CRM records.

INPUT RECORDS:
${JSON.stringify(records, null, 2)}

TARGET FIELDS:
- created_at
- name
- email
- country_code
- mobile_without_country_code
- company
- city
- state
- country
- lead_owner
- crm_status
- crm_note
- data_source
- possession_time
- description

FIELD MAPPING RULES:

1. Intelligently infer fields from arbitrary column names and values.

Examples:
- Full Name, Customer Name, Lead Name, Contact Person -> name
- Email, Email Address, Mail ID -> email
- Phone, Mobile, WhatsApp Number, Contact Number -> phone information
- Organization, Business, Firm -> company
- Location may represent city, state, or country depending on its value
- Owner, Assigned To, Sales Person -> lead_owner
- Remarks, Notes, Comments, Follow-up Note -> crm_note
- Source, Campaign, Project -> data_source when confidently matched

2. CRM STATUS must be exactly one of:
- GOOD_LEAD_FOLLOW_UP
- DID_NOT_CONNECT
- BAD_LEAD
- SALE_DONE

Infer status semantically:
- interested, follow up, callback, schedule demo -> GOOD_LEAD_FOLLOW_UP
- busy, unreachable, no answer, call later -> DID_NOT_CONNECT
- not interested, invalid, rejected -> BAD_LEAD
- sold, closed, converted, deal completed -> SALE_DONE

If status cannot be confidently inferred, use an empty string.

3. DATA SOURCE must be exactly one of:
- leads_on_demand
- meridian_tower
- eden_park
- varah_swamy
- sarjapur_plots

If there is no confident semantic match, return an empty string.

4. PHONE RULES:
Separate the primary phone into:
- country_code
- mobile_without_country_code

For example:
+919876543210 becomes:
country_code: "+91"
mobile_without_country_code: "9876543210"

If multiple phone numbers exist:
- use the first as primary
- append remaining numbers to crm_note

Do not invent a country code when it cannot be confidently determined.

5. EMAIL RULES:
If multiple emails exist:
- use the first as primary
- append remaining emails to crm_note

6. DATE RULE:
created_at must be a JavaScript Date-compatible string.
Prefer ISO 8601 when possible.
If no date exists, use an empty string.

7. NOTES:
Put useful unmatched information such as:
- additional phone numbers
- additional emails
- remarks
- follow-up information
- useful comments

inside crm_note.

8. Never invent missing information.
Use an empty string for unavailable fields.

9. Preserve the input record order.

10. Return exactly one transformed object for every input record.
Do not remove invalid records yourself. Validation and skipping are handled separately by the backend.

Return only valid JSON matching the requested response schema.
`;
};
import { describe, expect, it } from "vitest";
import { parseCsvBuffer } from "../src/services/csv.service.js";

describe("parseCsvBuffer", () => {
  it("parses a valid CSV file", () => {
    const csv = [
      "name,email,city",
      "Suhani,suhani@example.com,Patna",
      "Aman,aman@example.com,Delhi",
    ].join("\n");

    const records = parseCsvBuffer(Buffer.from(csv));

    expect(records).toEqual([
      {
        name: "Suhani",
        email: "suhani@example.com",
        city: "Patna",
      },
      {
        name: "Aman",
        email: "aman@example.com",
        city: "Delhi",
      },
    ]);
  });

  it("removes UTF-8 BOM from the CSV header", () => {
    const csv = "\uFEFFname,email\nSuhani,suhani@example.com";

    const records = parseCsvBuffer(Buffer.from(csv));

    expect(records).toEqual([
      {
        name: "Suhani",
        email: "suhani@example.com",
      },
    ]);
  });

  it("trims whitespace around headers and values", () => {
    const csv =
      "name,email\n  Suhani  ,  suhani@example.com  ";

    const records = parseCsvBuffer(Buffer.from(csv));

    expect(records[0]).toEqual({
      name: "Suhani",
      email: "suhani@example.com",
    });
  });

  it("skips empty lines", () => {
    const csv =
      "name,email\nSuhani,suhani@example.com\n\nAman,aman@example.com";

    const records = parseCsvBuffer(Buffer.from(csv));

    expect(records).toHaveLength(2);
  });

  it("returns an empty array when CSV contains only headers", () => {
    const csv = "name,email,city";

    const records = parseCsvBuffer(Buffer.from(csv));

    expect(records).toEqual([]);
  });
});
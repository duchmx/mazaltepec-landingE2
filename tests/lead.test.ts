import { describe, expect, it } from "vitest";
import { cleanUtm, intakePayload, type Lead } from "@/lib/lead";

const lead: Lead = {
  id: "abc",
  name: "Ernesto Salas Pérez",
  phone: "9936000001",
  lot: "L-12",
  advisor: "eva",
  utm: { utm_source: "meta", utm_campaign: "E2_PREVENTA", utm_term: "lotes" },
  pageUrl: "https://e2.mazaltepec.com/?utm_source=meta",
  submittedAt: "2026-09-28T18:00:00.000Z",
};

describe("cleanUtm", () => {
  it("keeps known keys with string values only", () => {
    expect(cleanUtm({ utm_source: " meta ", utm_medium: 3, evil: "x", utm_content: "" })).toEqual({
      utm_source: "meta",
    });
  });

  it("returns nothing for non-objects", () => {
    expect(cleanUtm(null)).toEqual({});
    expect(cleanUtm("utm_source=meta")).toEqual({});
  });
});

describe("intakePayload", () => {
  const payload = intakePayload(lead);

  it("prefixes the idempotency key so it cannot collide with other sources", () => {
    expect(payload.external_id).toBe("e2-abc");
  });

  it("keeps the whole name in first_name", () => {
    expect(payload.first_name).toBe("Ernesto Salas Pérez");
    expect(payload).not.toHaveProperty("last_name");
  });

  it("maps the four UTM columns and keeps the rest in metadata", () => {
    expect(payload.utm_source).toBe("meta");
    expect(payload.utm_campaign).toBe("E2_PREVENTA");
    expect(payload.utm_medium).toBeNull();
    expect(payload.metadata.utm_term).toBe("lotes");
  });

  it("names the lot in the activity body when one was picked", () => {
    expect(payload.body).toContain("L-12");
    expect(intakePayload({ ...lead, lot: null }).body).toBe("Pidió informes desde e2.mazaltepec.com");
  });

  it("names the E2 form and passes the advisor code at the top level", () => {
    expect(payload.form).toBe("e2");
    expect(payload.advisor).toBe("eva");
    expect(payload.metadata).not.toHaveProperty("advisor");
  });

  it("never sends a source — the admin app derives it from the route", () => {
    expect(payload).not.toHaveProperty("source");
  });
});

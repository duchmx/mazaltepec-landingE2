import { describe, expect, it } from "vitest";
import { isValidMexicanPhone, normalizePhone } from "@/lib/phone";
import { whatsappLotUrl, whatsappUrl, WHATSAPP_NUMBER } from "@/lib/whatsapp";

const withAdvisor = { advisor: "ANA01", utm: {} };
const noAdvisor = { advisor: null, utm: {} };

describe("whatsapp links", () => {
  it("points at the sales number", () => {
    expect(whatsappUrl("general", noAdvisor)).toContain(`https://wa.me/${WHATSAPP_NUMBER}?text=`);
  });

  it("carries the advisor code for commission attribution", () => {
    expect(decodeURIComponent(whatsappUrl("visit", withAdvisor))).toContain("(ref ANA01)");
  });

  it("names the lot, and drops the empty reference when there is no advisor", () => {
    const message = decodeURIComponent(whatsappLotUrl("L-82", noAdvisor));
    expect(message).toContain("me interesa el lote L-82");
    expect(message).not.toContain("ref");
  });

  it("includes the reference when an advisor is present", () => {
    const message = decodeURIComponent(whatsappLotUrl("L-82", withAdvisor));
    expect(message).toContain("(ref ANA01)");
  });
});

describe("mexican phone validation", () => {
  it("accepts the shapes people actually type", () => {
    for (const input of [
      "9932282449",
      "993 228 2449",
      "(993) 228-2449",
      "+52 993 228 2449",
      "521 993 228 2449",
    ]) {
      expect(isValidMexicanPhone(input)).toBe(true);
      expect(normalizePhone(input)).toBe("9932282449");
    }
  });

  it("rejects short, long and malformed numbers", () => {
    for (const input of ["993228", "99322824499999", "0932282449", "abcdefghij", ""]) {
      expect(isValidMexicanPhone(input)).toBe(false);
    }
  });
});

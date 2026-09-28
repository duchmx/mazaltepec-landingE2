/**
 * The lead as the admin app's intake endpoint wants it.
 *
 * `POST {ADMIN_INTAKE_URL}` — app.mazaltepec.com/api/intake/form — creates the contact
 * (or attaches to an existing one by phone), opens a deal and logs the submission. The
 * contract lives in mazaltepec-admin `docs/intake-api.md`.
 */

export type Lead = {
  /** Idempotency key. The admin app ignores a second delivery with the same id. */
  id: string;
  name: string;
  /** 10 digits, already normalized. */
  phone: string;
  lot: string | null;
  advisor: string | null;
  utm: Record<string, string>;
  pageUrl: string;
  submittedAt: string;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id"] as const;

/** Keeps only known UTM keys with string values — the body comes from the browser. */
export function cleanUtm(raw: unknown): Record<string, string> {
  if (typeof raw !== "object" || raw === null) return {};
  const source = raw as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = source[key];
    if (typeof value === "string" && value.trim() !== "") utm[key] = value.trim().slice(0, 120);
  }
  return utm;
}

export function intakePayload(lead: Lead) {
  // The whole name goes in first_name: the form asks for one field, and guessing where a
  // Mexican name splits (two given names? two surnames?) would be wrong as often as right.
  return {
    external_id: `e2-${lead.id}`,
    first_name: lead.name,
    phone: lead.phone,
    body: lead.lot
      ? `Pidió informes del lote ${lead.lot} desde e2.mazaltepec.com`
      : "Pidió informes desde e2.mazaltepec.com",
    occurred_at: lead.submittedAt,
    utm_source: lead.utm.utm_source ?? null,
    utm_medium: lead.utm.utm_medium ?? null,
    utm_campaign: lead.utm.utm_campaign ?? null,
    utm_content: lead.utm.utm_content ?? null,
    // Files the contact under "Formulario E2" rather than the generic website form.
    form: "e2" as const,
    // The broker's ?a= code. The CRM writes it into the contact's notes for Jackie.
    advisor: lead.advisor,
    metadata: {
      form: "e2-landing",
      lot: lead.lot,
      page_url: lead.pageUrl,
      utm_term: lead.utm.utm_term ?? null,
      utm_id: lead.utm.utm_id ?? null,
    },
  };
}

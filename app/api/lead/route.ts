import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { cleanUtm, intakePayload, type Lead } from "@/lib/lead";
import { isValidMexicanPhone, normalizePhone } from "@/lib/phone";

/**
 * Delivers the lead to the admin CRM (`ADMIN_INTAKE_URL` + `INTAKE_SECRET`), and to n8n
 * (`N8N_LEAD_WEBHOOK_URL`) when that is set too. All three are server-only.
 *
 * The visitor sees the confirmation when at least one destination accepted the lead, or
 * when none is configured — the page must never break because an env var is missing.
 * Every failure is logged with the full lead, so nothing is lost that the logs can't
 * give back.
 */

export const runtime = "nodejs";

type LeadBody = {
  name?: unknown;
  phone?: unknown;
  lot?: unknown;
  company?: unknown;
  advisor?: unknown;
  utm?: unknown;
  pageUrl?: unknown;
};

function asString(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function post(label: string, url: string, headers: Record<string, string>, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`${label} answered ${response.status} ${detail.slice(0, 300)}`);
  }
}

export async function POST(request: Request) {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: accept silently so bots get no signal, but forward nothing.
  if (asString(body.company, 100) !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = asString(body.name, 120);
  const phone = asString(body.phone, 40);

  if (name.length < 2 || !isValidMexicanPhone(phone)) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const lead: Lead = {
    id: randomUUID(),
    name,
    phone: normalizePhone(phone),
    lot: asString(body.lot, 20) || null,
    advisor: asString(body.advisor, 24) || null,
    utm: cleanUtm(body.utm),
    pageUrl: asString(body.pageUrl, 500),
    submittedAt: new Date().toISOString(),
  };

  const deliveries: Promise<void>[] = [];

  const intakeUrl = process.env.ADMIN_INTAKE_URL;
  const intakeSecret = process.env.INTAKE_SECRET;
  if (intakeUrl && intakeSecret) {
    deliveries.push(post("admin intake", intakeUrl, { "x-intake-secret": intakeSecret }, intakePayload(lead)));
  } else if (intakeUrl || intakeSecret) {
    console.error("ADMIN_INTAKE_URL and INTAKE_SECRET must both be set; lead not sent to the CRM", lead);
  }

  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    deliveries.push(
      post("n8n webhook", webhookUrl, {}, { ...lead, phoneRaw: phone, source: "e2.mazaltepec.com" }),
    );
  }

  if (deliveries.length === 0) {
    console.error("No lead destination is configured; lead not forwarded", lead);
    return NextResponse.json({ ok: true, forwarded: false });
  }

  const results = await Promise.allSettled(deliveries);
  const failures = results.filter((result) => result.status === "rejected");
  for (const failure of failures) {
    console.error("Lead delivery failed", (failure as PromiseRejectedResult).reason, lead);
  }

  if (failures.length === results.length) {
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true, forwarded: true });
}

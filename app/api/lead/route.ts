import { NextResponse } from "next/server";
import { isValidMexicanPhone, normalizePhone } from "@/lib/phone";

/**
 * Forwards the lead to n8n. The webhook URL is server-only (`N8N_LEAD_WEBHOOK_URL`).
 * With no URL configured the lead is logged and the visitor still sees the confirmation —
 * the page must never break because an env var is missing.
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

  const lead = {
    name,
    phone: normalizePhone(phone),
    phoneRaw: phone,
    lot: asString(body.lot, 20) || null,
    advisor: asString(body.advisor, 24) || null,
    utm: typeof body.utm === "object" && body.utm !== null ? body.utm : {},
    pageUrl: asString(body.pageUrl, 500),
    source: "e2.mazaltepec.com",
    submittedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("N8N_LEAD_WEBHOOK_URL is not set; lead not forwarded", lead);
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error("n8n webhook rejected the lead", response.status, lead);
      return NextResponse.json({ ok: false }, { status: 502 });
    }
  } catch (error) {
    console.error("n8n webhook request failed", error, lead);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true, forwarded: true });
}

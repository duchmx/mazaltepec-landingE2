"use client";

import { useId, useState, type FormEvent } from "react";
import { buttonPrimary } from "@/components/ui";
import { visit } from "@/content/copy";
import { trackLeadSubmit } from "@/lib/analytics";
import { useAttribution } from "@/lib/useAttribution";
import { isValidMexicanPhone } from "@/lib/phone";

const copy = visit.form;

type Errors = { name?: string; phone?: string; submit?: string };

const inputClass =
  "mt-1 w-full rounded-[0.75rem] border border-cream-300 bg-cream-50 px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 focus:border-pine-800";

type LeadFormProps = {
  /** Codes currently available, resolved on the server with the same read as the plan. */
  availableLotIds: readonly string[];
};

export default function LeadForm({ availableLotIds }: LeadFormProps) {
  const attribution = useAttribution();
  const fieldId = useId();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [lot, setLot] = useState("");
  /** Honeypot: real people never see it, bots fill it in. */
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);


  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Errors = {};
    if (name.trim().length < 2) nextErrors.name = copy.errors.name;
    if (!isValidMexicanPhone(phone)) nextErrors.phone = copy.errors.phone;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          lot: lot || null,
          company,
          advisor: attribution.advisor,
          utm: attribution.utm,
          pageUrl: window.location.href,
        }),
      });

      if (!response.ok) throw new Error(`Lead request failed: ${response.status}`);

      trackLeadSubmit({ lot: lot || undefined, advisor: attribution.advisor ?? undefined });
      setSubmittedName(name.trim());
    } catch (error) {
      console.error(error);
      setErrors({ submit: copy.errors.submit });
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedName) {
    return (
      <p
        role="status"
        className="rounded-[0.75rem] border border-pine-100 bg-pine-50 p-5 text-base text-pine-800"
      >
        {copy.success.replace("{nombre}", submittedName)}
      </p>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="max-w-md">
      <div>
        <label htmlFor={`${fieldId}-name`} className="text-sm text-ink-600">
          {copy.name}
        </label>
        <input
          id={`${fieldId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${fieldId}-name-error` : undefined}
          className={inputClass}
        />
        {errors.name && (
          <p id={`${fieldId}-name-error`} className="mt-1 text-sm text-camel-700">
            {errors.name}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor={`${fieldId}-phone`} className="text-sm text-ink-600">
          {copy.phone}
        </label>
        <input
          id={`${fieldId}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${fieldId}-phone-error` : undefined}
          className={inputClass}
        />
        {errors.phone && (
          <p id={`${fieldId}-phone-error`} className="mt-1 text-sm text-camel-700">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor={`${fieldId}-lot`} className="text-sm text-ink-600">
          {copy.lot}
        </label>
        <select
          id={`${fieldId}-lot`}
          name="lot"
          value={lot}
          onChange={(event) => setLot(event.target.value)}
          className={inputClass}
        >
          <option value="">{copy.lotNone}</option>
          {availableLotIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>

      {/* Honeypot. Hidden from people and from assistive technology. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor={`${fieldId}-company`}>Empresa</label>
        <input
          id={`${fieldId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      <button type="submit" disabled={submitting} className={`${buttonPrimary} mt-6 w-full sm:w-auto disabled:opacity-70`}>
        {submitting ? copy.submitting : copy.submit}
      </button>

      {errors.submit && (
        <p role="alert" className="mt-3 text-sm text-camel-700">
          {errors.submit}
        </p>
      )}

      <p className="mt-3 text-sm leading-relaxed text-ink-400">{copy.note}</p>
    </form>
  );
}

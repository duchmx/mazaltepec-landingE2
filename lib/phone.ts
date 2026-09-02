/**
 * Mexican phone validation, shared by the form and the route handler.
 * Accepts what people actually type: spaces, dashes, parentheses, a +52 / 52 country
 * code, and the legacy mobile "1" after it.
 */

export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("52")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits;
}

/** Mexican numbers are 10 digits and never start with 0 or 1 after normalization. */
export function isValidMexicanPhone(raw: string): boolean {
  const digits = normalizePhone(raw);
  return /^[2-9]\d{9}$/.test(digits);
}

// Pure currency plumbing for the prospect report (India localization, step 2a —
// FOUNDATION only). Detects the prospect's currency from its country and formats
// money with the right symbol + digit grouping. NO economics here: this only
// changes how an existing number is DISPLAYED (a US business renders exactly as
// today with "$"; an India-detected one renders "₹" with lakh/crore grouping).
// The real rupee VALUES come in step 2b. Never throws.

export type Currency = "INR" | "USD";

// Country short-codes (ISO-3166 alpha-2) whose currency we localize. Everything
// not listed falls back to USD — so US and the rest of the world are unchanged.
const INR_COUNTRIES = new Set(["IN"]);

const LOCALE: Record<Currency, string> = { INR: "en-IN", USD: "en-US" };

/** Currency for a country short-code. India → INR; everything else → USD. */
export function currencyForCountry(country: string | null | undefined): Currency {
  return country && INR_COUNTRIES.has(country.trim().toUpperCase()) ? "INR" : "USD";
}

/**
 * Format a whole-money amount in the given country's currency. India uses INR
 * (₹) with Indian digit grouping (₹1,00,000, not ₹100,000) via `en-IN`;
 * everything else uses USD ($) with standard grouping via `en-US`. Whole numbers
 * only (report money is never fractional). Never throws — on any Intl failure it
 * falls back to the previous "$" + en-US behavior.
 */
export function formatMoney(amount: number, country?: string | null): string {
  const currency = currencyForCountry(country);
  try {
    return new Intl.NumberFormat(LOCALE[currency], {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return "$" + Math.round(amount).toLocaleString("en-US");
  }
}

/**
 * Format a per-click money amount (CPC) with cents preserved — unlike
 * formatMoney, which rounds report totals to whole numbers, a CPC like $8.58
 * loses the digit that matters if rounded to $9. Same currency detection as
 * formatMoney (India → ₹, everything else → $). Never throws.
 */
export function formatCpc(amount: number, country?: string | null): string {
  const currency = currencyForCountry(country);
  try {
    return new Intl.NumberFormat(LOCALE[currency], {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return "$" + amount.toFixed(2);
  }
}

/**
 * Best-effort country short-code for a prospect: the stored `country` column when
 * present, else a conservative parse of the Google-formatted address (whose last
 * segment is the country name, e.g. "…, Karnataka 560001, India"). Returns an
 * ISO-ish short-code ("IN") or null. Only India is disambiguated here — every
 * other/unknown case defaults to USD downstream, so US stays identical to today.
 */
export function detectCountry(input: { country?: string | null; address?: string | null }): string | null {
  const stored = input.country?.trim();
  if (stored) return stored.toUpperCase();
  const addr = input.address?.trim();
  if (addr && /(?:^|,)\s*india\s*$/i.test(addr)) return "IN";
  return null;
}

// Pure NAP (Name / Address / Phone) comparison for the citation-consistency check.
// No I/O, no server-only — the fuzzy-but-honest core, unit-tested hard. Tolerant
// of formatting noise (case, punctuation, "St" vs "Street", "Ste" vs "Suite",
// spacing) but honest about real differences (a different street number is a
// mismatch, a missing field is "missing" — never a false mismatch).

export type FieldStatus = "exact" | "partial" | "mismatch" | "missing";
export type OverallStatus = "match" | "partial" | "mismatch";

export type Nap = { name?: string | null; address?: string | null; phone?: string | null };
export type NapComparison = { name: FieldStatus; address: FieldStatus; phone: FieldStatus; overall: OverallStatus };

// ── Phone ─────────────────────────────────────────────────────────────────────
/** Normalize to a comparable 10-digit US form (drops +1 / leading 1, all punctuation).
 *  Returns null when there aren't enough digits to be a real phone. */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d.length === 10 ? d : d.length >= 7 ? d : null;
}

// ── Name ──────────────────────────────────────────────────────────────────────
/** Lowercase, "&"→"and", strip punctuation, collapse whitespace. */
export function normalizeName(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Address ───────────────────────────────────────────────────────────────────
// USPS-style abbreviation expansions (both the abbrev and full form → the full
// form) so "St"/"Street", "Ste"/"Suite", "N"/"North" compare equal.
const ADDR_EXPAND: Record<string, string> = {
  st: "street", str: "street", ave: "avenue", av: "avenue", blvd: "boulevard", rd: "road",
  dr: "drive", ln: "lane", ct: "court", cir: "circle", pl: "place", pkwy: "parkway",
  hwy: "highway", ter: "terrace", trl: "trail", sq: "square", plz: "plaza",
  ste: "suite", apt: "apartment", bldg: "building", fl: "floor", rm: "room", unit: "unit",
  n: "north", s: "south", e: "east", w: "west", ne: "northeast", nw: "northwest", se: "southeast", sw: "southwest",
};
// Tokens that carry no comparison signal (country / filler).
const ADDR_NOISE = new Set(["usa", "us", "united", "states"]);

function addressTokens(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .toLowerCase()
    .replace(/#/g, " suite ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((t) => ADDR_EXPAND[t] ?? t)
    .filter((t) => !ADDR_NOISE.has(t));
}

/** The leading street number, if the address starts with one (e.g. "123"). */
function streetNumber(tokens: string[]): string | null {
  return tokens.length && /^\d+[a-z]?$/.test(tokens[0]) ? tokens[0] : null;
}

function jaccard(a: string[], b: string[]): number {
  const sa = new Set(a);
  const sb = new Set(b);
  if (sa.size === 0 && sb.size === 0) return 1;
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter++;
  const union = new Set([...sa, ...sb]).size;
  return union === 0 ? 1 : inter / union;
}

/** Compare two address strings (either may be a full formatted line). */
export function compareAddress(a: string | null | undefined, b: string | null | undefined): FieldStatus {
  if (!a || !b) return "missing";
  const ta = addressTokens(a);
  const tb = addressTokens(b);
  if (ta.length === 0 || tb.length === 0) return "missing";

  // A differing leading street number is a hard mismatch (a different building).
  const na = streetNumber(ta);
  const nb = streetNumber(tb);
  if (na && nb && na !== nb) return "mismatch";

  const sa = new Set(ta);
  const sb = new Set(tb);
  const subset = [...sa].every((t) => sb.has(t)) || [...sb].every((t) => sa.has(t));
  if (subset) return "exact"; // one side is the other + only noise/extra tokens

  const j = jaccard(ta, tb);
  if (j >= 0.5) return "partial";
  return "mismatch";
}

export function compareName(a: string | null | undefined, b: string | null | undefined): FieldStatus {
  if (!a || !b) return "missing";
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return "missing";
  if (na === nb) return "exact";
  // One name contains the other (e.g. "Old Crow Tattoo" vs "Old Crow Tattoo Co").
  if (na.includes(nb) || nb.includes(na)) return "partial";
  const j = jaccard(na.split(" "), nb.split(" "));
  if (j >= 0.6) return "partial";
  return "mismatch";
}

export function comparePhone(a: string | null | undefined, b: string | null | undefined): FieldStatus {
  const pa = normalizePhone(a);
  const pb = normalizePhone(b);
  if (!pa || !pb) return "missing";
  return pa === pb ? "exact" : "mismatch";
}

/**
 * Compare a directory's NAP against the source of truth. `missing` fields (the
 * directory didn't provide one) never become a mismatch. Overall: any real
 * mismatch → mismatch; all present fields exact AND nothing missing → match;
 * otherwise partial.
 */
export function compareNap(source: Nap, dir: Nap): NapComparison {
  const name = compareName(source.name, dir.name);
  const address = compareAddress(source.address, dir.address);
  const phone = comparePhone(source.phone, dir.phone);
  const fields = [name, address, phone];

  let overall: OverallStatus;
  if (fields.includes("mismatch")) overall = "mismatch";
  else if (fields.every((f) => f === "exact")) overall = "match";
  else overall = "partial";

  return { name, address, phone, overall };
}

// ── Formatted-address fallback parser ─────────────────────────────────────────
export type ParsedAddress = { street: string | null; city: string | null; state: string | null; postalCode: string | null };

/**
 * Best-effort parse of a formatted US address string ("123 Main St, Austin, TX
 * 78701, USA") into components — the fallback when structured Places components
 * aren't stored (legacy / inbound-created prospects). Honest: fields it can't
 * confidently extract stay null.
 */
export function parseFormattedAddress(formatted: string | null | undefined): ParsedAddress {
  const empty: ParsedAddress = { street: null, city: null, state: null, postalCode: null };
  if (!formatted) return empty;
  const parts = formatted
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !/^(usa|us|united states)$/i.test(s));
  if (parts.length === 0) return empty;

  const street = parts[0] || null;
  const city = parts.length >= 2 ? parts[1] || null : null;
  // Last non-country segment usually holds "ST 78701" (or just a state / zip).
  const tail = parts.length >= 3 ? parts[parts.length - 1] : parts.length === 2 ? parts[1] : "";
  const stateMatch = tail.match(/\b([A-Z]{2})\b/);
  const zipMatch = tail.match(/\b(\d{5}(?:-\d{4})?)\b/);
  return {
    street,
    city: parts.length >= 3 ? city : city,
    state: stateMatch?.[1] ?? null,
    postalCode: zipMatch?.[1] ?? null,
  };
}

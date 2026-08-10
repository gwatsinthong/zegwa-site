// Pure orchestration for the citation (NAP-consistency) check — no I/O. Builds
// the per-source rows (Google baseline + OSM) from an injected lookup for the
// directory, comparing the found listing to the source of truth via the nap.ts
// helper. Never throws: a source lookup that throws is caught and rendered as a
// "not listed" finding (absence-as-finding), so the audit always completes.
//
// Yelp was removed from this check (report-rework batch 1) — Google + OSM only
// now. Yelp is still used elsewhere for prospect discovery (lib/yelp.ts, its
// own YELP_API_KEY use) — that's a separate feature and unaffected.

import { compareNap, type Nap, type FieldStatus, type OverallStatus } from "./nap";

export type CitationSourceKey = "google" | "osm";

/** The source of truth (from Google/the prospect). Address is a formatted string
 *  (structured components are compared token-wise by the nap helper). */
export type SourceNap = { name: string; address: string | null; phone: string | null };

/** A directory's returned NAP, or null when the business isn't listed there. */
export type DirectoryNap = Nap | null;

export type RowStatus = "baseline" | OverallStatus | "not_listed";

export type CitationRow = {
  source: CitationSourceKey;
  label: string;
  presence: "present" | "absent";
  status: RowStatus;
  /** What the directory shows (or nulls when not listed / field missing). */
  shown: { name: string | null; address: string | null; phone: string | null };
  /** Per-field comparison vs the source (only for present, non-baseline rows). */
  fields?: { name: FieldStatus; address: FieldStatus; phone: FieldStatus };
};

export type CitationResult = {
  checkedAt: string;
  source: SourceNap;
  rows: CitationRow[];
};

export type CitationDeps = {
  /** OSM/Nominatim → the found place's NAP (phone often absent), or null. */
  lookupOsm: (s: SourceNap) => Promise<DirectoryNap>;
  now: () => string;
};

const NULL_SHOWN = { name: null, address: null, phone: null };

async function checkSource(
  source: CitationSourceKey,
  label: string,
  truth: SourceNap,
  lookup: (s: SourceNap) => Promise<DirectoryNap>,
): Promise<CitationRow> {
  let dir: DirectoryNap = null;
  try {
    dir = await lookup(truth);
  } catch {
    dir = null; // never-throw: a failed source degrades to "not listed"
  }
  if (!dir) {
    return { source, label, presence: "absent", status: "not_listed", shown: NULL_SHOWN };
  }
  const cmp = compareNap(truth, dir);
  return {
    source,
    label,
    presence: "present",
    status: cmp.overall,
    shown: { name: dir.name ?? null, address: dir.address ?? null, phone: dir.phone ?? null },
    fields: { name: cmp.name, address: cmp.address, phone: cmp.phone },
  };
}

/** Run the full citation check. Google is the baseline ("your listing"); OSM is
 *  checked against it. Always returns a complete result. */
export async function runCitationCheck(truth: SourceNap, deps: CitationDeps): Promise<CitationResult> {
  const google: CitationRow = {
    source: "google",
    label: "Google Business Profile",
    presence: "present",
    status: "baseline",
    shown: { name: truth.name, address: truth.address, phone: truth.phone },
  };
  const osm = await checkSource("osm", "OpenStreetMap", truth, deps.lookupOsm);
  return { checkedAt: deps.now(), source: truth, rows: [google, osm] };
}

/** True when a cached citation result is still within its TTL (skip re-fetch). */
export function isCitationsFresh(cached: { checkedAt?: string } | null | undefined, ttlDays: number, nowMs: number): boolean {
  if (!cached?.checkedAt) return false;
  const t = Date.parse(cached.checkedAt);
  if (Number.isNaN(t)) return false;
  return nowMs - t < ttlDays * 86_400_000;
}

/** Cache gate: return a fresh cached result WITHOUT calling `run` (so a repeat
 *  audit of the same business never re-hits Yelp/OSM); otherwise run the live
 *  check. Pure orchestration — `run` is injected. */
export async function resolveCached(
  cached: CitationResult | null | undefined,
  ttlDays: number,
  nowMs: number,
  run: () => Promise<CitationResult>,
): Promise<CitationResult> {
  if (isCitationsFresh(cached, ttlDays, nowMs)) return cached!;
  return run();
}

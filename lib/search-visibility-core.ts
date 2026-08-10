// Pure logic for the "rich tier" search-visibility data (report-rework batch 2,
// provider swapped to DataForSEO in batch 2.1 — Ubersuggest publishes no public
// API): a lead's real vertical+city keyword (e.g. "dentist buffalo"), its real
// search volume/CPC, who actually ranks for it, whether the lead's own domain
// appears, and whether the keyword has meaningful seasonality. No I/O here —
// the server-only wiring in search-visibility.ts fetches/caches the raw
// DataForSEO responses and hands them to buildSearchVisibility below. Never
// fabricates: every field traces to a real API response, or is null/empty.
// clicks/domainAuthority are null under DataForSEO's two endpoints (see
// search-visibility.ts) — it has no clean equivalent for either in
// keywords_data/google_ads/search_volume or serp/google/organic/live/advanced,
// so they're left null rather than substituted with a different metric.

export const SEARCH_VISIBILITY_CACHE_VERSION = 1;

export type SerpResultType = "local_pack" | "organic" | "people_also_ask";

export type SerpResult = {
  title: string;
  domain: string;
  position: number;
  type: SerpResultType;
  /** Estimated monthly clicks — organic entries only. Null under DataForSEO:
   *  no clean equivalent in serp/google/organic/live/advanced (see
   *  search-visibility.ts's normalizeSerp doc comment). */
  clicks: number | null;
  /** Domain authority — organic entries only. Null under DataForSEO: no clean
   *  equivalent without a separate paid Labs/Backlinks endpoint, out of scope
   *  for the two calls this batch uses (see search-visibility.ts). */
  domainAuthority: number | null;
};

export type TrendPoint = { period: string; volume: number };

export type Seasonality = {
  peakPeriods: string[];
  peakVolume: number;
  troughVolume: number;
  /** peak / max(trough, 1), rounded to 2 decimals. */
  ratio: number;
};

export type SearchVisibilityStatus = "ok" | "no_seed" | "no_data" | "error";

/** One term's overview row — the seed itself, or one of its vertical's
 *  keyword-cluster stems (see buildKeywordCluster). Same fields as the
 *  scalar volume/cpc/monthlyClickValue above, just per-term. */
export type KeywordRow = {
  term: string;
  volume: number | null;
  cpc: number | null;
  monthlyClickValue: number | null;
};

export type SearchVisibilityResult = {
  checkedAt: string;
  version: number;
  status: SearchVisibilityStatus;
  /** "{vertical label} {city}", lowercased and normalized — null when skipped. */
  seed: string | null;
  /** The DataForSEO location_code(s) actually used, e.g. "2840" (both
   *  endpoints resolved to the same code) or "kw=2840,serp=21132" (they
   *  resolved differently — the two APIs are verified independently, since
   *  they don't necessarily share an identical location set) — null when
   *  skipped. */
  locId: string | null;
  volume: number | null;
  cpc: number | null;
  /** volume * cpc, rounded — the estimated monthly value of ranking #1. */
  monthlyClickValue: number | null;
  difficulty: number | null;
  localPackDominated: boolean;
  topResults: SerpResult[];
  /** The lead's own SERP position, if their domain appears; else null. */
  leadPosition: number | null;
  leadAppears: boolean;
  topOrganicClicks: number | null;
  topOrganicDomainAuthority: number | null;
  /** The lead's own domain authority, if their domain appears; else null. */
  leadDomainAuthority: number | null;
  trend: TrendPoint[];
  seasonality: Seasonality | null;
  /** ADDITIVE (does not replace seed/volume/cpc/monthlyClickValue above,
   *  which AI-visibility and the rank grid still depend on unchanged). The
   *  seed's full keyword cluster (seed + its vertical's KEYWORD_TEMPLATES
   *  stems), in cluster order — keywords[0] is ALWAYS the same term as
   *  `seed`, kept even when its own volume is null (the grid/AI-visibility
   *  contract needs the representative seed present as a row), so the
   *  zero-volume-drop rule below has exactly that one exception. Every
   *  OTHER term with no measurable volume is dropped — never a fabricated
   *  row. null when status !== "ok" (no seed / no data / error) — nothing
   *  to show. When only the scalar overview is available (a cache-hit or
   *  degraded-fetch path predating the cluster cache column — see Layer 4),
   *  this is a single-row array built from the scalar fields, not null and
   *  not a fabricated multi-row cluster. */
  keywords: KeywordRow[] | null;
};

/** The honest empty shape — used for every degradation path (no seed, no data,
 *  quota exhausted, fetch failure, malformed response). Never fabricated. */
export function emptySearchVisibility(
  now: () => string,
  status: SearchVisibilityStatus = "no_seed",
  seed: string | null = null,
  locId: string | null = null,
): SearchVisibilityResult {
  return {
    checkedAt: now(),
    version: SEARCH_VISIBILITY_CACHE_VERSION,
    status,
    seed,
    locId,
    volume: null,
    cpc: null,
    monthlyClickValue: null,
    difficulty: null,
    localPackDominated: false,
    topResults: [],
    leadPosition: null,
    leadAppears: false,
    topOrganicClicks: null,
    topOrganicDomainAuthority: null,
    leadDomainAuthority: null,
    trend: [],
    seasonality: null,
    keywords: null,
  };
}

// ── Seed construction ──────────────────────────────────────────────────────
// "{vertical label} {city}", lowercased. Also folds out punctuation (a vertical
// label like "Weight-loss / GLP-1 clinic" would otherwise leave a keyword with
// stray slashes/hyphens) and collapses whitespace. Missing vertical label or
// city → null (the caller skips the rich tier entirely — never guesses a seed).
export function buildSeed(verticalLabel: string | null | undefined, city: string | null | undefined): string | null {
  const v = (verticalLabel ?? "").trim();
  const c = (city ?? "").trim();
  if (!v || !c) return null;
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const seed = `${clean(v)} ${clean(c)}`.replace(/\s+/g, " ").trim();
  return seed || null;
}

// ── Keyword cluster (additive) ──────────────────────────────────────────────
// The scalar `seed` above stays the SINGLE representative term AI-visibility
// and the rank grid depend on (untouched, never rebuilt by them). This adds a
// WIDER cluster of vertical-specific service-stem terms (the caller's
// KEYWORD_TEMPLATES stems, run through the SAME buildSeed cleaning) ALONGSIDE
// it, for the report's multi-keyword table — still one DataForSEO task
// (priced per task, up to 1000 keywords, not per keyword).
//
// The seed is FORCED to the front and deduped in, rather than assumed to
// already be stems[0] — a template's own head stem is text-DIFFERENT from the
// seed for 10 of 16 verticals (e.g. seed "plumbing {city}" vs the plumbing
// template's head stem "plumber {city}"; seed "weight loss glp 1 clinic
// {city}" vs the weight_loss template's head stem "weight loss clinic
// {city}"). Only 6 of 16 (hvac, roofing, med_spa, auto_repair, landscaping,
// gym) happen to text-match. Naively using `stems.map(...)` without
// prepending the seed would silently produce a cluster whose first entry
// ISN'T the same keyword as the scalar seed for most verticals.
export function buildKeywordCluster(
  stems: readonly string[] | null,
  seed: string | null,
  city: string | null | undefined,
): string[] {
  if (!seed) return [];
  if (!stems) return [seed]; // generic (no template): head term only
  const stemTerms = stems.map((stem) => buildSeed(stem, city)).filter((t): t is string => t !== null);
  return Array.from(new Set([seed, ...stemTerms]));
}

// ── City fallback: parse a Places formatted address when addr_city is absent ──
// addr_city is populated inconsistently by source (the operator Places-search
// flow sets it from structuredAddress; the inbound-audit path only ever wrote
// the flat address string — see inbound-audit.ts's persistProspect). Rather
// than leaving the seed permanently unbuildable for those leads, this parses
// the COMMON, RELIABLE Google Places formatted-address shape:
//   "street[, extra segment(s)], city, state[ zip][, country]"
// The city is identified as the segment IMMEDIATELY BEFORE a confidently-
// recognized state/postal segment, anchored from the RIGHT rather than
// assumed to sit at a fixed position from the left — so an extra segment (a
// suite number, a neighborhood) before the city never shifts the wrong
// segment into "city":
//   "3026 Broadway, Suite 200, Oakland, CA 94611, USA" → still "Oakland",
//   because the state segment ("CA 94611") is found first and the city is
//   whatever sits directly before it, however many segments precede that.
//
// US shape: the last segment (after stripping a trailing country segment) is
// a real 2-letter USPS state code, optionally followed by a 5(+4)-digit ZIP —
// e.g. "CA 94611", "TX", "NY 10001-1234".
// India shape: India has no 2-letter state-code convention (states use full
// names, and reliably validating those would need a complete state-name
// whitelist this parser doesn't carry), so instead this recognizes a 6-digit
// PIN code in the last segment (Indian postal codes are always exactly 6
// digits — a distinctive, low-false-positive signal) — e.g. "Karnataka
// 560001". An India address with NO PIN in the string (e.g. "MG Road,
// Bengaluru, Karnataka, India") has no reliable anchor available here and
// honestly returns null rather than guessing.
//
// Deliberately conservative beyond this: an unrecognized shape (no confident
// state/postal segment, or fewer than 3 real segments) returns null — a wrong
// city produces a wrong seed and a wrong claim in the report, worse than no
// section at all.
const ADDRESS_COUNTRY_SEGMENT = /^(usa|us|united states|india)$/i;
// USPS state/territory codes — kept as a plain code set (not the full
// abbreviation-to-name mapping search-visibility-dataforseo.ts already has)
// to avoid a circular import between these two files; this list only needs to
// answer "is this token a real US state code", never a full name.
const US_STATE_CODES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
  "VA", "WA", "WV", "WI", "WY", "DC",
]);

export function parseCityFromAddress(address: string | null | undefined): string | null {
  if (!address) return null;
  const rawParts = address
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (rawParts.length === 0) return null;

  const parts =
    rawParts.length > 1 && ADDRESS_COUNTRY_SEGMENT.test(rawParts[rawParts.length - 1])
      ? rawParts.slice(0, -1)
      : rawParts;
  // Need at least street, city, AND a state/postal segment — a city can't be
  // confidently identified with fewer than 3 real segments.
  if (parts.length < 3) return null;

  const last = parts[parts.length - 1];
  const usStateMatch = last.match(/^([A-Za-z]{2})(?:\s+\d{5}(?:-\d{4})?)?$/);
  const isUsState = !!usStateMatch && US_STATE_CODES.has(usStateMatch[1].toUpperCase());
  const hasIndiaPin = /(?<!\d)\d{6}(?!\d)/.test(last);
  if (!isUsState && !hasIndiaPin) return null;

  const city = parts[parts.length - 2]?.trim();
  return city || null;
}

// ── Lead-domain matching ───────────────────────────────────────────────────
// Normalizes both sides (strip protocol, www, path, port, trailing slash,
// lowercase) and compares for EXACT equality — never a substring/`.includes()`
// match, so "smithplumbing.com" never false-matches "notsmithplumbing.com" or
// a subdomain like "blog.smithplumbing.com".
export function normalizeDomain(input: string | null | undefined): string | null {
  if (!input) return null;
  let s = input.trim().toLowerCase();
  if (!s) return null;
  s = s.replace(/^[a-z]+:\/\//, ""); // strip any scheme
  s = s.split(/[/?#]/)[0]!; // strip path/query/fragment
  s = s.replace(/:\d+$/, ""); // strip port
  s = s.replace(/^www\./, "");
  s = s.replace(/\.$/, ""); // strip a trailing dot
  return s || null;
}

export type LeadDomainMatch = {
  leadAppears: boolean;
  leadPosition: number | null;
  leadDomainAuthority: number | null;
};

export function matchLeadDomain(
  leadWebsite: string | null | undefined,
  results: readonly { domain: string; position: number; domainAuthority?: number | null }[],
): LeadDomainMatch {
  const leadDomain = normalizeDomain(leadWebsite);
  if (!leadDomain) return { leadAppears: false, leadPosition: null, leadDomainAuthority: null };
  const match = results.find((r) => normalizeDomain(r.domain) === leadDomain);
  if (!match) return { leadAppears: false, leadPosition: null, leadDomainAuthority: null };
  return { leadAppears: true, leadPosition: match.position, leadDomainAuthority: match.domainAuthority ?? null };
}

// ── Local-pack detection ───────────────────────────────────────────────────
// "Are the top results the Google map pack?" — true when any result within the
// top LOCAL_PACK_TOP_N positions is a local_pack entry. Local packs render as a
// block ABOVE organic results for local-intent queries, so a local_pack hit
// anywhere in the top few positions means the map pack, not organic listings,
// owns the top of the page.
export const LOCAL_PACK_TOP_N = 3;

export function isLocalPackDominated(results: readonly { position: number; type: SerpResultType }[]): boolean {
  return results.some((r) => r.position <= LOCAL_PACK_TOP_N && r.type === "local_pack");
}

// ── Seasonality derivation ─────────────────────────────────────────────────
// Only emit a seasonality claim when the swing is MEANINGFUL: peak >= 1.5x
// trough (SEASONALITY_RATIO_THRESHOLD). A flat trend (or fewer than 2 real
// data points) yields null rather than a manufactured "seasonal" story. Trough
// is floored to 1 before dividing (never 0) so a trough of 0 doesn't produce an
// unbounded/non-finite ratio — a real trough of 0 with any positive peak is
// still a genuine, meaningful swing, just computed against that floor.
export const SEASONALITY_RATIO_THRESHOLD = 1.5;

// A real seasonal peak is one or two standout months, never most of the
// calendar. DataForSEO's monthly_searches often backfills several trailing
// months with the SAME provisional figure while it finalizes the estimate —
// that produces many months tying at the exact max, which is a reporting
// artifact, not a genuine peak. More than this many tied months means there
// is no single peak to honestly name.
const MAX_PEAK_PERIODS = 2;

export function deriveSeasonality(trend: readonly TrendPoint[]): Seasonality | null {
  const valid = trend.filter((t) => typeof t.volume === "number" && Number.isFinite(t.volume) && t.volume >= 0);
  if (valid.length < 2) return null;

  const troughVolume = Math.min(...valid.map((t) => t.volume));
  const peakVolume = Math.max(...valid.map((t) => t.volume));
  const ratio = Math.round((peakVolume / Math.max(troughVolume, 1)) * 100) / 100;
  if (ratio < SEASONALITY_RATIO_THRESHOLD) return null;

  const peakPeriods = valid.filter((t) => t.volume === peakVolume).map((t) => t.period);
  // More than MAX_PEAK_PERIODS months tied at the max isn't a real peak worth
  // naming (see the doc comment above) — suppress rather than list most of
  // the year, which would be honest-but-useless and reads as a data error.
  if (peakPeriods.length > MAX_PEAK_PERIODS) return null;
  return { peakPeriods, peakVolume, troughVolume, ratio };
}

/** "2840" when both endpoints resolved to the same code; "kw=2840,serp=21132"
 *  when they differ (the two APIs are resolved independently). */
export function formatLocId(keywordsLocationCode: number, serpLocationCode: number): string {
  return keywordsLocationCode === serpLocationCode
    ? String(keywordsLocationCode)
    : `kw=${keywordsLocationCode},serp=${serpLocationCode}`;
}

// ── Assembly ────────────────────────────────────────────────────────────────
export type SearchVisibilityInput = {
  seed: string;
  keywordsLocationCode: number;
  serpLocationCode: number;
  volume: number | null;
  cpc: number | null;
  difficulty: number | null;
  trend: TrendPoint[];
  results: SerpResult[];
  leadWebsite: string | null | undefined;
};

/** Assemble the final result from already-normalized inputs (the raw
 *  DataForSEO JSON → these shapes happens in the wiring layer). Pure —
 *  fully covered by unit tests without any network/DB involvement. */
export function buildSearchVisibility(input: SearchVisibilityInput, now: () => string): SearchVisibilityResult {
  const { seed, keywordsLocationCode, serpLocationCode, volume, cpc, difficulty, trend, results, leadWebsite } = input;
  const locId = formatLocId(keywordsLocationCode, serpLocationCode);

  const monthlyClickValue = volume != null && cpc != null ? Math.round(volume * cpc) : null;

  const organic = results.filter((r) => r.type === "organic").sort((a, b) => a.position - b.position);
  const topOrganic = organic[0] ?? null;

  const { leadAppears, leadPosition, leadDomainAuthority } = matchLeadDomain(leadWebsite, results);

  return {
    checkedAt: now(),
    version: SEARCH_VISIBILITY_CACHE_VERSION,
    status: "ok",
    seed,
    locId,
    volume,
    cpc,
    monthlyClickValue,
    difficulty,
    localPackDominated: isLocalPackDominated(results),
    topResults: results,
    leadPosition,
    leadAppears,
    topOrganicClicks: topOrganic?.clicks ?? null,
    topOrganicDomainAuthority: topOrganic?.domainAuthority ?? null,
    leadDomainAuthority,
    trend,
    seasonality: deriveSeasonality(trend),
    // Default: a single-row array from the scalar overview — always includes
    // the seed (even with a null volume), since this is the only data every
    // "ok" path (cache hit, stale fallback, live fetch) is guaranteed to
    // have. The wiring layer overrides this with the full multi-term cluster
    // when a live cluster fetch actually captured more rows (see
    // search-visibility.ts's post-processing after this function returns).
    keywords: [{ term: seed, volume, cpc, monthlyClickValue }],
  };
}

/** True when a cached search-visibility lookup is still within its TTL. */
export function isSearchVisibilityCacheFresh(fetchedAt: string | null | undefined, ttlDays: number, nowMs: number): boolean {
  if (!fetchedAt) return false;
  const t = Date.parse(fetchedAt);
  if (Number.isNaN(t)) return false;
  return nowMs - t < ttlDays * 86_400_000;
}

// ── Cache/quota orchestration (deps-injected, so it's testable without a real
// DB or network — same pattern as competitors-core.ts's buildCompetitorContrast
// taking an injected `search`). The wiring layer (search-visibility.ts) builds
// the real deps (Supabase cache read/write, rate_limit_hit-backed quota check,
// real DataForSEO fetches, raw-response normalizers) and calls this.
export type CachedSearchVisibilityRow = {
  fetchedAt: string;
  keywordOverview: unknown;
  serpAnalysis: unknown;
};

export type NormalizedOverview = { volume: number | null; cpc: number | null; difficulty: number | null; trend: TrendPoint[] };

export type SearchVisibilityDeps = {
  now: () => string;
  ttlDays: number;
  /** Shared cache read, keyed by (seed, keywordsLocationCode, serpLocationCode)
   *  — NOT per-prospect. Two location dimensions because the two APIs are
   *  resolved INDEPENDENTLY (see resolveKeywordsLocationCode/
   *  resolveSerpLocationCode) and may land on different codes for one city. */
  getCache: (seed: string, kwLoc: number, serpLoc: number) => Promise<CachedSearchVisibilityRow | null>;
  setCache: (seed: string, kwLoc: number, serpLoc: number, row: CachedSearchVisibilityRow) => Promise<void>;
  hasApiKey: boolean;
  /** Resolves true while under the monthly quota. Only called right before an
   *  actual live fetch — a cache hit never touches it. */
  underQuota: () => Promise<boolean>;
  /** Resolve THIS lead's location to the location_code each API accepts.
   *  Independent per API — never assumed to share the other's result — and
   *  never throws: any resolution failure falls back to the country-level
   *  code internally (see search-visibility.ts). */
  resolveKeywordsLocationCode: () => Promise<number>;
  resolveSerpLocationCode: () => Promise<number>;
  fetchKeywordOverview: (seed: string, kwLoc: number) => Promise<unknown>;
  fetchSerpAnalysis: (seed: string, serpLoc: number) => Promise<unknown>;
  /** Raw DataForSEO JSON → normalized shapes. Kept out of the core so its
   *  tests never depend on DataForSEO's exact wire field names. */
  normalizeOverview: (raw: unknown) => NormalizedOverview;
  normalizeSerp: (raw: unknown) => SerpResult[];
};

/**
 * The seed → location → cache → quota → fetch → assemble pipeline, fully
 * deps-injected. Never throws past a normalizer/fetch error — any failure at
 * any stage degrades to a stale cache hit (if one exists) or
 * emptySearchVisibility() (if not). Missing vertical/city (no seed) skips
 * everything and returns empty immediately, without touching location
 * resolution, the cache, quota, or network at all.
 */
export async function resolveSearchVisibilityCore(
  input: { verticalLabel: string | null; city: string | null; leadWebsite: string | null },
  deps: SearchVisibilityDeps,
): Promise<SearchVisibilityResult> {
  const seed = buildSeed(input.verticalLabel, input.city);
  if (!seed) return emptySearchVisibility(deps.now, "no_seed", null, null);

  const [kwLoc, serpLoc] = await Promise.all([deps.resolveKeywordsLocationCode(), deps.resolveSerpLocationCode()]);
  const locId = formatLocId(kwLoc, serpLoc);

  const cached = await deps.getCache(seed, kwLoc, serpLoc);
  const fresh = isSearchVisibilityCacheFresh(cached?.fetchedAt, deps.ttlDays, Date.parse(deps.now()));

  let overviewRaw: unknown = null;
  let serpRaw: unknown = null;

  if (fresh && cached) {
    overviewRaw = cached.keywordOverview;
    serpRaw = cached.serpAnalysis;
  } else {
    const canFetch = deps.hasApiKey && (await deps.underQuota());
    if (canFetch) {
      try {
        [overviewRaw, serpRaw] = await Promise.all([
          deps.fetchKeywordOverview(seed, kwLoc),
          deps.fetchSerpAnalysis(seed, serpLoc),
        ]);
        await deps.setCache(seed, kwLoc, serpLoc, { fetchedAt: deps.now(), keywordOverview: overviewRaw, serpAnalysis: serpRaw }).catch(() => {});
      } catch {
        overviewRaw = null;
        serpRaw = null;
      }
    }
    // Live fetch skipped (no key / over quota) or failed — fall back to a
    // STALE cached row rather than nothing, when one exists.
    if ((!overviewRaw || !serpRaw) && cached) {
      overviewRaw = cached.keywordOverview;
      serpRaw = cached.serpAnalysis;
    }
  }

  if (!overviewRaw || !serpRaw) return emptySearchVisibility(deps.now, "no_data", seed, locId);

  const { volume, cpc, difficulty, trend } = deps.normalizeOverview(overviewRaw);
  const results = deps.normalizeSerp(serpRaw);
  return buildSearchVisibility(
    { seed, keywordsLocationCode: kwLoc, serpLocationCode: serpLoc, volume, cpc, difficulty, trend, results, leadWebsite: input.leadWebsite },
    deps.now,
  );
}

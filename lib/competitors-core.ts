// Pure logic for the report's NAMED COMPETITOR CONTRAST section (section 8) — no
// I/O, unit-tested. From the nearby same-category businesses Places returned, it
// excludes the prospect itself, ranks rivals by review prominence, and computes
// the prospect's STANDING (ahead / behind on review volume + rating). Never
// fabricates: only real Places fields, and the contrast is honest in EITHER
// direction (behind → concrete FOMO; ahead → "you lead now, here's the gap").
// Market-neutral: pure counts + ratings, no currency, no US-only assumptions.

import { resolveVertical, VERTICALS } from "./revenue-estimate";

/** A nearby rival as returned from Places (already searched, injected in). */
export type CompetitorCandidate = {
  placeId: string;
  name: string;
  /** Places category display name (primaryTypeDisplayName) — used to confirm this
   *  is genuinely the SAME category as the prospect, not just a popular neighbor. */
  category: string | null;
  rating: number | null;
  reviewCount: number | null;
  website: string | null;
  /** Geo coordinates, when Places returned them (it always does for a real
   *  result) — free to carry through since Places already includes location in
   *  the SAME search response the rest of this candidate comes from. Used to
   *  compute distanceMiles below; never a second, paid lookup. */
  lat?: number | null;
  lng?: number | null;
};

/** A rival as rendered in the report (website presence, not the URL). */
export type Competitor = {
  placeId: string;
  name: string;
  category: string | null;
  rating: number | null;
  reviewCount: number | null;
  hasWebsite: boolean;
  /** Straight-line distance from the prospect, in miles (haversine, computed
   *  from coordinates Places already returned in the SAME search — no extra
   *  API call). Null when either side's coordinates are unavailable. A
   *  same-category rival "5 km away" via locationBias can still legitimately be
   *  a different town in a sparse market, so this is what lets the report say
   *  so honestly instead of implying next-door adjacency. */
  distanceMiles: number | null;
};

/**
 * Cache/version stamp for a competitor result. BUMP this when the lookup's
 * shape or filtering changes so pre-fix cached rows (which lacked same-category
 * filtering and could list a mart/hotel/hospital as a "competitor") are treated
 * as stale — never served from cache and never rendered on the report. v1 rows
 * carry no version field (→ undefined → stale). v2 = same-category filtering.
 * v3 = adds distanceMiles per rival (report-rework batch 5) — pre-v3 cached
 * rows never carried coordinates, so they're re-fetched rather than rendered
 * with a permanently-missing distance.
 * v4 = splits the single "no_competitors" status into "no_competitors" (truly
 * nothing else nearby) vs "no_matching_competitors" (other businesses exist,
 * none matched category) AND widens sameCategory with the vertical-aware
 * fallback (production bug: a real HVAC rival filed under "Heating
 * contractor" shared no token with the resolved "HVAC" label and was wrongly
 * rejected) — pre-v4 rows may have wrongly-rejected real rivals or an
 * ambiguous status, so they're re-fetched rather than re-served.
 * v5 = sameCategory's vertical fallback now resolves the PROSPECT's own
 * vertical using category-then-name (via a threaded businessName), not a
 * hardcoded null — a prospect whose category alone resolves "generic" could
 * never recover via the vertical fallback before, no matter how well a rival
 * matched — pre-v5 rows may have wrongly rejected every candidate on the
 * prospect side, so they're re-fetched rather than re-served.
 * v6 = sameCategory gained a COMPETITOR-ONLY HVAC synonym widening (see
 * HVAC_COMPETITOR_SYNONYM_PATTERN below) — "heating & cooling"/"heating and
 * cooling" and "heat-pumps"/"heat pumps" phrasing now matches, which
 * resolveVertical's lead-safe name pattern deliberately does not (widening
 * that shared pattern would have moved already-audited leads' own dollar
 * estimates — see this batch's read-only investigation). Pre-v6 rows may
 * have wrongly rejected real rivals using that phrasing, so they're
 * re-fetched rather than re-served.
 */
export const COMPETITORS_CACHE_VERSION = 6;

// Mean Earth radius in miles, for the haversine distance below.
const EARTH_RADIUS_MILES = 3958.8;

/**
 * Straight-line ("as the crow flies") distance in miles between two lat/lng
 * points. Pure math, no I/O — used to turn coordinates Places already returned
 * in the SAME nearby search into an honest per-competitor distance, without a
 * second API call.
 */
export function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

// Generic words in Places category display names that carry no category meaning
// on their own (so "Dry cleaning SERVICE" still matches "Dry cleaner").
const CATEGORY_STOPWORDS = new Set([
  "service", "services", "shop", "store", "center", "centre", "agency", "company", "co", "and", "the", "of",
]);

/** Meaningful (non-generic) tokens of a Places category display name. */
function categoryTokens(category: string | null | undefined): Set<string> {
  if (!category) return new Set();
  return new Set(
    category
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ") // fold "&", "/", punctuation to spaces
      .split(/\s+/)
      .filter((t) => t && !CATEGORY_STOPWORDS.has(t)),
  );
}

/**
 * True when a Places category string carries at least one meaningful
 * (non-stopword) token — false for something like "Services", which
 * tokenizes to nothing (the production bug this feeds: a category like that
 * can never sameCategory-match anything, AND makes a poor Places search
 * query). Exported so the wiring layer (competitors.ts) can decide whether to
 * substitute the resolved vertical label as the search category instead.
 */
export function hasMeaningfulCategory(category: string | null | undefined): boolean {
  return categoryTokens(category).size > 0;
}

/**
 * Precedence rule (report-rework batch 8): prefer the RESOLVED vertical's
 * label for the competitor search ONLY when the raw category and the
 * resolved vertical genuinely disagree — never override a category that's
 * already specific and consistent with the resolved vertical, and never
 * invent a vertical when none resolved at all.
 *
 * resolveVertical (revenue-estimate.ts) always tries the category FIRST and
 * returns immediately on any match, only falling to the business-name path
 * when the category matches nothing. That means "category alone" and "the
 * full (category, then name) resolution" can only ever disagree in one way:
 * the category alone resolved to nothing (generic) while the business name
 * confidently resolved a real vertical (e.g. category "General Contractor" is
 * specific-SOUNDING but matches no vertical pattern, while the business name
 * "California HVAC" plainly does). That is exactly the production bug: a
 * specific-but-WRONG-for-this-business category was passing through
 * unchanged because the old rule only checked "is the category meaningless",
 * never "does it actually agree with what the business really is".
 *
 * So:
 *   - No vertical resolved at all (both category and name failed to match)
 *     -> keep the raw category as-is, meaningful or not. Nothing better to
 *        substitute, and this is an honest "we couldn't classify it" case.
 *   - Category alone already resolves to the SAME vertical the full
 *     resolution does -> keep the raw category (often more specific/real
 *     Places vocabulary than the vertical's generic label, e.g. "HVAC
 *     contractor" over just "HVAC").
 *   - They disagree (category alone is generic, the name fallback is what
 *     actually resolved a real vertical) -> use the resolved vertical's
 *     label. The raw category demonstrably does not describe this business.
 */
export function resolveEffectiveCategory(category: string | null, businessName: string | null): string | null {
  const resolvedVertical = resolveVertical(category, businessName);
  if (resolvedVertical === "generic") return category;
  const categoryAloneVertical = resolveVertical(category, null);
  return categoryAloneVertical === resolvedVertical ? category : VERTICALS[resolvedVertical].label;
}

/**
 * Same-category match on the Places category DISPLAY NAME both the prospect and
 * the competitor carry (primaryTypeDisplayName). A competitor matches when their
 * meaningful category tokens OVERLAP — so a "Dry cleaner" matches "Dry cleaning"
 * (shared "dry"), but NOT "Supermarket" / "Hotel" / "Hospital" (no overlap),
 * even when the unrelated business is far more popular. Language-neutral: it
 * compares whatever display strings Google returns for BOTH sides (same account/
 * locale), so it works identically for US and India prospects. Conservative by
 * design — an unknown category on either side is NOT a match (fewer honest rows
 * beat padding with a wrong-category business).
 *
 * VERTICAL-AWARE FALLBACK (production bug: Atlas Heating and Air Conditioning,
 * a 4.9-star/576-review HVAC business, showed zero competitors even though the
 * same audit's search-visibility section found two real HVAC rivals ranking in
 * the map pack for the exact same keyword). Root cause: the prospect's
 * category here is often the RESOLVED VERTICAL's own label (e.g. "HVAC", from
 * resolveEffectiveCategory when the raw Places category was generic/wrong —
 * see competitors.ts), and a real rival's Places category frequently uses a
 * SYNONYM for the same trade ("Heating contractor", "Air conditioning
 * contractor", "Furnace repair service") that shares NO literal token with the
 * bare word "hvac" — the plain token-overlap check above rejects it, even
 * though it's plainly the same trade. When the plain token check finds no
 * overlap, ALSO check whether both sides resolve to the SAME specific,
 * non-generic vertical via resolveVertical (which already encodes exactly
 * these synonyms — see VERTICAL_PATTERNS in revenue-estimate.ts) — reusing
 * that logic rather than duplicating a second synonym list. "generic" is
 * deliberately excluded on BOTH sides: without this, two unrelated businesses
 * that each fail to classify (a restaurant and a law firm, say) would falsely
 * "match" just because both resolve to the same fallback bucket.
 *
 * PROSPECT-SIDE FALLBACK (still zero rivals after the fix above): Atlas's raw
 * Places category is "General Contractor", which resolves to "generic" on
 * its own — only the business NAME ("Atlas Heating and Air Conditioning")
 * resolves "hvac". resolveEffectiveCategory (below) already applies this
 * category-then-name precedence once, upstream, and the current caller
 * (competitors.ts) does thread that resolved label in here as `prospect` —
 * but this function's own vertical fallback used to hardcode
 * resolveVertical(prospect, null), discarding any business name and making
 * the match depend ENTIRELY on the caller having pre-substituted the
 * category. That is fragile by construction: if `prospect` here is ever the
 * RAW, un-resolved category (a generic-only value with no vertical of its
 * own), this fallback could never recover, no matter how well a rival
 * matches. Accepting the prospect's business name directly and resolving it
 * with the SAME category-then-name precedence used everywhere else
 * (resolveVertical) makes this self-sufficient, not dependent on a separate
 * pre-processing step happening correctly upstream. Conservative still:
 * "generic" is excluded on both sides exactly as before — this only gives
 * the prospect's side a fair chance to resolve its REAL vertical, it never
 * loosens what counts as a match.
 *
 * CANDIDATE-SIDE FALLBACK (production bug, prospect 933d3b5c): Places
 * returned 19 candidates for Atlas's "General Contractor" query, and ALL 19
 * — including real HVAC rivals like "Oren's HVAC Services" and "Oakland
 * Furnace Heat & Air Conditioning" — shared that same vague
 * primaryTypeDisplayName. Every one was rejected "category_mismatch", the
 * identical vague category sinking real rivals right along with genuine
 * non-rivals. The prospect's own vertical survives a vague category via its
 * business name (above); a candidate's real trade is just as often only
 * legible in ITS name too — resolveVertical(candidate, candidateName) now
 * mirrors that exact category-then-name precedence for the competitor side,
 * reusing the SAME resolution function, never a second implementation.
 *
 * Applying that fallback to arbitrary Places search results is noisier than
 * applying it to one known, curated prospect being audited, though: a
 * candidate's name is far less reliably self-descriptive of its trade than
 * the prospect's own name is of itself (a broad text-query result set
 * includes HOAs, supply stores, and other non-rival entities whose names can
 * coincidentally contain a bare trade word). Confirmed empirically: the
 * production candidate list includes "280 HVAC VIEW TERRACE HOMEOWNERS" — an
 * HOA, not an HVAC contractor — whose name literally contains the word
 * "hvac" and would otherwise false-positive-match through the identical
 * regex that correctly resolves Atlas's own name. isPlausibleTradeName
 * below is the one narrow, explicitly-scoped guard against that: it doesn't
 * compete with or duplicate resolveVertical's trade classification, it only
 * excludes names that self-identify as a non-commercial-service entity
 * (a homeowners/condo/strata association) BEFORE that name is ever handed to
 * resolveVertical as a fallback signal.
 */
const NON_BUSINESS_ENTITY_NAME_PATTERN = /\bhomeowners?\b|\bhoa\b|\bcondo(?:minium)? association\b|\bstrata\b/i;

/** False for a name that self-identifies as a non-commercial-service entity
 *  (a homeowners/condo/strata association) — see sameCategory's doc comment.
 *  Never used to REJECT a real candidate on its own; only to decide whether
 *  a name is trustworthy as a resolveVertical fallback signal at all. */
function isPlausibleTradeName(name: string | null): boolean {
  if (!name) return true; // nothing to disqualify it on
  return !NON_BUSINESS_ENTITY_NAME_PATTERN.test(name);
}

// ── Competitor-only trade-synonym widening (HVAC) ──────────────────────────
// Production bug (933d3b5c): real HVAC rivals whose names use phrasing
// outside VERTICAL_PATTERNS.name's deliberately narrow set were still
// rejected after the vertical-fallback fix above — "3rdGen Heating &
// Cooling" / "Oakland Heating & Cooling Service" (VERTICAL_PATTERNS.name only
// recognizes "heating and/& AIR", not "heating and/& cooling") and
// "1-888-Heat-Pumps" (only "heat pump", not the hyphenated/plural form).
//
// Widening VERTICAL_PATTERNS.name itself was considered and REJECTED (see
// this batch's read-only investigation): resolveVertical runs on the LEAD at
// three sites (estimateRevenueLeak's vertical-band selection,
// search-visibility.ts's seed label, ai-visibility.ts's seed label), and the
// revenue estimate is recomputed LIVE at report-render time with no cache —
// widening the shared pattern would have instantly moved dollar figures for
// already-audited, already-sent leads the moment this shipped.
//
// So this is a SEPARATE, COMPETITOR-CLASSIFICATION-ONLY signal: it is called
// ONLY from sameCategory below, is NEVER passed to resolveVertical, and MUST
// NEVER be imported by revenue-estimate.ts, search-visibility.ts,
// ai-visibility.ts, or any report copy path. See
// competitor-only-hvac-synonym-guard.test.ts for the source-level guard on
// that boundary, and competitors-candidate-name-fallback.test.ts for the full
// 19-candidate acceptance/rejection fixture.
const HVAC_COMPETITOR_SYNONYM_PATTERN = /heating (?:and|&) cooling|heat[\s-]?pumps?/;

/** True when a competitor's NAME uses an HVAC trade synonym recognized only
 *  for competitor classification (see HVAC_COMPETITOR_SYNONYM_PATTERN above).
 *  Reuses the SAME non-business-entity guard as the resolveVertical name
 *  fallback (isPlausibleTradeName) — an HOA whose name happens to contain a
 *  trade word must not false-positive-match here either. */
function isHvacBySynonym(name: string | null): boolean {
  if (!name || !isPlausibleTradeName(name)) return false;
  return HVAC_COMPETITOR_SYNONYM_PATTERN.test(name.toLowerCase());
}

export function sameCategory(
  prospect: string | null,
  competitor: string | null,
  prospectBusinessName?: string | null,
  competitorBusinessName?: string | null,
): boolean {
  const a = categoryTokens(prospect);
  const b = categoryTokens(competitor);
  if (a.size > 0 && b.size > 0) {
    for (const t of a) if (b.has(t)) return true;
  }
  const prospectVertical = resolveVertical(prospect, prospectBusinessName);
  if (prospectVertical === "generic") return false;
  const competitorNameFallback = isPlausibleTradeName(competitorBusinessName ?? null) ? competitorBusinessName : null;
  if (prospectVertical === resolveVertical(competitor, competitorNameFallback)) return true;
  // Competitor-only widening: only ever ADDS an accept on top of the
  // resolveVertical-based match above, never used to reject, never applied
  // to the prospect side.
  return prospectVertical === "hvac" && isHvacBySynonym(competitorBusinessName ?? null);
}

/** Where the prospect sits among the nearby rivals. */
export type CompetitorStanding = {
  /** Prospect + shown rivals (the ranked field size). */
  total: number;
  /** 1-based rank of the prospect by review count (1 = most reviews). Null when
   *  the prospect's own review count is unknown. */
  reviewRank: number | null;
  /** Prospect's review count ≥ every rival's (a tie counts as leading). */
  leadsReviews: boolean;
  /** Prospect's rating ≥ every rival's (both known; a tie counts as leading). */
  leadsRating: boolean;
  /** The rival with the most reviews (the one to beat), or null if none known. */
  topByReviews: Competitor | null;
  /** How many more reviews the top rival has than the prospect, when the prospect
   *  is behind on a known count; null when level/ahead or the count is unknown. */
  reviewGapToTop: number | null;
};

export type CompetitorResult = {
  checkedAt: string;
  /** Filtering-logic version (see COMPETITORS_CACHE_VERSION). Absent on v1 rows. */
  version: number;
  /**
   * "no_competitors" and "no_matching_competitors" are two DIFFERENT honest
   * facts, deliberately not collapsed into one (production bug: a report
   * claimed "the top spot is up for grabs" for a business whose own audit
   * separately found two real rivals via search-visibility — the Places
   * lookup here had simply rejected them on a category-token mismatch, which
   * is NOT the same thing as a genuinely empty market):
   *   "no_competitors" — the nearby search found NOTHING ELSE nearby at all
   *     (after excluding the prospect itself) — the closest this lookup can
   *     get to confirming a genuinely sparse market.
   *   "no_matching_competitors" — the nearby search found OTHER businesses,
   *     but none matched the prospect's category — other commerce exists
   *     nearby, our lookup just couldn't confirm a same-trade rival. This is
   *     NOT evidence of an open market and must never be framed as one.
   */
  status: "ok" | "no_location" | "no_competitors" | "no_matching_competitors" | "error";
  self: { rating: number | null; reviewCount: number | null };
  competitors: Competitor[];
  standing: CompetitorStanding | null;
};

export type CompetitorInput = {
  self: { placeId: string | null; rating: number | null; reviewCount: number | null };
  category: string | null;
  /** The prospect's business name — the SAME fallback signal
   *  resolveEffectiveCategory already uses for vague/wrong raw categories.
   *  Threaded through to sameCategory's own vertical fallback so it can
   *  resolve the prospect's real vertical directly (category first, then
   *  name), rather than depending entirely on `category` above already
   *  being pre-substituted by the caller. Optional — omitted (or null)
   *  simply means no fallback signal is available, same as today. */
  businessName?: string | null;
  lat: number | null;
  lng: number | null;
};

export type CompetitorDeps = {
  now: () => string;
  /** Nearby same-category businesses. May throw / return [] — handled here. */
  search: (category: string, lat: number, lng: number) => Promise<CompetitorCandidate[]>;
};

// Exported ONLY so lib/competitors.ts's lookup diagnostics can describe why a
// same-category, non-self candidate still didn't make the final list (ranked
// outside this cap) — not read by any decision logic outside this file.
export const MAX_COMPETITORS = 5;

/** Rank rivals: most-reviewed first (unknown counts last), then higher-rated. */
function rankByProminence(a: Competitor, b: Competitor): number {
  const ar = a.reviewCount ?? -1;
  const br = b.reviewCount ?? -1;
  if (br !== ar) return br - ar;
  return (b.rating ?? -1) - (a.rating ?? -1);
}

/** Compute the prospect's standing among the shown rivals (pure). */
export function computeStanding(
  self: { rating: number | null; reviewCount: number | null },
  competitors: Competitor[],
): CompetitorStanding {
  const withReviews = competitors.filter((c) => c.reviewCount != null);
  const topByReviews = withReviews.length
    ? withReviews.reduce((best, c) => (c.reviewCount! > (best.reviewCount ?? -1) ? c : best))
    : null;

  const leadsReviews =
    self.reviewCount != null && competitors.every((c) => c.reviewCount == null || self.reviewCount! >= c.reviewCount);
  const leadsRating =
    self.rating != null && competitors.every((c) => c.rating == null || self.rating! >= c.rating);

  // Rank by review count: how many rivals have strictly more reviews than us.
  const reviewRank =
    self.reviewCount == null ? null : 1 + competitors.filter((c) => (c.reviewCount ?? 0) > self.reviewCount!).length;

  const reviewGapToTop =
    topByReviews?.reviewCount != null && self.reviewCount != null && topByReviews.reviewCount > self.reviewCount
      ? topByReviews.reviewCount - self.reviewCount
      : null;

  return {
    total: competitors.length + 1,
    reviewRank,
    leadsReviews,
    leadsRating,
    topByReviews,
    reviewGapToTop,
  };
}

// ── competitor_note (audit-facing, outreach-ready single sentence) ────────────
// A separate, stricter contrast from `computeStanding` above: `standing` fires
// on ANY gap (even 1 review) for the report's own framing; `competitor_note` is
// for cold outreach copy, so it only fires when the gap clears a MEANINGFULNESS
// floor — a 1-review or 0.1-star gap reads as noise in a cold email, not signal.

/** Reviews the top competitor must lead by for a review-count note. */
export const NOTE_REVIEW_GAP_FLOOR = 25;
/** Stars the top-rated CREDIBLE competitor must lead by for a rating note. */
export const NOTE_RATING_GAP_FLOOR = 0.3;
/** Minimum review count for a competitor's rating to count as credible (not a
 *  5.0 from 2 reviews). */
export const NOTE_RATING_CREDIBILITY_MIN_REVIEWS = 10;

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * The strongest TRUE review/rating contrast against the prospect, as a single
 * outreach-ready sentence — or "" when nothing clears the meaningfulness floor.
 * Order: (a) the competitor with the most reviews, if their lead is >= 25
 * reviews; else (b) the highest-rated CREDIBLE competitor (>= 10 reviews), if
 * their rating leads by >= 0.3 stars; else "". Never fires when the prospect is
 * level or ahead — both branches require a strictly positive, floor-clearing
 * gap. Ratings are rounded to 1 decimal before comparing AND displaying, so the
 * printed numbers and the floor check always agree.
 */
export function computeCompetitorNote(
  self: { rating: number | null; reviewCount: number | null },
  competitors: { name: string; rating: number | null; reviewCount: number | null }[],
): string {
  if (!competitors || competitors.length === 0) return "";

  // (a) Review-count contrast: the competitor with the most reviews.
  if (self.reviewCount != null) {
    const withReviews = competitors.filter((c) => c.reviewCount != null);
    if (withReviews.length > 0) {
      const top = withReviews.reduce((best, c) => (c.reviewCount! > best.reviewCount! ? c : best));
      const diff = top.reviewCount! - self.reviewCount;
      if (diff >= NOTE_REVIEW_GAP_FLOOR) {
        return `${top.name} has ${diff} more Google reviews than you`;
      }
    }
  }

  // (b) Rating contrast: the highest-rated credible competitor.
  if (self.rating != null) {
    const selfRating = round1(self.rating);
    const credible = competitors.filter(
      (c) => c.rating != null && c.reviewCount != null && c.reviewCount >= NOTE_RATING_CREDIBILITY_MIN_REVIEWS,
    );
    if (credible.length > 0) {
      const top = credible.reduce((best, c) => (c.rating! > best.rating! ? c : best));
      const topRating = round1(top.rating!);
      // Round the DIFFERENCE too — 4.6 - 4.3 is 0.2999999999999998 in float
      // arithmetic, which would wrongly miss an exact 0.3 floor.
      if (round1(topRating - selfRating) >= NOTE_RATING_GAP_FLOOR) {
        return `${top.name} holds a ${topRating.toFixed(1)} to your ${selfRating.toFixed(1)} on Google`;
      }
    }
  }

  return "";
}

/**
 * Build the competitor-contrast payload. Never throws — a missing location, a
 * failed Places search, or an empty result each degrade to an honest status.
 */
export async function buildCompetitorContrast(input: CompetitorInput, deps: CompetitorDeps): Promise<CompetitorResult> {
  const self = { rating: input.self.rating, reviewCount: input.self.reviewCount };
  const base = { checkedAt: deps.now(), version: COMPETITORS_CACHE_VERSION, self };

  if (!input.category || input.lat == null || input.lng == null) {
    return { ...base, status: "no_location" as const, competitors: [], standing: null };
  }

  let candidates: CompetitorCandidate[];
  try {
    candidates = await deps.search(input.category, input.lat, input.lng);
  } catch {
    return { ...base, status: "error" as const, competitors: [], standing: null };
  }

  // Exclude the prospect itself (by Google place_id) and unnamed rows FIRST —
  // this count (before the category filter) is what distinguishes "genuinely
  // nothing else nearby" from "other businesses exist, none matched category"
  // below.
  const others = (Array.isArray(candidates) ? candidates : []).filter(
    (c) => c.placeId && c.name && c.placeId !== input.self.placeId,
  );

  const competitors: Competitor[] = others
    // SAME-CATEGORY GATE: Places' nearby search returns popular neighbors that
    // aren't real rivals (a mega mart / hotel / hospital next to a dry cleaner).
    // Keep ONLY businesses whose Places category actually matches the prospect's —
    // BEFORE ranking, so a 2,000-review supermarket can't crowd in on review count.
    .filter((c) => sameCategory(input.category, c.category, input.businessName, c.name))
    .map((c) => ({
      placeId: c.placeId,
      name: c.name,
      category: c.category ?? null,
      rating: c.rating ?? null,
      reviewCount: c.reviewCount ?? null,
      hasWebsite: !!c.website,
      // Free: both sides' coordinates already came back on the SAME Places
      // search this candidate is from. Null (never a fabricated 0) when either
      // side's coordinates are missing.
      distanceMiles:
        input.lat != null && input.lng != null && c.lat != null && c.lng != null
          ? haversineMiles(input.lat, input.lng, c.lat, c.lng)
          : null,
    }))
    .sort(rankByProminence)
    .slice(0, MAX_COMPETITORS);

  // Sparse market (common in India + small US towns): no genuine same-category
  // rival is an HONEST finding (low local competition), not a reason to pad the
  // list with wrong-category businesses to hit a target count. Two DIFFERENT
  // honest facts here, deliberately not collapsed (see CompetitorResult's doc
  // comment): nothing else nearby at all vs. other businesses nearby that
  // simply didn't match this category.
  if (competitors.length === 0) {
    const status = others.length === 0 ? ("no_competitors" as const) : ("no_matching_competitors" as const);
    return { ...base, status, competitors: [], standing: null };
  }

  return { ...base, status: "ok" as const, competitors, standing: computeStanding(self, competitors) };
}

/** True when a cached competitor result is still within its TTL. */
export function isCompetitorsFresh(cached: { checkedAt?: string } | null | undefined, ttlDays: number, nowMs: number): boolean {
  if (!cached?.checkedAt) return false;
  const t = Date.parse(cached.checkedAt);
  if (Number.isNaN(t)) return false;
  return nowMs - t < ttlDays * 86_400_000;
}

/**
 * Cache gate: return a fresh cached result WITHOUT running the live Places search
 * (so a repeat/inbound audit of the same place_id never re-queries the paid API).
 * A cache is pinned only when it is fresh, actually FOUND competitors (status
 * "ok"), AND was built by the CURRENT filtering version — so pre-fix rows (which
 * could contain wrong-category businesses) are re-fetched, never re-served. A
 * degraded run (no_location / no_competitors / error) is also retried next audit.
 */
export async function resolveCompetitorsCached(
  cached: CompetitorResult | null | undefined,
  ttlDays: number,
  nowMs: number,
  run: () => Promise<CompetitorResult>,
): Promise<CompetitorResult> {
  if (
    isCompetitorsFresh(cached, ttlDays, nowMs) &&
    cached!.status === "ok" &&
    cached!.version === COMPETITORS_CACHE_VERSION
  ) {
    return cached!;
  }
  return run();
}

// ── Competitor-lookup diagnostics (log-only) ─────────────────────────────────
// Two prior fix cycles on sameCategory did not change the production symptom
// for "Atlas Heating and Air Conditioning" (status no_matching_competitors, 0
// candidates persisted), and the stored payload keeps no record of what
// Places actually returned — so we can't tell whether Places returned zero
// candidates at all, or returned candidates the category filter rejected.
// Pure, no I/O, so it's directly unit-tested here rather than only reachable
// through lib/competitors.ts (which is `server-only`). Never influences the
// actual lookup's control flow or result — see lib/competitors.ts's
// resolveCompetitors for how this is wired to the real Places response and
// logged.

/** A raw Places candidate, as far as these diagnostics need to know about it —
 *  a narrower shape than lib/places.ts's PlaceResult so this file doesn't
 *  depend on that module. */
export type RawPlacesCandidate = {
  placeId: string | null | undefined;
  name: string | null | undefined;
  category: string | null | undefined;
  primaryType?: string | null;
  types?: string[];
};

/** Mirrors resolveEffectiveCategory's OWN category-then-name precedence
 *  exactly (same function, same order, same equality check) — describes,
 *  for logging, WHICH signal actually produced the resolved vertical. Never
 *  a second, divergent resolution rule. */
export function classifyVerticalSource(
  category: string | null,
  businessName: string | null,
): { resolvedVertical: string; verticalSource: "category" | "name_fallback" | "unresolved" } {
  const resolvedVertical = resolveVertical(category, businessName);
  if (resolvedVertical === "generic") return { resolvedVertical, verticalSource: "unresolved" };
  const categoryAlone = resolveVertical(category, null);
  return { resolvedVertical, verticalSource: categoryAlone === resolvedVertical ? "category" : "name_fallback" };
}

export type CompetitorRejectReason = "category_mismatch" | "self_match" | "distance" | "no_rating" | "dedupe" | "other";

export type LoggedCompetitorCandidate = {
  name: string;
  primaryType: string | null;
  types: string[];
  accepted: boolean;
  rejectReason: CompetitorRejectReason | null;
  rejectDetail?: string;
};

/** Classifies ONE raw Places candidate for the log line, purely by asking the
 *  SAME questions buildCompetitorContrast asks internally (self-match by
 *  placeId, then sameCategory) — never a re-derivation with different rules.
 *  A candidate that clears both but still isn't in the accepted set was cut
 *  by the MAX_COMPETITORS ranking cap, the only remaining exclusion. */
export function classifyCandidate(
  raw: RawPlacesCandidate,
  selfPlaceId: string | null,
  effectiveCategory: string | null,
  businessName: string | null,
  acceptedPlaceIds: ReadonlySet<string>,
): LoggedCompetitorCandidate {
  const base = { name: raw.name ?? "", primaryType: raw.primaryType ?? null, types: raw.types ?? [] };
  if (raw.placeId && acceptedPlaceIds.has(raw.placeId)) {
    return { ...base, accepted: true, rejectReason: null };
  }
  if (!raw.placeId || !raw.name) {
    return { ...base, accepted: false, rejectReason: "other", rejectDetail: "missing placeId or name" };
  }
  if (raw.placeId === selfPlaceId) {
    return { ...base, accepted: false, rejectReason: "self_match" };
  }
  if (!sameCategory(effectiveCategory, raw.category ?? null, businessName, raw.name)) {
    return { ...base, accepted: false, rejectReason: "category_mismatch" };
  }
  return {
    ...base,
    accepted: false,
    rejectReason: "other",
    rejectDetail: `ranked outside the retained top ${MAX_COMPETITORS} by review count`,
  };
}

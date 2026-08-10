// Pure, deterministic helpers for the shareable prospect report's new sections
// (the-one-thing, do-nothing delta, fix-mapped). All compute from the existing
// revenue-estimate breakdown — no new data sources. Unit-tested in
// report-sections.test.ts.

import { resolveGapTypeFromArea, type GapContribution, type GapType } from "./revenue-estimate";
import type { Seasonality } from "./search-visibility-core";
import type { ProspectSignals } from "./signals";
import { WEAK_REVIEWS_MIN_RATING, WEAK_REVIEWS_MIN_COUNT } from "./scoring";

// ── Found vs Capture clustering ───────────────────────────────────────────────
// CAPTURE = RESPONSE gaps: the business isn't answering/converting the demand it
// already has (missed / after-hours calls, no click-to-call, no booking, no
// contact path). Everything else is a FOUND = PRESENCE gap (website, GBP, reviews,
// SEO/speed, freshness). Capture dollars are ESTIMATES from external proxies (we
// can't see real call data) — the report must label them as such.
export const CAPTURE_GAPS: ReadonlySet<GapType> = new Set<GapType>([
  "no_booking",
  "no_click_to_call",
  "no_contact_form",
]);

export type Cluster = "found" | "capture";

export function clusterOf(gapType: GapType): Cluster {
  return CAPTURE_GAPS.has(gapType) ? "capture" : "found";
}

// ── Corroboration guard (production bug: Atlas Heating, 933d3b5c) ─────────────
// The LLM's free-text "What we found" gaps (audit.gaps) no longer feed the
// dollar model (see revenue-estimate.ts's resolveContributors), but they
// still render as narrative findings — and the LLM was given the SAME real
// signals in its prompt yet still wrote "No Google Business Profile signals
// detected... invisible in local search" for a business with a real, 576-
// review, 4.9-star profile shown two sections above. Nothing checked an LLM
// finding against the real signal for its own claimed gap before rendering
// it. This is that check.
//
// Mirrors scoring.ts's scoreProspect EXACTLY — same fields, same thresholds,
// never a second/diverging definition of "is this gap real" — so a finding
// is suppressed if and only if the deterministic scorer would also not have
// fired that gap for this business.
//
// Corroborated (has a clean, direct 1:1 signal in scoring.ts): no_website,
// weak_gbp, weak_reviews, no_booking, no_contact_form, no_click_to_call,
// slow_site, stale_site — every GapType revenue-estimate.ts defines. There is
// currently no GapType left over with "no clean signal to check against";
// the function still defaults to `false` (never contradicts) for anything
// it doesn't recognize, so a future GapType added without a mapped signal is
// never over-suppressed by accident, per the "allow through" rule.
export function gapContradictsSignals(gapType: GapType, signals: ProspectSignals | null | undefined): boolean {
  if (!signals) return false; // nothing to check against → never suppress
  const w = signals.website;
  switch (gapType) {
    case "no_website":
      return w !== null; // claims no website, but one was fetched
    case "weak_gbp":
      return signals.places.likelyUnclaimed.gap !== true;
    case "weak_reviews": {
      const lowRating = signals.places.rating != null && signals.places.rating < WEAK_REVIEWS_MIN_RATING;
      const fewReviews = signals.places.reviewCount != null && signals.places.reviewCount < WEAK_REVIEWS_MIN_COUNT;
      return !(lowRating || fewReviews);
    }
    // The remaining types are only checkable when a site was actually
    // fetched (scoring.ts only fires them for w !== null too) — w === null
    // means "can't confirm either way," so it falls through to `false`
    // (never suppress) rather than being treated as a contradiction.
    case "no_booking":
      return w !== null && w.booking.gap !== true;
    case "no_contact_form":
      return w !== null && w.contactForm.gap !== true;
    case "no_click_to_call":
      return w !== null && w.clickToCall.gap !== true;
    case "slow_site":
      return w !== null && signals.performance.gap !== true && w.mobileResponsive.gap !== true;
    case "stale_site":
      return w !== null && w.staleSite.gap !== true;
    default:
      return false;
  }
}

/** Whether an LLM-authored gap finding (audit.gaps[].area) should render,
 *  given the SAME audit's real signals. False only when the finding's text
 *  keyword-resolves (via the SAME resolveGapTypeFromArea the dollar model no
 *  longer uses, but the report-copy classification still shares) to a
 *  GapType whose real signal contradicts the claim. Text that doesn't
 *  keyword-match any GapType always renders — this guard only ever
 *  SUPPRESSES a specific, checkable contradiction, never a general "unsure"
 *  finding. */
export function findingIsCorroborated(area: string, signals: ProspectSignals | null | undefined): boolean {
  const type = resolveGapTypeFromArea(area);
  if (!type) return true;
  return !gapContradictsSignals(type, signals);
}

// ── Section 2: "the one thing" ────────────────────────────────────────────────
/** The single highest-dollar gap (by midpoint) — the one thing to fix first.
 *  Returns null for an empty breakdown (thin-data prospect → section hides). */
export function pickTopGap(breakdown: GapContribution[]): GapContribution | null {
  if (!breakdown || breakdown.length === 0) return null;
  return breakdown.reduce((best, g) => (g.midpoint > best.midpoint ? g : best), breakdown[0]);
}

// ── Section 4: "the gaps, worst first" ────────────────────────────────────────
/** Dedupe the LLM's free-text `gaps` before the worst-first list renders them.
 *  The model occasionally emits the SAME gap twice (identical `area`, e.g. "No
 *  Website"), which renders as two identical stacked cards — and because the #1
 *  worst gap is also the "one thing," it reads as the one-thing card duplicated.
 *  Collapse by normalized area (case-insensitive, trimmed; falling back to the
 *  finding text when a gap has no area), keeping the first occurrence but
 *  preferring one that actually carries a `finding`. Pure text dedupe — no locale
 *  assumptions, identical for US and India reports. Does NOT touch economics: the
 *  revenue estimate dedupes independently, by gap TYPE, in resolveContributors. */
export function dedupeGaps<T extends { area?: string | null; finding?: string | null }>(gaps: readonly T[]): T[] {
  const byKey = new Map<string, T>();
  const unkeyed: T[] = [];
  for (const g of gaps ?? []) {
    const key = ((g.area ?? "").trim() || (g.finding ?? "").trim()).toLowerCase();
    if (!key) {
      unkeyed.push(g); // nothing to key on → keep as-is (can't be a confident dupe)
      continue;
    }
    const existing = byKey.get(key);
    if (!existing) byKey.set(key, g);
    else if (!existing.finding && g.finding) byKey.set(key, g); // prefer the richer copy
  }
  return [...byKey.values(), ...unkeyed];
}

// ── Section 1 (report-rework batch 1, refined batch 1.5): the visceral opener ─
// Leads the report with the single most striking REAL finding for this lead,
// not a dollar figure — but only when a STRONG trigger genuinely fires
// (batch 1.5's honesty gate). A lead in decent shape (only medium/low-severity
// gaps, or none at all) gets a calm, truthful opener instead of a manufactured
// one — promoting a minor gap into a dramatic headline is dishonest. Every
// branch traces to a real per-lead fact; nothing here is invented. Always
// returns an opener (there is always something honest to say, even for a
// clean lead), so the caller no longer needs a null-fallback path.
export type VisceralOpenerKind = "no_site" | "competitor" | "weak_gbp" | "slow_site" | "high_severity" | "healthy" | "clean";
export type VisceralOpener = { kind: VisceralOpenerKind; headline: string; body: string };

// The opener headline is a short clause, not body copy (batch 1.5's length
// fix): gap `finding` text is written for the gap list, and dropped in
// verbatim it reads as a paragraph. Target roughly OPENER_HEADLINE_WORD_CAP
// words / OPENER_HEADLINE_CHAR_CAP characters: take the first clause (split on
// the first semicolon, comma, or period, whichever comes first) rather than
// truncating mid-word with an ellipsis. Only applied to gap finding text —
// competitor_note is already a short, ready-made single clause and must pass
// through unchanged and untruncated.
export const OPENER_HEADLINE_WORD_CAP = 12;
export const OPENER_HEADLINE_CHAR_CAP = 80;

export function clauseHeadline(text: string): string {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return "";
  const punctIdx = [";", ",", "."]
    .map((ch) => trimmed.indexOf(ch))
    .filter((i) => i > 0);
  let clause = punctIdx.length ? trimmed.slice(0, Math.min(...punctIdx)).trim() : trimmed;
  const words = clause.split(/\s+/);
  if (words.length > OPENER_HEADLINE_WORD_CAP) clause = words.slice(0, OPENER_HEADLINE_WORD_CAP).join(" ");
  if (clause.length > OPENER_HEADLINE_CHAR_CAP) {
    const cut = clause.slice(0, OPENER_HEADLINE_CHAR_CAP);
    const lastSpace = cut.lastIndexOf(" ");
    clause = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
  }
  return clause;
}

export function pickVisceralOpener(input: {
  bizName: string;
  /** No website at all, or the site fetch failed outright. */
  siteBroken: boolean;
  /** The audit's real competitor_note sentence, or "" / null / undefined. */
  competitorNote: string | null | undefined;
  /** signals.places.likelyUnclaimed.gap === true */
  weakGbp: boolean;
  pageSpeedScore: number | null | undefined;
  pageSpeedVeryLowThreshold: number;
  /** The real finding text of the first high-severity gap, if any. */
  highSeverityGapFinding: string | null | undefined;
  /** Total real (deduped) gap count — feeds the honest fallback, never fabricated. */
  gapCount: number;
  /** The prospect's OWN Google rating/review count — used ONLY to decide
   *  whether the competitor review-gap note is significant enough to LEAD
   *  the opener (see ownReputationWeak below). Never used to suppress
   *  competitorNote elsewhere in the report (Competitors/Reputation slides,
   *  CSV export all keep showing the real gap unconditionally). */
  rating: number | null | undefined;
  reviewCount: number | null | undefined;
}): VisceralOpener {
  const {
    bizName,
    siteBroken,
    competitorNote,
    weakGbp,
    pageSpeedScore,
    pageSpeedVeryLowThreshold,
    highSeverityGapFinding,
    gapCount,
    rating,
    reviewCount,
  } = input;

  if (siteBroken) {
    return {
      kind: "no_site",
      headline: `We could not find a working website for ${bizName}`,
      body: "That is the first stop for a customer searching for you, and right now there is nothing there to land on.",
    };
  }

  // Recalibration (production miscalibration, Oren's HVAC: 4.9 stars, 151
  // reviews, real conversion gap — but the opener led with "a rival has 924
  // more reviews than you"): the OLD fixed order checked competitorNote
  // unconditionally at position 2, so a large raw review-gap number always
  // outranked a real, more actionable internal gap, even for a prospect
  // whose own reputation is objectively strong. A big gap to ONE outsized
  // rival isn't the prospect's real wound when their own standing is
  // already solid — it just means one rival happens to be huge.
  //
  // ownReputationWeak mirrors gapContradictsSignals's own "weak_reviews"
  // combining logic EXACTLY (same imported WEAK_REVIEWS_MIN_RATING /
  // WEAK_REVIEWS_MIN_COUNT thresholds, same OR) — never a second, divergent
  // definition of "weak" reputation.
  const lowRating = rating != null && rating < WEAK_REVIEWS_MIN_RATING;
  const fewReviews = reviewCount != null && reviewCount < WEAK_REVIEWS_MIN_COUNT;
  const ownReputationWeak = lowRating || fewReviews;

  const tryCompetitor = (): VisceralOpener | null =>
    competitorNote && competitorNote.trim()
      ? { kind: "competitor", headline: competitorNote.trim(), body: "That gap is visible to anyone comparing you on Google right now." }
      : null;

  const tryHighSeverity = (): VisceralOpener | null =>
    highSeverityGapFinding && highSeverityGapFinding.trim()
      ? { kind: "high_severity", headline: clauseHeadline(highSeverityGapFinding), body: "That is the clearest gap we found looking at your public presence." }
      : null;

  const tryWeakGbp = (): VisceralOpener | null =>
    weakGbp
      ? {
          kind: "weak_gbp",
          headline: `${bizName}'s Google Business Profile looks unclaimed or incomplete`,
          body: "That is often the first thing a nearby customer sees, and an unclaimed listing quietly loses local search visibility.",
        }
      : null;

  const trySlowSite = (): VisceralOpener | null =>
    pageSpeedScore != null && pageSpeedScore < pageSpeedVeryLowThreshold
      ? {
          kind: "slow_site",
          headline: `${bizName}'s site scores ${pageSpeedScore}/100 on mobile speed`,
          body: "Visitors on their phone are leaving before the page even finishes loading.",
        }
      : null;

  // Own reputation genuinely weak: a rival dwarfing it in reviews IS the
  // real wound — same lead-with-competitor order as before this fix.
  // Own reputation strong (e.g. Oren's HVAC): a real internal, actionable
  // gap is the more significant story than one outsized rival, so it's
  // checked FIRST. The competitor note isn't suppressed — it's only
  // demoted, falling back to leading when there's no high-severity gap.
  const orderedChecks = ownReputationWeak
    ? [tryCompetitor, tryWeakGbp, trySlowSite, tryHighSeverity]
    : [tryHighSeverity, tryCompetitor, tryWeakGbp, trySlowSite];

  for (const check of orderedChecks) {
    const opener = check();
    if (opener) return opener;
  }

  // No strong trigger fired — this lead is in decent shape. Never promote a
  // minor (medium/low-severity) gap into a dramatic opener; say so honestly.
  if (gapCount > 0) {
    return {
      kind: "healthy",
      headline: `Your presence is solid. ${gapCount} gap${gapCount === 1 ? "" : "s"} ${gapCount === 1 ? "is" : "are"} costing you conversions.`,
      body: "Nothing here is broken, but a few real gaps below are still worth closing.",
    };
  }
  return {
    kind: "clean",
    headline: "We didn't find any real gaps in your public presence",
    body: "That's rare. Most of what we check is already working in your favor.",
  };
}

// ── Section 9: "the do-nothing delta" ─────────────────────────────────────────
/** Annualized leak (monthly × 12), for the loss-aversion line. Uses the
 *  conservative headline so it matches the hero figure. Never negative. */
export function annualizedLeak(estimate: { headline: number }): number {
  return Math.max(0, Math.round((estimate.headline || 0) * 12));
}

// ── Section 10: "the fix, mapped" — which cluster dominates ────────────────────
export type ClusterSplit = {
  cluster: "found" | "capture" | "bundle";
  foundTotal: number;
  captureTotal: number;
  found: GapContribution[];
  capture: GapContribution[];
};

// Both clusters count as "material" (→ Bundle) when the smaller cluster's dollars
// are at least this fraction of the larger's. Below it, the bigger cluster alone
// leads the recommendation.
export const BUNDLE_RATIO = 0.3;

/** Split the breakdown into Found/Capture clusters, sum dollars per cluster, and
 *  decide which offer to lead with: the dominant cluster, or Bundle when both are
 *  material. Empty/thin breakdown → 'found' (matches the FOUND default). */
export function dominantCluster(breakdown: GapContribution[]): ClusterSplit {
  const list = breakdown ?? [];
  const found = list.filter((g) => clusterOf(g.gapType) === "found");
  const capture = list.filter((g) => clusterOf(g.gapType) === "capture");
  const sum = (xs: GapContribution[]) => xs.reduce((t, g) => t + (g.midpoint || 0), 0);
  const foundTotal = sum(found);
  const captureTotal = sum(capture);

  let cluster: "found" | "capture" | "bundle";
  if (foundTotal <= 0 && captureTotal <= 0) {
    cluster = "found"; // nothing priced → default to Found
  } else if (captureTotal <= 0) {
    cluster = "found";
  } else if (foundTotal <= 0) {
    cluster = "capture";
  } else {
    const ratio = Math.min(foundTotal, captureTotal) / Math.max(foundTotal, captureTotal);
    cluster = ratio >= BUNDLE_RATIO ? "bundle" : foundTotal >= captureTotal ? "found" : "capture";
  }
  return { cluster, foundTotal, captureTotal, found, capture };
}

// ── Search demand copy (real DataForSEO data) ─────────────────────────────────
// Pure copy-formatting helpers for the report's "what people are searching
// for" section. No I/O — the report page reads audit.searchVisibility and
// passes its already-real fields in here.
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-06" -> "June". Returns null on anything unparseable rather than
 *  guessing a month. */
export function monthNameFromPeriod(period: string): string | null {
  const idx = Number(period.split("-")[1]) - 1;
  return idx >= 0 && idx < 12 ? MONTH_NAMES[idx] : null;
}

export function joinWithAnd(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/** Only meaningful for a non-null Seasonality (a real, meaningful swing —
 *  search-visibility-core.ts's deriveSeasonality already applies the
 *  1.5x-or-better threshold). Returns null (renders nothing) if the peak
 *  period(s) can't be parsed into a real month name, rather than showing a
 *  broken sentence — never manufactures a seasonal story. */
export function seasonalityLine(s: Seasonality): string | null {
  const months = s.peakPeriods.map(monthNameFromPeriod).filter((m): m is string => m !== null);
  if (months.length === 0) return null;
  return `Searches for this typically peak in ${joinWithAnd(months)}, running about ${s.ratio}x higher than the slowest month.`;
}

// ── Search-visibility ranked results: show the business name, not the raw URL ──
// A search-visibility topResult's `title` can be a long organic page title
// rather than a clean business name, so it's truncated for the report card —
// same WORD-BOUNDARY cutting technique as clauseHeadline above (never slices
// mid-word), but appends an ellipsis since this is a one-line UI label being
// shortened, not opener prose being clipped to its first clause.
export const SEARCH_RESULT_TITLE_CHAR_CAP = 60;

export function truncateResultTitle(title: string, charCap: number = SEARCH_RESULT_TITLE_CHAR_CAP): string {
  const trimmed = (title ?? "").trim();
  if (!trimmed) return "";
  if (trimmed.length <= charCap) return trimmed;
  const cut = trimmed.slice(0, charCap);
  const lastSpace = cut.lastIndexOf(" ");
  const safe = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
  return `${safe}…`;
}

// ── Named-competitor distance — honest, never implies next-door adjacency ─────
/** "28 miles" / "1 mile" / "under 1 mile" from a real haversine distance
 *  (competitors-core.ts's haversineMiles) — rounds for display only; the raw
 *  number is what the honesty gate/threshold logic (if any) should use. */
export function competitorDistanceLabel(miles: number): string {
  const rounded = Math.round(miles);
  if (rounded < 1) return "under 1 mile";
  return `${rounded} mile${rounded === 1 ? "" : "s"}`;
}

// ── Leading-on-reviews copy: name the top real rival, never an open market ────
// Production bug (933d3b5c-06f0-4c64-9dd8-714fe595fdb8): the lead already led
// on reviews with 5 real competitors on record, but the report rendered
// generic "staying ahead" copy with no rival named at all. The rest of this
// paragraph's tail text (name, reviewCount, rating) comes only from the SAME
// audit's stored `standing.topByReviews` — never invented. Only the trailing
// clause is generated here; the rival's name is bolded separately in the JSX.
//
// Wording fix: "closest rival" read as a DISTANCE claim, but the ranked field
// below it shows per-rival distance in miles and topByReviews is ranked by
// REVIEW COUNT, not proximity — a nearer-by-miles business can sit lower in
// the list, contradicting "closest". "top rival by review count" states the
// ranking basis explicitly and can't be misread as a distance claim.
export function topRivalComparisonCopy(topByReviews: { reviewCount: number | null; rating: number | null } | null): string {
  if (!topByReviews) return "";
  let s = "is your top rival by review count";
  if (topByReviews.reviewCount != null) {
    s += `, with ${topByReviews.reviewCount.toLocaleString()} reviews`;
    if (topByReviews.rating != null) s += ` at a ${topByReviews.rating} rating`;
  }
  s += ". Staying ahead isn't automatic: reviews compound for whoever keeps asking, and closing the gap on the businesses below you takes one steady month of review-gathering.";
  return s;
}

// ── Genuinely-sparse-market copy (competitors array empty) ────────────────────
// Only reachable when the Places-based competitors array is truly empty — the
// caller (the report page) gates this behind compNone, which itself requires
// competitors.length === 0. Within that, two INDEPENDENT real facts decide the
// copy, never merged or assumed from one another:
//   leadRanksFirst          — the SAME audit's search-visibility data shows
//                             the lead ranking #1 for its own seed keyword.
//   hasOtherRankedBusiness  — the SAME audit's map pack (rendered two
//                             sections below this one) shows a business other
//                             than the lead. Production bug: this used to be
//                             ignored entirely, so "we couldn't find another
//                             business nearby" (or "found none nearby") could
//                             render while the map pack named real rivals a
//                             few paragraphs down. Places (competitors) and
//                             DataForSEO (map pack) can legitimately disagree
//                             on WHICH businesses exist — this never tries to
//                             reconcile the two sources — but the copy must
//                             never deny what the reader can see for
//                             themselves elsewhere on the same page.
export function noRivalsCopy(leadRanksFirst: boolean, hasOtherRankedBusiness: boolean, searchCategory: string | null): string {
  const catA = searchCategory ? searchCategory.toLowerCase() : "your services";
  const catB = searchCategory ? searchCategory.toLowerCase() : "same-category";
  if (leadRanksFirst && !hasOtherRankedBusiness) {
    return `You already come out on top when people search for ${catA} near you, and we couldn't find another ${catB} business nearby to compare you against either. That's a strong position: keep the visibility and the reviews coming so it stays that way.`;
  }
  if (leadRanksFirst && hasOtherRankedBusiness) {
    return `You already come out on top when people search for ${catA} near you. We couldn't confirm a same-category rival through our own listing search, but Google's results for that search do show other businesses ranking nearby, so keep the visibility and the reviews coming to hold that lead.`;
  }
  if (!leadRanksFirst && hasOtherRankedBusiness) {
    return `We couldn't confirm another ${catB} business through our own listing search, but Google's results for people searching for ${catA} do show other businesses ranking nearby. That's real competition, even if we can't name it here with confidence.`;
  }
  return `We searched Google for other ${catB} businesses near you and found none nearby. That's rare, and it can be an opening: with the right presence, you could be the one people find first. We only compare genuine same-category businesses, so we'd rather show none than pad this with unrelated listings.`;
}

// ── Map-pack rank grid copy ─────────────────────────────────────────────────
// Honesty gates: never fabricate a positive story when the lead appears at
// 0 of 9 points; state plainly when it ranks first everywhere; never
// manufacture urgency ("center-strong / edges-weak") unless the real data
// actually shows that pattern (the center point appeared and at least one
// edge point did not). GRID_CENTER_INDEX matches
// search-visibility-grid-core.ts's GRID_CENTER_POINT_INDEX (index 4 of a
// row-major 3x3) — duplicated as a literal here rather than imported so this
// file has zero dependency on the grid's own module (same posture as the
// rest of report-sections.ts, which only ever takes plain data in).
const GRID_CENTER_INDEX = 4;

export type GridCellForCopy = { rank: number | null; appeared: boolean };

/** One cell's rendered label — never renders a null rank as 0. */
export function gridCellLabel(point: GridCellForCopy): string {
  if (!point.appeared || point.rank == null) return "not shown here";
  return `#${point.rank}`;
}

/** The grid section's summary line. Empty string when there's nothing to
 *  summarize (caller should hide the section entirely in that case). */
export function gridSummaryCopy(points: GridCellForCopy[]): string {
  if (points.length === 0) return "";
  const appearedCount = points.filter((p) => p.appeared).length;

  if (appearedCount === 0) {
    return "Not appearing in the local pack at any of the 9 points we checked nearby.";
  }
  if (appearedCount === points.length) {
    const allFirst = points.every((p) => p.rank === 1);
    return allFirst
      ? "Ranking first in the local pack at all 9 points we checked nearby."
      : "Appearing in the local pack at all 9 points we checked nearby.";
  }

  const center = points[GRID_CENTER_INDEX];
  const edges = points.filter((_, i) => i !== GRID_CENTER_INDEX);
  const edgeAppearedCount = edges.filter((p) => p.appeared).length;
  const centerStrongEdgesWeak = !!center?.appeared && edgeAppearedCount < edges.length;

  return centerStrongEdgesWeak
    ? `Appearing in the local pack at ${appearedCount} of 9 points we checked nearby, strongest right around the business and weaker toward the edges of the area.`
    : `Appearing in the local pack at ${appearedCount} of 9 points we checked nearby.`;
}

import type { ProspectSignals } from "@/lib/signals";
import type { AuditScoreResult } from "@/lib/audit-score";
import type { SearchVisibilityResult, KeywordRow } from "@/lib/search-visibility-core";
import type { CompetitorResult } from "@/lib/competitors-core";
import type { SearchVisibilityGridResult } from "@/lib/search-visibility-grid-core";
import type { CitationResult } from "@/lib/citations-core";
import type { PsiIssue } from "@/lib/report-images-core";
import { reputationCard, visibilityCard, conversionCard, healthCard } from "./verdict-pillars";
import { deriveFindings, deriveStrengths, countBySeverity } from "./report-findings";
import { psiMetricValue } from "./psi-metrics";

// MINIMAL fact-object builders for the 8 v2 report slides in scope for LLM
// observation generation. Each returns a SMALL, tightly-scoped object — only
// the handful of facts that slide's observation may reference, never a
// kitchen-sink blob — so a real number can never be mis-attached to the
// wrong claim by observation-guards.ts's corroboration check. Each returns
// null (never an object of all-null fields) when the slide's real data is too
// thin to safely generate from — the caller must skip the LLM call entirely
// in that case (see observation-generate.ts's doc comment) and use the static
// fallback directly.

export type ObservationSlideKey =
  | "verdict"
  | "competitors"
  | "search_demand"
  | "keyword_cluster"
  | "reputation"
  | "your_site"
  | "trust_signals"
  | "what_we_found";

function pillarFraction(points: number, max: number): number {
  return max > 0 ? points / max : 0;
}

// ── Verdict (slide 2) ────────────────────────────────────────────────────────

export function buildVerdictFacts(
  signals: ProspectSignals | null | undefined,
  auditScore: AuditScoreResult | null,
  searchVisibility: SearchVisibilityResult | null,
): Record<string, unknown> | null {
  const auditTotal = auditScore?.total ?? null;
  const rating = signals?.places.rating ?? null;
  const reviewCount = signals?.places.reviewCount ?? null;
  const mapPosition = searchVisibility?.leadAppears && searchVisibility.leadPosition != null ? searchVisibility.leadPosition : null;

  let weakestArea: string | null = null;
  if (auditScore) {
    const cards = [
      reputationCard(signals, auditScore.breakdown),
      visibilityCard(searchVisibility, auditScore.breakdown),
      conversionCard(signals, auditScore.breakdown),
      healthCard(signals, auditScore.breakdown),
    ].filter((c) => c.chipState !== "unmeasured");
    if (cards.length > 0) {
      const weakest = cards.reduce((a, b) => (pillarFraction(a.points, a.max) <= pillarFraction(b.points, b.max) ? a : b));
      weakestArea = weakest.headline;
    }
  }

  if (rating == null && mapPosition == null && weakestArea == null && auditTotal == null) return null;
  return {
    // Labeled as a string, not a bare number, so the model can't misread a
    // 0-100 score as a count of something else (production bug: "The
    // business completed 55 audits" from a raw auditTotal: 55).
    auditScore: auditTotal != null ? `${auditTotal} out of 100` : null,
    rating,
    reviewCount,
    mapPosition: mapPosition != null ? `ranked #${mapPosition}` : null,
    weakestArea,
  };
}

// ── Competitors (slide 4) ────────────────────────────────────────────────────

export function buildCompetitorsFacts(competitors: CompetitorResult | null, versionCurrent: boolean): Record<string, unknown> | null {
  if (!competitors || !versionCurrent) return null;
  if (competitors.competitors.length === 0) return null;
  const standing = competitors.standing;
  if (!standing) return null;
  const reviewGapToTop = standing.reviewGapToTop ?? null;
  const topRivalName = standing.topByReviews?.name ?? null;
  if (reviewGapToTop == null && topRivalName == null) return null;
  return {
    reviewGapToTop: reviewGapToTop != null ? `${reviewGapToTop} more reviews than the top rival` : null,
    topRivalName,
    leadsReviews: standing.leadsReviews,
  };
}

// ── Search Demand (slide 5) ──────────────────────────────────────────────────

export function buildSearchDemandFacts(sv: SearchVisibilityResult | null): Record<string, unknown> | null {
  if (!sv) return null;
  const seedTerm = sv.keywords?.[0]?.term ?? sv.seed ?? null;
  const volume = sv.volume ?? null;
  const monthlyValue = sv.monthlyClickValue ?? null;
  const mapPosition = sv.leadAppears && sv.leadPosition != null ? sv.leadPosition : null;
  if (seedTerm == null && volume == null && monthlyValue == null && mapPosition == null) return null;
  return {
    seedTerm,
    searchVolume: volume != null ? `${volume} searches per month` : null,
    monthlyClickValue: monthlyValue != null ? `$${monthlyValue} in monthly click value` : null,
    mapPosition: mapPosition != null ? `ranked #${mapPosition}` : null,
  };
}

// ── Keyword Cluster (slide 6) ────────────────────────────────────────────────

export function buildKeywordClusterFacts(keywords: KeywordRow[] | null): Record<string, unknown> | null {
  if (!keywords || keywords.length <= 1) return null;
  const [head, ...tail] = keywords;
  const topTail = [...tail].sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))[0] ?? null;
  const headVolume = head.volume ?? null;
  const topTailVolume = topTail?.volume ?? null;
  return {
    headTerm: head.term,
    headVolume: headVolume != null ? `${headVolume} searches per month` : null,
    tailCount: tail.length,
    topTailTerm: topTail?.term ?? null,
    topTailVolume: topTailVolume != null ? `${topTailVolume} searches per month` : null,
  };
}

// ── Reputation (slide 8) ─────────────────────────────────────────────────────

export function buildReputationFacts(
  signals: ProspectSignals | null | undefined,
  competitors: CompetitorResult | null,
  competitorsVersionCurrent: boolean,
): Record<string, unknown> | null {
  const rating = signals?.places.rating ?? null;
  const reviewCount = signals?.places.reviewCount ?? null;
  if (rating == null && reviewCount == null) return null;

  const compOk = !!competitors && competitorsVersionCurrent && competitors.competitors.length > 0;
  const standing = compOk ? competitors!.standing : null;
  const reviewGapToTop = standing?.reviewGapToTop ?? null;
  return {
    rating,
    reviewCount,
    reviewGapToTop: reviewGapToTop != null ? `${reviewGapToTop} more reviews than the top rival` : null,
    topRivalName: standing?.topByReviews?.name ?? null,
    leadsReviews: standing?.leadsReviews ?? null,
  };
}

// ── Your Site (slide 9) ──────────────────────────────────────────────────────

export function buildYourSiteFacts(signals: ProspectSignals | null | undefined, issues: PsiIssue[] | null): Record<string, unknown> | null {
  const pageSpeedScore = signals?.performance.pageSpeedMobile ?? null;
  const lcp = psiMetricValue(issues, "lcp");
  const httpsPresent = signals?.website?.https.present ?? null;
  const contactFormPresent = signals?.website?.contactForm.present ?? null;
  const clickToCallPresent = signals?.website?.clickToCall.present ?? null;
  if (pageSpeedScore == null && lcp == null && httpsPresent == null && contactFormPresent == null && clickToCallPresent == null) return null;
  return {
    pageSpeedScore: pageSpeedScore != null ? `${pageSpeedScore} out of 100` : null,
    // lcp is already Lighthouse's own formatted displayValue (e.g. "11.9 s"),
    // a self-labeled string straight from PSI, not a bare number we format.
    lcp,
    httpsPresent,
    contactFormPresent,
    clickToCallPresent,
  };
}

// ── Trust Signals (slide 12) ─────────────────────────────────────────────────

export function buildTrustSignalsFacts(signals: ProspectSignals | null | undefined, auditScore: AuditScoreResult | null): Record<string, unknown> | null {
  const httpsPresent = signals?.website?.https.present ?? null;
  const domainAgeMonths = signals?.domain.ageMonths ?? null;
  const hasAddress = signals?.places.address != null;
  const health = auditScore ? healthCard(signals, auditScore.breakdown) : null;
  const healthPoints = health && health.chipState !== "unmeasured" ? health.points : null;
  const healthMax = health && health.chipState !== "unmeasured" ? health.max : null;
  if (httpsPresent == null && domainAgeMonths == null && !hasAddress && healthPoints == null) return null;
  return {
    httpsPresent,
    domainAgeMonths,
    hasAddress,
    siteHealth: healthPoints != null && healthMax != null ? `${healthPoints} of ${healthMax} points` : null,
  };
}

// ── What We Found (slide 14) ─────────────────────────────────────────────────

export function buildWhatWeFoundFacts(
  signals: ProspectSignals | null | undefined,
  auditScore: AuditScoreResult | null,
  grid: SearchVisibilityGridResult | null,
  citations: CitationResult | null,
  issues: PsiIssue[] | null,
): Record<string, unknown> | null {
  if (!auditScore) return null;
  const findings = deriveFindings(signals, auditScore, issues);
  const strengths = deriveStrengths(signals, grid, citations);
  const bySeverity = countBySeverity(findings);
  return {
    gapsCount: findings.length,
    highCount: bySeverity.high,
    mediumCount: bySeverity.medium,
    lowCount: bySeverity.low,
    strengthsCount: strengths.length,
  };
}

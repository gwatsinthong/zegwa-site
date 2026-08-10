import type { ProspectSignals } from "@/lib/signals";
import type { AuditScoreResult } from "@/lib/audit-score";
import type { SearchVisibilityGridResult } from "@/lib/search-visibility-grid-core";
import type { CitationResult } from "@/lib/citations-core";
import type { PsiIssue } from "@/lib/report-images-core";
import { conversionCard } from "./verdict-pillars";
import { psiMetricValue } from "./psi-metrics";
import { sumPsiOpportunitySavings } from "@/lib/report-images-core";

// Plain (NOT "use client") synthesis layer shared by the "What We Found"
// slide (14) and the "Fix List" slide (15) — both slides must show the SAME
// real gaps, so they're derived ONCE here rather than twice, in the same
// impact order the prototype's own findings table uses: lead capture ->
// HTTPS -> mobile speed -> page weight -> trust pages. Every finding is
// conditional on its real underlying signal; a finding that doesn't apply
// (e.g. HTTPS is actually enabled) is simply never produced — never a
// fabricated row for a gap that isn't real.

export type FindingSeverity = "high" | "medium" | "low";

export type Finding = {
  key: "lead_capture" | "https" | "slow_mobile" | "page_weight" | "trust_pages";
  title: string;
  severity: FindingSeverity;
  evidence: string;
  impact: string;
};

export function deriveFindings(
  signals: ProspectSignals | null | undefined,
  auditScore: AuditScoreResult | null,
  issues: PsiIssue[] | null,
): Finding[] {
  const findings: Finding[] = [];
  const website = signals?.website ?? null;

  if (auditScore) {
    const conversion = conversionCard(signals, auditScore.breakdown);
    if (conversion.chipState === "weak" || conversion.chipState === "mid") {
      findings.push({
        key: "lead_capture",
        title: conversion.chipState === "weak" ? "No lead capture" : "Limited lead capture",
        severity: conversion.chipState === "weak" ? "high" : "medium",
        evidence: conversion.headline,
        impact: "Visits don't convert to leads",
      });
    }
  }

  if (website?.https.present === false) {
    findings.push({
      key: "https",
      title: "No HTTPS",
      severity: "high",
      evidence: "Not Secure warning shown to visitors",
      impact: "Trust and ranking hit",
    });
  }

  const pageSpeedScore = signals?.performance.pageSpeedMobile ?? null;
  const slow = signals?.performance.gap === true;
  if (slow) {
    const lcp = psiMetricValue(issues, "lcp");
    findings.push({
      key: "slow_mobile",
      title: "Slow mobile load",
      severity: "medium",
      evidence: lcp != null && pageSpeedScore != null ? `LCP ${lcp}, PageSpeed ${pageSpeedScore}/100` : pageSpeedScore != null ? `PageSpeed ${pageSpeedScore}/100` : "PageSpeed not measured",
      impact: "Visitors leave before load",
    });
  }

  const opportunities = signals?.performance.pageSpeedOpportunities ?? null;
  if (opportunities && opportunities.length > 0) {
    const { totalSavingsKb, totalSavingsMs } = sumPsiOpportunitySavings(opportunities);
    const parts: string[] = [];
    if (totalSavingsKb > 0) parts.push(`${totalSavingsKb} KB`);
    if (totalSavingsMs > 0) parts.push(`${(totalSavingsMs / 1000).toFixed(1)}s`);
    const worstSeverity: FindingSeverity = opportunities.some((o) => o.severity === "high") ? "high" : opportunities.some((o) => o.severity === "medium") ? "medium" : "low";
    findings.push({
      key: "page_weight",
      title: "Heavy page weight",
      severity: worstSeverity,
      evidence: parts.length > 0 ? `${parts.join(" and ")} recoverable` : "Recoverable savings found",
      impact: slow ? "Compounds the slow load" : "Adds unnecessary load time",
    });
  }

  const privacyAbsent = website?.privacyPage.present === false;
  const aboutAbsent = website?.aboutPage.present === false;
  if (privacyAbsent || aboutAbsent) {
    const missing: string[] = [];
    if (privacyAbsent) missing.push("no privacy page");
    if (aboutAbsent) missing.push("no about page shown");
    findings.push({
      key: "trust_pages",
      title: "Thin trust pages",
      severity: "low",
      evidence: missing.join(", ").replace(/^./, (c) => c.toUpperCase()),
      impact: "Minor credibility gaps",
    });
  }

  return findings;
}

export type Strength = { key: string; shortLabel: string; fullLabel: string };

export function deriveStrengths(
  signals: ProspectSignals | null | undefined,
  grid: SearchVisibilityGridResult | null,
  citations: CitationResult | null,
): Strength[] {
  const strengths: Strength[] = [];
  const rating = signals?.places.rating ?? null;
  const reviewCount = signals?.places.reviewCount ?? null;

  if (rating != null && rating >= 4.5) {
    strengths.push({ key: "rating", shortLabel: "Rating", fullLabel: `${rating.toFixed(1)} rating` });
  }
  if (reviewCount != null && reviewCount >= 100) {
    strengths.push({ key: "reviews", shortLabel: "Reviews", fullLabel: `${reviewCount.toLocaleString()} reviews` });
  }
  if (grid && grid.points.length > 0) {
    const total = grid.points.length;
    const appeared = grid.points.filter((p) => p.appeared).length;
    const rank1 = grid.points.filter((p) => p.appeared && p.rank === 1).length;
    if (appeared / total >= 0.75) {
      strengths.push({
        key: "map_rank",
        shortLabel: "Map rank",
        fullLabel: rank1 === total ? `#1 in all ${total} zones` : `${appeared} of ${total} zones`,
      });
    }
  }
  const osm = citations?.rows.find((r) => r.source === "osm") ?? null;
  if (osm?.status === "match") {
    strengths.push({ key: "listings", shortLabel: "Listings", fullLabel: "Listings consistent" });
  }

  return strengths;
}

export function countBySeverity(findings: Finding[]): Record<FindingSeverity, number> {
  return {
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
  };
}

// ── Fix List (slide 15) ───────────────────────────────────────────────────────
// CONFIRMED FINDING: the prototype's 5-row fix list is NOT a fixed template —
// each row maps 1:1 to a real underlying signal, and it does not correspond
// 1:1 to deriveFindings' 5 rows either. It SPLITS the merged "lead capture"
// finding into two separate real facts already visible as distinct breakdown
// sub-components (booking_or_enquiry, contact_form), and it MERGES the
// separate "slow mobile"/"heavy page weight" findings into one "speed up the
// mobile site" fix (same root cause: site performance). So this reads the
// SAME real breakdown/signals directly at finer grain, rather than wrapping
// deriveFindings' already-merged rows. A fix only appears when its own real
// signal indicates the gap is real — never "Move to HTTPS" when HTTPS is
// already enabled.

export type FixImpact = "Highest impact" | "High impact" | "Medium impact";

export type Fix = {
  key: "booking" | "contact_form" | "https" | "speed" | "trust_pages";
  fix: string;
  rationale: string;
  impact: FixImpact;
  color: string;
  bg: string;
};

export function deriveFixes(signals: ProspectSignals | null | undefined, auditScore: AuditScoreResult | null, issues: PsiIssue[] | null): Fix[] {
  const fixes: Fix[] = [];
  const website = signals?.website ?? null;
  const breakdown = auditScore?.breakdown ?? [];
  const findSub = (key: string) => breakdown.find((b) => b.key === key);

  const booking = findSub("booking_or_enquiry");
  const bookingGap = booking ? booking.measured && booking.points < booking.maxPoints : false;
  if (bookingGap && booking) {
    fixes.push({
      key: "booking",
      fix: "Give people a way to book.",
      rationale: `The ${auditScore!.pillars.conversion}/${booking.maxPoints + (findSub("contact_form")?.maxPoints ?? 0) + (findSub("click_to_call")?.maxPoints ?? 0)} conversion score traces straight back to this. Covered by click-to-call, plus booking if wanted.`,
      impact: "Highest impact",
      color: "#A8362B",
      bg: "#FBEAE8",
    });
  }

  const contactForm = findSub("contact_form");
  const contactFormGap = contactForm ? contactForm.measured && contactForm.points < contactForm.maxPoints : false;
  if (contactFormGap) {
    fixes.push({
      key: "contact_form",
      fix: "Add a simple contact form.",
      rationale: "The same lead-capture gap, a second entry point. Covered by lead-capture forms.",
      impact: "High impact",
      color: "#C1691E",
      bg: "#FBEEDA",
    });
  }

  if (website?.https.present === false) {
    fixes.push({
      key: "https",
      fix: "Move to HTTPS.",
      rationale: "Clears the browser warning and the one hard fail on site health. Covered by domain, hosting, and SSL setup.",
      impact: "High impact",
      color: "#C1691E",
      bg: "#FBEEDA",
    });
  }

  const pageSpeedScore = signals?.performance.pageSpeedMobile ?? null;
  const slow = signals?.performance.gap === true;
  const opportunities = signals?.performance.pageSpeedOpportunities ?? null;
  const hasOpportunities = !!opportunities && opportunities.length > 0;
  if (slow || hasOpportunities) {
    const lcp = psiMetricValue(issues, "lcp");
    const rationale =
      lcp != null && pageSpeedScore != null
        ? `LCP ${lcp} and PageSpeed ${pageSpeedScore} mean visitors leave before the page loads. Covered by mobile speed optimization.`
        : pageSpeedScore != null
          ? `PageSpeed ${pageSpeedScore} means visitors leave before the page loads. Covered by mobile speed optimization.`
          : "Recoverable savings were found on this site. Covered by mobile speed optimization.";
    fixes.push({
      key: "speed",
      fix: "Speed up the mobile site.",
      rationale,
      impact: "Medium impact",
      color: "#7C5CFA",
      bg: "#EFEAFB",
    });
  }

  const privacyAbsent = website?.privacyPage.present === false;
  const aboutAbsent = website?.aboutPage.present === false;
  if (privacyAbsent || aboutAbsent) {
    const missing =
      privacyAbsent && aboutAbsent ? "No privacy page and no visible contact info." : privacyAbsent ? "No privacy page shown." : "No visible contact info.";
    fixes.push({
      key: "trust_pages",
      fix: "Add the missing trust pages.",
      rationale: `${missing} Covered by a privacy page and site-wide contact details.`,
      impact: "Medium impact",
      color: "#2E9E5B",
      bg: "#E3F4E9",
    });
  }

  return fixes;
}

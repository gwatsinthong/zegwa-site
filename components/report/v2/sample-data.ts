import { computeAuditScore } from "@/lib/audit-score";
import { estimateRevenueLeak } from "@/lib/revenue-estimate";
import { detectCountry } from "@/lib/currency";
import type { ProspectSignals } from "@/lib/signals";
import type { ReportV2Data } from "./report-v2-types";

// Mechanical-port sample data ONLY (per the porting prompt: "Capture-scrub
// and Summit Air data come in a SECOND prompt"). This file exists to make
// all 19 ported slides render something coherent, not to be the final copy.
// "Summit Air" / HVAC / a generic US city is a placeholder, same convention
// the pre-existing (now-removed) app/_sample-report page used ("Northgate
// Heating & Air" — fictional). No real business, email, or figures anywhere
// in this file.
//
// Where the real elvenlore pipeline (report-v2-data.ts, NOT ported — see
// report-v2-types.ts's doc comment) would read fetched signals off a DB row
// and DERIVE auditScore/estimate from them, this file hand-authors the leaf
// signals directly, then feeds them through the SAME real, already-ported
// computeAuditScore/estimateRevenueLeak functions — so the derived numbers
// are internally consistent by construction, not independently guessed.
//
// Several nested fields (competitors, search visibility, search-visibility
// grid, report images/screenshot, citations) are left null. This is not a
// missing-data bug: every ported slide already has an honest "not yet
// measured"/"no data available" fallback path for exactly this case (see
// e.g. competitors-slide.tsx's `ok` branch) — reusing those existing honest
// fallbacks, as this prompt explicitly allows, rather than inventing
// plausible-looking fake competitor/search data.

const SAMPLE_SIGNALS: ProspectSignals = {
  gatheredAt: "2026-01-15T00:00:00.000Z",
  website: {
    fetched: true,
    finalUrl: "https://www.summitair-demo.example.com",
    https: { present: true, gap: false },
    mobileResponsive: { present: true, gap: false },
    cms: { value: "WordPress", gap: false },
    analytics: { present: true, gap: false },
    adPixels: { value: [], present: false, gap: false },
    booking: { present: false, gap: true },
    chat: { present: false, gap: true },
    clickToCall: { present: false, gap: true },
    contactForm: { present: false, gap: true },
    copyrightYear: 2023,
    staleSite: { present: false, gap: false },
    schemaMarkup: { present: false, scope: "homepage" },
    socialLinks: { present: true, scope: "homepage" },
    privacyPage: { present: true, scope: "homepage" },
    aboutPage: { present: true, scope: "homepage" },
  },
  performance: {
    pageSpeedMobile: 41,
    gap: true,
    pageSpeedOpportunities: [
      { title: "Reduce unused JavaScript", savingsKb: 640, savingsMs: 1100, severity: "high" },
      { title: "Serve images in next-gen formats", savingsKb: 310, savingsMs: 420, severity: "medium" },
      { title: "Eliminate render-blocking resources", savingsKb: 90, savingsMs: 380, severity: "medium" },
    ],
    pageSpeedMetrics: [
      { key: "lcp", label: "Largest Contentful Paint", numericValue: 4200, displayValue: "4.2 s" },
      { key: "speedIndex", label: "Speed Index", numericValue: 5300, displayValue: "5.3 s" },
      { key: "fcp", label: "First Contentful Paint", numericValue: 2100, displayValue: "2.1 s" },
      { key: "tbt", label: "Total Blocking Time", numericValue: 610, displayValue: "610 ms" },
      { key: "cls", label: "Cumulative Layout Shift", numericValue: 0.18, displayValue: "0.18" },
    ],
  },
  domain: {
    registrableDomain: "summitair-demo.example.com",
    registeredAt: "2016-03-01T00:00:00.000Z",
    ageMonths: 118,
    hasMx: true,
    mxGap: false,
  },
  places: {
    rating: 4.1,
    reviewCount: 32,
    likelyUnclaimed: { present: false, gap: false },
    reviewRecency: null,
    address: "1900 Industrial Pkwy, Columbus, OH",
  },
};

const auditScore = computeAuditScore({
  signals: SAMPLE_SIGNALS,
  searchVisibility: null,
  searchVisibilityGrid: null,
});

const country = detectCountry({ country: "US", address: SAMPLE_SIGNALS.places.address });

const estimate = estimateRevenueLeak({
  category: "HVAC",
  businessName: "Summit Air",
  firedGaps: ["no_booking", "no_click_to_call", "slow_pagespeed"],
  country,
});

// Same PILLAR_BREAKDOWN_KEYS grouping report-v2-data.ts uses, derived from
// the real breakdown rather than duplicated max constants — matches its
// pillarMaxFrom() logic exactly so this can't silently drift.
const PILLAR_BREAKDOWN_KEYS = {
  reputation: ["rating", "review_count"],
  visibility: ["map_pack_position", "grid_strength"],
  conversion: ["contact_form", "click_to_call", "booking_or_enquiry"],
  health: ["https", "mobile_responsive", "page_speed"],
} as const;

function pillarMaxFrom(breakdown: typeof auditScore.breakdown, keys: readonly string[]): number {
  return breakdown.filter((b) => keys.includes(b.key)).reduce((sum, b) => sum + b.maxPoints, 0);
}

export const SAMPLE_REPORT_DATA: ReportV2Data = {
  biz: "Summit Air",
  category: "HVAC",
  country,
  preparedDate: "Jan 2026",
  estimate,
  leakHeadlineFormatted: estimate.headline > 0 ? `$${estimate.headline.toLocaleString("en-US")}` : null,
  auditScore,
  pillarMax: {
    reputation: pillarMaxFrom(auditScore.breakdown, PILLAR_BREAKDOWN_KEYS.reputation),
    visibility: pillarMaxFrom(auditScore.breakdown, PILLAR_BREAKDOWN_KEYS.visibility),
    conversion: pillarMaxFrom(auditScore.breakdown, PILLAR_BREAKDOWN_KEYS.conversion),
    health: pillarMaxFrom(auditScore.breakdown, PILLAR_BREAKDOWN_KEYS.health),
  },
  signals: SAMPLE_SIGNALS,
  opener: {
    headline: "Summit Air is losing calls it should be winning.",
    body: "There's no booking path and no click-to-call on a mobile page that loads slowly — real search demand is arriving and leaving without a way to convert.",
  },
  competitors: null,
  competitorsVersionCurrent: false,
  sv: null,
  grid: null,
  reportImages: null,
  citations: null,
  psiIssues: null,
  observations: undefined,
};

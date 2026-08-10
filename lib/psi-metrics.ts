import type { PsiIssue, PageSpeedMetric, PsiMetricKey } from "@/lib/report-images-core";

export type { PsiMetricKey };

// Plain (NOT "use client") helpers matching the prototype's 5 fixed PageSpeed
// metric cards (LCP, Speed Index, FCP, TBT, CLS) against what's ACTUALLY
// stored per audit.
//
// Two separate sources, two separate functions — deliberately not merged:
//   - psiMetricValue (below) reads report_images.pagespeed.issues (PsiIssue[]
//     — see report-images-core.ts's extractPsiIssues), the TOP FAILING
//     audits only (score < 0.9), capped at 4. Still used for evidence text
//     elsewhere in the report (Fix List's rationale, What We Found's finding
//     evidence) where "this specific thing is failing" is exactly the point.
//   - psiMetricDisplayValue (new, additive) reads signals.performance.
//     pageSpeedMetrics (PageSpeedMetric[] — see report-images-core.ts's
//     extractPsiMetrics), which is UNCONDITIONAL on pass/fail: a fast site's
//     real (good) LCP/FCP/CLS values are captured too, not just its failing
//     ones. Slide 9's 5 metric cards use this one so a 97-scoring site shows
//     its real numbers instead of 5 empty "Not measured" cards.
const METRIC_TITLES: Record<"lcp" | "speedIndex" | "fcp" | "tbt" | "cls", string> = {
  lcp: "Largest Contentful Paint",
  speedIndex: "Speed Index",
  fcp: "First Contentful Paint",
  tbt: "Total Blocking Time",
  cls: "Cumulative Layout Shift",
};

/** Real stored value (Lighthouse's own displayValue string, e.g. "11.9 s")
 *  for one of the 5 known metrics, or null when that specific audit isn't
 *  in the stored (capped, failing-only) issues list. */
export function psiMetricValue(issues: PsiIssue[] | null | undefined, key: PsiMetricKey): string | null {
  const title = METRIC_TITLES[key];
  const match = (issues ?? []).find((i) => i.title === title);
  return match?.value ?? null;
}

// House tabular-figure rule: Lighthouse's own displayValue puts a space
// before the unit ("1.2 s", "820 ms") — the prototype's card format has no
// space ("1.2s", "820ms"). CLS is already unitless ("0.01") and passes
// through unchanged (no space to strip). Only strips a space directly
// between a digit and a trailing unit — never touches the number itself.
export function formatPsiDisplayValue(displayValue: string): string {
  return displayValue.replace(/(\d)\s+([a-zA-Z%]+)$/, "$1$2");
}

/** Real stored value (Lighthouse's own displayValue, house-formatted — see
 *  formatPsiDisplayValue) for one of the 5 known metrics, from the
 *  UNCONDITIONAL (pass-or-fail) pageSpeedMetrics array — or null when that
 *  specific metric is genuinely absent from the response (PSI never ran, or
 *  that one audit key was missing) — never null just because the site is
 *  fast and the metric passed. */
export function psiMetricDisplayValue(metrics: PageSpeedMetric[] | null | undefined, key: PsiMetricKey): string | null {
  const match = (metrics ?? []).find((m) => m.key === key);
  return match?.displayValue != null ? formatPsiDisplayValue(match.displayValue) : null;
}

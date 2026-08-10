import type { ProspectSignals } from "@/lib/signals";
import type { AuditScoreResult } from "@/lib/audit-score";
import type { SearchVisibilityGridResult } from "@/lib/search-visibility-grid-core";
import type { CitationResult } from "@/lib/citations-core";
import type { PsiIssue } from "@/lib/report-images-core";
import { deriveFindings, deriveStrengths, countBySeverity, type Finding, type FindingSeverity } from "@/lib/report-findings";
import { OBSERVATION_STATIC_FALLBACKS } from "@/lib/observation-static-fallbacks";

// Pixel-perfect port of the prototype's "What We Found" <section> (Audit
// Deck.dc.html, slide 14, data-om-slide-id 5333392d) — a SYNTHESIS slide:
// every stat, row, and strength below is derived from findings.ts's
// deriveFindings/deriveStrengths, which read the exact same real signals/
// breakdown/grid/citations earlier slides already wired. Nothing here is a
// second, independently-invented judgment — a finding that appears here
// necessarily traces to the same real fact the Verdict/Trust/Geo Map slides
// already showed.

const SEVERITY_BADGE_BG: Record<FindingSeverity, string> = { high: "#FBEAE8", medium: "#FBEEDA", low: "#EFEFEF" };
const SEVERITY_ICON_COLOR: Record<FindingSeverity, string> = { high: "#A8362B", medium: "#C1691E", low: "#9C9C9C" };
const SEVERITY_CHIP_BG: Record<FindingSeverity, string> = { high: "#A8362B", medium: "#C1691E", low: "#EFEFEF" };
const SEVERITY_CHIP_COLOR: Record<FindingSeverity, string> = { high: "#FFFFFF", medium: "#FFFFFF", low: "#6B6B6B" };
const SEVERITY_LABEL: Record<FindingSeverity, string> = { high: "High", medium: "Medium", low: "Low" };

// Finding-icon + impact-icon paths, copied verbatim from the prototype's per-
// row SVGs so each finding keeps its own visual identity.
const FINDING_ICON: Record<Finding["key"], JSX.Element> = {
  lead_capture: (
    <>
      <rect x="6" y="4" width="12" height="16" rx="1.5" />
      <rect x="9" y="2.5" width="6" height="3" rx="1" />
      <line x1="9" y1="11" x2="15" y2="11" strokeLinecap="round" />
      <line x1="9" y1="15" x2="13" y2="15" strokeLinecap="round" />
    </>
  ),
  https: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
    </>
  ),
  slow_mobile: (
    <>
      <rect x="7" y="2" width="10" height="18" rx="3" />
      <line x1="12" y1="16" x2="12" y2="16.5" strokeLinecap="round" />
    </>
  ),
  page_weight: <path d="M4 8c4-3 12-3 16 0M6 12c3-2 9-2 12 0M9 16c2-1 4-1 6 0" strokeLinecap="round" />,
  trust_pages: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />,
};

const IMPACT_ICON: Record<Finding["key"], JSX.Element> = {
  lead_capture: <path d="M3 17l6-6 4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />,
  https: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />,
  slow_mobile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  page_weight: (
    <>
      <rect x="3" y="9" width="18" height="11" rx="1.5" />
      <path d="M7 9V6a5 5 0 0110 0v3" strokeLinecap="round" />
    </>
  ),
  trust_pages: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
};

export type WhatWeFoundSlideProps = {
  signals: ProspectSignals | null | undefined;
  auditScore: AuditScoreResult | null;
  grid: SearchVisibilityGridResult | null;
  citations: CitationResult | null;
  reportImagesIssues: PsiIssue[] | null;
  observation?: string;
  pageIndex: number;
  pageTotal: number;
};

export default function WhatWeFoundSlide({ signals, auditScore, grid, citations, reportImagesIssues, observation, pageIndex, pageTotal }: WhatWeFoundSlideProps) {
  const findings = deriveFindings(signals, auditScore, reportImagesIssues);
  const strengths = deriveStrengths(signals, grid, citations);
  const bySeverity = countBySeverity(findings);

  return (
    <section
      className="slide"
      style={{ padding: "80px 96px", display: "flex", position: "relative", flexDirection: "column", width: "100%", height: "100%", boxSizing: "border-box", background: "linear-gradient(120deg, #F7F6FB 0%, #F2F0FA 40%, #F6F3F6 75%, #F5F3F0 100%)" }}
    >
      <div style={{ position: "absolute", right: "-8%", top: "-25%", width: "65%", height: "150%", background: "radial-gradient(circle, rgba(124,92,250,0.10), transparent 68%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 40, bottom: 40, fontSize: 24, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", color: "#7C5CFA" }}>
        {String(pageIndex).padStart(2, "0")}
        <span style={{ color: "#C7BEF5" }}> / {pageTotal}</span>
      </div>
      <div className="eyebrow" style={{ marginBottom: 20, color: "#7C5CFA", fontWeight: 700, position: "relative" }}>
        The findings
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 32px", position: "relative" }}>
        What we found.
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32, position: "relative" }}>
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px 30px", display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)" }}>
          <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#EFEAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={1.8}>
              <rect x="6" y="4" width="12" height="16" rx="1.5" />
              <rect x="9" y="2.5" width="6" height="3" rx="1" />
              <line x1="9" y1="11" x2="15" y2="11" strokeLinecap="round" />
              <line x1="9" y1="15" x2="13" y2="15" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <div className="eyebrow" style={{ color: "#9C9C9C", marginBottom: 8 }}>
              Audit score
            </div>
            <div className="disp tab" style={{ fontSize: 40, fontWeight: 700, color: "#7C5CFA" }}>
              {auditScore ? (
                <>
                  {auditScore.total}
                  <span style={{ fontSize: "0.45em", color: "#ABABAB", fontWeight: 600 }}>/100</span>
                </>
              ) : (
                "Not scored"
              )}
            </div>
          </div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px 30px", display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)" }}>
          <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#E3F4E9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F7A47" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <div className="eyebrow" style={{ color: "#9C9C9C", marginBottom: 8 }}>
              Gaps found
            </div>
            <div className="disp tab" style={{ fontSize: 40, fontWeight: 700, color: "#1F7A47" }}>
              {findings.length}
            </div>
            <div style={{ fontSize: 20, marginTop: 4 }}>
              {findings.length > 0 ? (
                <>
                  {bySeverity.high > 0 && <span style={{ color: "#A8362B", fontWeight: 600 }}>{bySeverity.high} high</span>}
                  {bySeverity.high > 0 && (bySeverity.medium > 0 || bySeverity.low > 0) && <span style={{ color: "#6B6B6B" }}> · </span>}
                  {bySeverity.medium > 0 && <span style={{ color: "#C1691E", fontWeight: 600 }}>{bySeverity.medium} medium</span>}
                  {bySeverity.medium > 0 && bySeverity.low > 0 && <span style={{ color: "#6B6B6B" }}> · </span>}
                  {bySeverity.low > 0 && <span style={{ color: "#6B6B6B" }}>{bySeverity.low} low</span>}
                </>
              ) : (
                <span style={{ color: "#6B6B6B" }}>None found</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px 30px", display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)" }}>
          <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#EFEAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={1.8}>
              <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <div className="eyebrow" style={{ color: "#9C9C9C", marginBottom: 8 }}>
              Strengths
            </div>
            <div className="disp tab" style={{ fontSize: 40, fontWeight: 700, color: "#7C5CFA" }}>
              {strengths.length}
            </div>
            <div style={{ fontSize: 20, color: "#6B6B6B", marginTop: 4 }}>{strengths.length > 0 ? strengths.map((s) => s.shortLabel).join(", ") : "None measured yet"}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
        <div>
          <div className="obs-label" style={{ marginBottom: 12, color: "#7C5CFA", fontWeight: 700 }}>
            Gaps to fix
          </div>
          {findings.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 110px 1.6fr 1.3fr", gap: 20, padding: "8px 0", borderBottom: "1px solid #E4E4E4" }}>
                <span />
                <span style={{ fontSize: 18, color: "#ABABAB", textTransform: "uppercase", letterSpacing: "0.06em" }}>Finding</span>
                <span style={{ fontSize: 18, color: "#ABABAB", textTransform: "uppercase", letterSpacing: "0.06em" }}>Severity</span>
                <span style={{ fontSize: 18, color: "#ABABAB", textTransform: "uppercase", letterSpacing: "0.06em" }}>Evidence</span>
                <span style={{ fontSize: 18, color: "#ABABAB", textTransform: "uppercase", letterSpacing: "0.06em" }}>Impact</span>
              </div>
              {findings.map((f, i) => (
                <div
                  key={f.key}
                  style={{ display: "grid", gridTemplateColumns: "56px 1fr 110px 1.6fr 1.3fr", gap: 20, alignItems: "center", padding: "16px 0", borderBottom: i < findings.length - 1 ? "1px solid #EDEDED" : undefined }}
                >
                  <span style={{ width: 36, height: 36, borderRadius: "50%", background: SEVERITY_BADGE_BG[f.severity], display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={SEVERITY_ICON_COLOR[f.severity]} strokeWidth={2}>
                      {FINDING_ICON[f.key]}
                    </svg>
                  </span>
                  <span style={{ fontSize: 22, fontWeight: 600, color: "#111111" }}>{f.title}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: SEVERITY_CHIP_COLOR[f.severity], background: SEVERITY_CHIP_BG[f.severity], padding: "5px 12px", borderRadius: 20, textAlign: "center", width: "fit-content" }}>
                    {SEVERITY_LABEL[f.severity]}
                  </span>
                  <span style={{ fontSize: 20, color: "#6B6B6B" }}>{f.evidence}</span>
                  <span style={{ fontSize: 20, color: "#111111", fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={SEVERITY_ICON_COLOR[f.severity]} strokeWidth={2}>
                      {IMPACT_ICON[f.key]}
                    </svg>
                    {f.impact}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "24px 0", fontSize: 22, color: "#6B6B6B" }}>No real gaps found in this audit.</div>
          )}
        </div>

        {strengths.length > 0 ? (
          <div style={{ background: "#111111", borderRadius: 16, padding: "22px 32px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "#7C5CFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.8}>
                <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7z" />
              </svg>
            </span>
            <span className="eyebrow" style={{ color: "#B7A4F9", flexShrink: 0, fontWeight: 700 }}>
              Strengths to protect
            </span>
            {strengths.map((s, i) => (
              <span key={s.key} style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <span style={{ width: 1, height: 24, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
                <span style={{ fontSize: 21, color: "#FFFFFF", fontWeight: 600 }}>{s.fullLabel}</span>
                {i === strengths.length - 1 ? null : null}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ background: "#111111", borderRadius: 16, padding: "22px 32px", color: "#B7A4F9", fontSize: 21, fontWeight: 600 }}>
            No strengths measured strongly enough to call out yet.
          </div>
        )}
      </div>

      <div className="obs">{observation ?? OBSERVATION_STATIC_FALLBACKS.what_we_found}</div>
    </section>
  );
}

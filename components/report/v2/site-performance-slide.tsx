import type { PageSpeedOpportunity } from "@/lib/report-images-core";
import { sumPsiOpportunitySavings } from "@/lib/report-images-core";

// Pixel-perfect port of the prototype's Site Performance Detail <section>
// (Audit Deck.dc.html, slide 10, data-om-slide-id 83338bc8). Every row is a
// REAL stored opportunity (signals.performance.pageSpeedOpportunities, added
// this session — commit 28c3675); the summary band sums ONLY those stored
// rows (sumPsiOpportunitySavings), never re-derived from a raw PSI response,
// so the two always agree.
//
// The prototype hand-picks a distinct icon per opportunity TITLE (JS,
// render-blocking, images, server, minify) — real opportunities can be any
// PSI audit title, so a single generic icon (colored by severity, same as
// the badge circle) stands in for all rows rather than guessing a per-title
// icon mapping.

const SEVERITY_BADGE_BG: Record<PageSpeedOpportunity["severity"], string> = {
  high: "#7A2A22",
  medium: "#C1691E",
  low: "#2E9E5B",
};
// A SEPARATE, more muted color language for the pill itself — matches the
// prototype exactly (high is the only loud one; medium/low fade back).
const SEVERITY_CHIP: Record<PageSpeedOpportunity["severity"], { bg: string; color: string; label: string }> = {
  high: { bg: "#7A2A22", color: "#FFFFFF", label: "High" },
  medium: { bg: "#EFEFEF", color: "#6B6B6B", label: "Medium" },
  low: { bg: "#F7F7F7", color: "#ABABAB", label: "Low" },
};

function formatSavings(o: PageSpeedOpportunity): string {
  const parts: string[] = [];
  if (o.savingsMs != null) parts.push(`${(o.savingsMs / 1000).toFixed(1)}s`);
  if (o.savingsKb != null) parts.push(`${o.savingsKb} KB`);
  return parts.length > 0 ? parts.join(" · ") : "—";
}

export type SitePerformanceSlideProps = {
  bizName: string;
  website: string | null;
  opportunities: PageSpeedOpportunity[] | null;
  pageIndex: number;
  pageTotal: number;
};

export default function SitePerformanceSlide({ bizName, website, opportunities, pageIndex, pageTotal }: SitePerformanceSlideProps) {
  const notRun = opportunities === null;
  const clean = !notRun && opportunities!.length === 0;
  const summary = sumPsiOpportunitySavings(opportunities);

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
        The website
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 12px", position: "relative" }}>
        Exactly what&apos;s slowing the site down.
      </h2>
      <p style={{ fontSize: 24, color: "#6B6B6B", margin: "0 0 40px", position: "relative" }}>
        The full PageSpeed opportunity list{website ? ` for ${website}` : ""}.
      </p>

      {notRun ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9C9C9C", fontSize: 28, fontWeight: 600, textAlign: "center" }}>
          PageSpeed data isn&apos;t available for this site.
        </div>
      ) : clean ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, color: "#2E2E2E", fontSize: 28, fontWeight: 600, textAlign: "center" }}>
          <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#EAF6EF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E9E5B" strokeWidth={2}>
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          No major performance issues found for {bizName}&apos;s site.
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 24, marginBottom: 32, position: "relative" }}>
            <div style={{ flex: 1, background: "#FFFFFF", borderRadius: 16, padding: "24px 32px", display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 10px 24px -6px rgba(17,17,17,0.10)" }}>
              <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#EFEAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={1.8}>
                  <rect x="5" y="7" width="14" height="12" rx="1.5" />
                  <path d="M9 7V5.5a3 3 0 016 0V7" strokeLinecap="round" />
                  <path d="M9.5 12l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <div className="eyebrow" style={{ color: "#9C9C9C", marginBottom: 8 }}>
                  Potential size savings
                </div>
                <div className="disp tab" style={{ fontSize: 44, fontWeight: 700, color: "#7C5CFA" }}>
                  {summary.totalSavingsKb} KB
                </div>
              </div>
            </div>
            <div style={{ flex: 1, background: "#FFFFFF", borderRadius: 16, padding: "24px 32px", display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 10px 24px -6px rgba(17,17,17,0.10)" }}>
              <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#EFEAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={1.8}>
                  <circle cx="12" cy="13" r="7.5" />
                  <path d="M12 13l3-3" strokeLinecap="round" />
                  <path d="M9 4h6" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <div className="eyebrow" style={{ color: "#9C9C9C", marginBottom: 8 }}>
                  Potential time savings
                </div>
                <div className="disp tab" style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em", color: "#7C5CFA" }}>
                  {(summary.totalSavingsMs / 1000).toFixed(1)}
                  <span className="sep">s</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, position: "relative" }}>
            {opportunities!.map((o, i) => {
              const chip = SEVERITY_CHIP[o.severity];
              return (
                <div
                  key={o.title + i}
                  style={{ display: "grid", gridTemplateColumns: "56px 1fr 110px 150px", gap: 24, alignItems: "center", background: "#FFFFFF", borderRadius: 14, padding: "18px 28px", boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 10px 24px -6px rgba(17,17,17,0.10)" }}
                >
                  <span style={{ width: 44, height: 44, borderRadius: "50%", background: SEVERITY_BADGE_BG[o.severity], display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2}>
                      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ fontSize: 25, color: "#111111", fontWeight: 500 }}>{o.title}</span>
                  <span className="tab" style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: chip.color, background: chip.bg, padding: "6px 16px", borderRadius: 20, textAlign: "center" }}>
                    {chip.label}
                  </span>
                  <span className="tab" style={{ fontSize: 24, fontWeight: 700, color: "#111111", textAlign: "right" }}>
                    {formatSavings(o)}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* STATIC PLACEHOLDER, same treatment as the earlier slides' Observation
          boxes — observation generation is out of scope for this step. */}
      <div className="obs" style={{ background: "#F4F1FD", border: "none", borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", gap: 20, marginTop: 24, position: "relative" }}>
        <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#7C5CFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.8}>
            <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.45 1 1.2 1 2.1h5c0-.9.4-1.65 1-2.1A6 6 0 0012 3z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <div className="obs-label" style={{ color: "#7C5CFA", fontWeight: 700, marginBottom: 4 }}>
            Observation
          </div>
          This is the public diagnosis, in full. What it takes to fix it is a separate question from what it is.
        </div>
      </div>
    </section>
  );
}

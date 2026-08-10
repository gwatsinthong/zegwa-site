import type { ProspectSignals } from "@/lib/signals";
import type { AuditScoreResult } from "@/lib/audit-score";
import type { PsiIssue } from "@/lib/report-images-core";
import { deriveFixes } from "@/lib/report-findings";

// Pixel-perfect port of the prototype's Fix List <section> (Audit
// Deck.dc.html, slide 15, data-om-slide-id fa390845).
//
// CONFIRM-BEFORE-WIRING FINDING: the fix list is NOT a fixed 5-item
// template — see findings.ts's deriveFixes doc comment. Each row is
// conditional on its own real underlying signal (booking_or_enquiry,
// contact_form, https, pageSpeed/opportunities, privacy/about pages) —
// a fix only renders when its gap is real, e.g. never "Move to HTTPS"
// when HTTPS is already enabled. Rows are renumbered sequentially so a
// lead missing only 2 of the 5 possible fixes still sees "1" and "2",
// never a gap in the numbering.

export type FixListSlideProps = {
  bizName: string;
  signals: ProspectSignals | null | undefined;
  auditScore: AuditScoreResult | null;
  issues: PsiIssue[] | null;
  pageIndex: number;
  pageTotal: number;
};

export default function FixListSlide({ bizName, signals, auditScore, issues, pageIndex, pageTotal }: FixListSlideProps) {
  const fixes = deriveFixes(signals, auditScore, issues);

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
        The fix
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 40px", position: "relative" }}>
        {bizName}&apos;s fix list, highest impact first.
      </h2>

      {fixes.length > 0 ? (
        // justifyContent was "center": on a flex:1 column, centering split
        // any leftover space evenly above AND below the row stack — dead
        // space the reader never sees any content in. flex-start collects
        // it in one place instead (below the rows, before the footer),
        // removing the wasted gap without touching row content or count.
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 18, position: "relative" }}>
          {fixes.map((f, i) => (
            <div
              key={f.key}
              style={{
                background: "#FFFFFF",
                borderRadius: 14,
                padding: "24px 36px 24px 32px",
                display: "grid",
                gridTemplateColumns: "60px 1fr 200px",
                gap: 28,
                alignItems: "center",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 32px -12px rgba(17,17,17,0.14)",
                borderLeft: `5px solid ${f.color}`,
              }}
            >
              <span style={{ width: 52, height: 52, borderRadius: "50%", background: f.bg, color: f.color, fontFamily: "'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i + 1}
              </span>
              <div>
                <div style={{ fontSize: 27, fontWeight: 600, color: "#111111", marginBottom: 6 }}>{f.fix}</div>
                <div style={{ fontSize: 22, color: "#6B6B6B" }}>{f.rationale}</div>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: f.color, background: f.bg, padding: "8px 16px", borderRadius: 8, textAlign: "center" }}>
                {f.impact}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9C9C9C", fontSize: 28, fontWeight: 600 }}>
          No further site fixes identified from this audit.
        </div>
      )}

      {/* STATIC PLACEHOLDER, same treatment as the earlier slides' Observation
          boxes — the "damaging admission" line is deliberate, generic sales
          copy per the prototype, not a per-lead claim. */}
      <div className="obs" style={{ display: "flex", alignItems: "flex-start", gap: 20, position: "relative" }}>
        <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#7C5CFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.8}>
            <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7z" />
          </svg>
        </span>
        <div>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#7C5CFA" }}>{bizName} can do all of this without us.</span>
          <span style={{ fontSize: 24, color: "#4A4A4A" }}> If {bizName} would rather it just get done, that&apos;s what we do.</span>
        </div>
      </div>
    </section>
  );
}

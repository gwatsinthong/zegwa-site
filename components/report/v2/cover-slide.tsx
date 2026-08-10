import { tabularNumber } from "./deck-format";
import { bucketFraction } from "@/lib/verdict-pillars";
import type { AuditScoreResult } from "@/lib/audit-score";

// Pixel-perfect port of the prototype's Cover <section> (Audit Deck.dc.html,
// slide 1) — every numeric/text value below is wired from real audit data
// (see v2/page.tsx); only the "TODO" style/markup structure is copied
// verbatim from the design. Padding, gradients, font sizes, and colors are
// copied 1:1 from the prototype's inline styles — do not restyle.

type PillarKey = "visibility" | "conversion" | "health";
type PillarState = "strong" | "mid" | "weak";

const PILLAR_LABEL: Record<PillarState, string> = {
  strong: "Strong",
  mid: "Below Average",
  weak: "Weak",
};
// Ring/icon colors reuse the SAME three tones the shared .chip-strong/
// .chip-mid/.chip-weak classes use elsewhere in the deck, for consistency.
const PILLAR_COLOR: Record<PillarState, string> = {
  strong: "#1F7A47",
  mid: "#E8873A",
  weak: "#C1483B",
};

/** Buckets a real sub-score fraction into an honest 3-tier state. Never a
 *  fabricated label: computed directly from the same points/maxPoints the
 *  rest of the deck (Verdict slide, Trust Signals slide) reads — same
 *  bucketing shared via verdict-pillars.ts's bucketFraction, so the two
 *  slides can never silently drift apart on what counts as "strong". */
export function pillarState(points: number, max: number): PillarState {
  return bucketFraction(points, max);
}

const PILLAR_ICON: Record<PillarKey, React.ReactNode> = {
  visibility: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
    </svg>
  ),
  conversion: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="13" rx="1.5" />
      <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" />
    </svg>
  ),
  health: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
      <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const PILLAR_TITLE: Record<PillarKey, string> = {
  visibility: "VISIBILITY",
  conversion: "WEBSITE",
  health: "TRUST",
};

export type CoverSlideProps = {
  bizName: string;
  preparedDate: string | null;
  leakHeadlineFormatted: string | null; // formatMoney(estimate.headline), or null when no leak was computed
  headline: string;
  body: string;
  auditScore: AuditScoreResult | null;
  pillarMax: Record<PillarKey, number>;
  pageIndex: number;
  pageTotal: number;
};

export default function CoverSlide({
  bizName,
  preparedDate,
  leakHeadlineFormatted,
  headline,
  body,
  auditScore,
  pillarMax,
  pageIndex,
  pageTotal,
}: CoverSlideProps) {
  const total = auditScore?.total ?? null;

  return (
    <section className="slide" style={{ padding: "80px 96px", display: "flex", position: "relative", flexDirection: "column", width: "100%", height: "100%", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", right: 40, bottom: 40, fontSize: 24, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", color: "#D2D2D2" }}>
        {String(pageIndex).padStart(2, "0")}
        <span style={{ color: "#E8E8E8" }}> / {pageTotal}</span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, paddingBottom: 28, borderBottom: "1px solid rgba(17,17,17,0.1)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.02em", textTransform: "uppercase", color: "#111111" }}>Marketing Audit</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: "#6B6B6B" }}>
            Prepared for {bizName}
            {preparedDate && (
              <>
                <span style={{ color: "#C7C7C7", margin: "0 10px" }}>·</span>
                {preparedDate}
              </>
            )}
          </div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.12em", color: "#111111", flexShrink: 0, whiteSpace: "nowrap" }}>ZEGWA</div>
      </div>

      <div style={{ flex: 1, position: "relative", borderRadius: 28, overflow: "hidden", marginTop: 8, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, #F7F6FB 0%, #F2F0FA 40%, #F6F3F6 75%, #F5F3F0 100%)" }} />
        <div style={{ position: "absolute", right: "-8%", top: "-25%", width: "65%", height: "150%", background: "radial-gradient(circle, rgba(124,92,250,0.10), transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "-10%", bottom: "-30%", width: "50%", height: "90%", background: "radial-gradient(circle, rgba(124,92,250,0.05), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 72, padding: "0 64px" }}>
          <div style={{ flex: 1.25 }}>
            <div className="eyebrow" style={{ marginBottom: 4, color: "#7C5CFA" }}>Estimated monthly lost leads</div>
            {leakHeadlineFormatted ? (
              <div className="disp tab" style={{ fontSize: 132, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, background: "linear-gradient(160deg, #4A3AA8 0%, #14102B 90%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", whiteSpace: "nowrap" }}>
                {tabularNumber(leakHeadlineFormatted)}
              </div>
            ) : (
              <div className="disp" style={{ fontSize: 44, fontWeight: 700, color: "#9C9C9C" }}>Not yet estimated</div>
            )}
            <h1 className="disp" style={{ fontSize: 50, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.22, color: "#1A1A1A", margin: "20px 0 0", maxWidth: "13ch", textWrap: "pretty" }}>
              {headline}
            </h1>
            <div style={{ width: 64, height: 3, background: "rgba(124,92,250,0.4)", borderRadius: 2, margin: "30px 0" }} />
            <p style={{ fontSize: 28, color: "#6B6B6B", margin: 0, fontWeight: 500, maxWidth: "44ch", lineHeight: 1.55 }}>{body}</p>
          </div>

          <div style={{ flex: 0.9, display: "flex", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "absolute", bottom: "-5%", left: "50%", transform: "translateX(-50%)", width: 380, height: 100, background: "radial-gradient(ellipse, rgba(17,17,17,0.22), transparent 72%)", filter: "blur(8px)" }} />
            <div style={{ position: "relative", background: "linear-gradient(165deg, #1A1A1A 0%, #0C0C0C 100%)", borderRadius: 20, padding: "52px 52px 42px", minWidth: 520, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(17,17,17,0.03), 0 20px 40px -8px rgba(17,17,17,0.28), 0 8px 16px -4px rgba(17,17,17,0.22)", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: 90, height: 90, backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1.5px, transparent 1.5px)", backgroundSize: "12px 12px", WebkitMaskImage: "linear-gradient(225deg, #000 20%, transparent 70%)", maskImage: "linear-gradient(225deg, #000 20%, transparent 70%)" }} />
              <div className="eyebrow" style={{ marginBottom: 20, color: "#7C5CFA" }}>Audit score</div>
              {total != null ? (
                <>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <div className="disp tab" style={{ fontSize: 142, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#FFFFFF" }}>{total}</div>
                    <span style={{ fontSize: 38, fontWeight: 600, color: "#6B6B6B" }}>/100</span>
                  </div>
                  <div style={{ marginTop: 30, position: "relative", height: 8, borderRadius: 999, background: "linear-gradient(90deg, #7C5CFA 0%, #E8873A 55%, #C1483B 100%)" }}>
                    <div style={{ position: "absolute", left: `${total}%`, top: -6, transform: "translateX(-50%)", width: 3, height: 20, background: "#E8873A", borderRadius: 2 }} />
                  </div>
                  <div className="tab" style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 22, color: "#6B6B6B" }}>
                    <span>0</span>
                    <span>100</span>
                  </div>
                </>
              ) : (
                <div className="disp" style={{ fontSize: 44, fontWeight: 700, color: "#6B6B6B" }}>Not yet scored</div>
              )}

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 30, paddingTop: 28, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, textAlign: "center" }}>
                {(["visibility", "conversion", "health"] as PillarKey[]).map((key) => {
                  const pillar = auditScore?.pillars[key] ?? null;
                  const max = pillarMax[key];
                  const state = pillar != null ? pillarState(pillar, max) : null;
                  const color = state ? PILLAR_COLOR[state] : "#4A4A4A";
                  return (
                    <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", border: `1.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                        {PILLAR_ICON[key]}
                      </div>
                      <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.04em", color: "#FFFFFF" }}>{PILLAR_TITLE[key]}</span>
                      <span style={{ fontSize: 17, color: "#8A8A8A" }}>{state ? PILLAR_LABEL[state] : "Not measured"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#ABABAB", fontSize: 24, fontWeight: 600, paddingTop: 12 }}>
        <span>The verdict</span>
        <span style={{ fontSize: 24 }}>&rarr;</span>
      </div>
    </section>
  );
}

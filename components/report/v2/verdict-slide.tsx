import type { AuditScoreResult } from "@/lib/audit-score";
import type { ProspectSignals } from "@/lib/signals";
import type { SearchVisibilityResult } from "@/lib/search-visibility-core";
import { reputationCard, visibilityCard, conversionCard, healthCard, verdictHeadline, type PillarCard, type ChipState } from "@/lib/verdict-pillars";
import { OBSERVATION_STATIC_FALLBACKS } from "@/lib/observation-static-fallbacks";

// Pixel-perfect port of the prototype's Verdict <section> (Audit Deck.dc.html,
// slide 2, data-om-slide-id 8f85ef88). Score card + pillar grid reuse the
// SAME computeAuditScore breakdown the Cover slide reads.
//
// The headline used to reuse Cover's own opener (pickVisceralOpener)
// verbatim — confirmed a real bug (recon): both slides rendered the
// IDENTICAL sentence back to back. Verdict now builds its own headline
// (verdict-pillars.ts's verdictHeadline) from the score total + whichever
// of the four pillar cards below is weakest — a distinct, score-anchored
// standing statement rather than a restated wound, built only from data
// this slide already computes.

const CHIP_LABEL: Record<ChipState, string> = {
  strong: "Strong",
  mid: "Needs work",
  weak: "Missing",
  unmeasured: "Not measured",
};
const CHIP_CLASS: Record<ChipState, string | null> = {
  strong: "chip chip-strong",
  mid: "chip chip-mid",
  weak: "chip chip-weak",
  unmeasured: null,
};
// Bottom-border accent colors, copied 1:1 from the prototype's four cards.
// "unmeasured" has no prototype precedent (Atlas's real data measured every
// pillar) — a neutral gray, matching the honest-fallback gray used elsewhere
// in this deck, rather than inventing a "bad" or "good" color for an absent
// measurement.
const BORDER_COLOR: Record<ChipState, string> = {
  strong: "#2E9E5B",
  mid: "#E8873A",
  weak: "#A8362B",
  unmeasured: "#D2D2D2",
};

function PillarCardView({ card }: { card: PillarCard }) {
  const chipClass = CHIP_CLASS[card.chipState];
  return (
    <div
      style={{
        position: "relative",
        background: "#FFFFFF",
        borderRadius: 16,
        padding: "32px 30px 38px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 10px 24px -6px rgba(17,17,17,0.10)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: BORDER_COLOR[card.chipState] }} />
      <span className="eyebrow" style={{ color: "#7C5CFA", marginBottom: 14, fontWeight: 700 }}>
        {card.eyebrow}
      </span>
      <div className="disp" style={{ fontSize: 34, fontWeight: 700, color: "#111111", lineHeight: 1.15, marginBottom: "auto" }}>
        {card.headline}
      </div>
      <div style={{ borderTop: "1px solid rgba(17,17,17,0.10)", marginTop: 22, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {chipClass ? (
            <span className={chipClass}>{CHIP_LABEL[card.chipState]}</span>
          ) : (
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 5, color: "#8A8A8A", background: "#F0F0F0" }}>
              {CHIP_LABEL[card.chipState]}
            </span>
          )}
          <span className="tab" style={{ fontSize: 24, color: "#ABABAB" }}>
            {card.points} / {card.max}
          </span>
        </div>
        <div className="tab" style={{ fontSize: 24, fontWeight: 600, color: "#8A8A8A" }}>
          {card.subMath}
        </div>
      </div>
    </div>
  );
}

export type VerdictSlideProps = {
  auditScore: AuditScoreResult | null;
  signals: ProspectSignals | null | undefined;
  searchVisibility: SearchVisibilityResult | null | undefined;
  observation?: string;
  pageIndex: number;
  pageTotal: number;
};

export default function VerdictSlide({ auditScore, signals, searchVisibility, observation, pageIndex, pageTotal }: VerdictSlideProps) {
  const total = auditScore?.total ?? null;
  const breakdown = auditScore?.breakdown ?? null;
  const cards = breakdown
    ? [reputationCard(signals, breakdown), visibilityCard(searchVisibility, breakdown), conversionCard(signals, breakdown), healthCard(signals, breakdown)]
    : null;
  const headline = verdictHeadline(total, cards);

  return (
    <section
      className="slide"
      style={{
        padding: "80px 96px",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        background: "linear-gradient(120deg, #F7F6FB 0%, #F2F0FA 40%, #F6F3F6 75%, #F5F3F0 100%)",
      }}
    >
      <div style={{ position: "absolute", right: "-8%", top: "-25%", width: "65%", height: "150%", background: "radial-gradient(circle, rgba(124,92,250,0.10), transparent 68%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: "-10%", bottom: "-30%", width: "50%", height: "90%", background: "radial-gradient(circle, rgba(124,92,250,0.05), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 40, bottom: 40, fontSize: 24, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", color: "#7C5CFA" }}>
        {String(pageIndex).padStart(2, "0")}
        <span style={{ color: "#C7BEF5" }}> / {pageTotal}</span>
      </div>

      <div style={{ flex: 1, display: "flex", gap: 72, alignItems: "center", position: "relative" }}>
        <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column" }}>
          <div className="eyebrow" style={{ marginBottom: 20, color: "#7C5CFA", fontWeight: 700 }}>
            The verdict
          </div>
          <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 40px", textWrap: "pretty" }}>
            {headline}
          </h2>

          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", bottom: "-5%", left: "50%", transform: "translateX(-50%)", width: 320, height: 80, background: "radial-gradient(ellipse, rgba(124,92,250,0.28), transparent 72%)", filter: "blur(8px)" }} />
            <div
              style={{
                position: "relative",
                background: "linear-gradient(165deg, #1A1A1A 0%, #0C0C0C 100%)",
                borderRadius: 20,
                padding: "44px 48px",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 60px rgba(124,92,250,0.08), 0 0 0 1px rgba(17,17,17,0.03), 0 20px 40px -8px rgba(17,17,17,0.28), 0 8px 16px -4px rgba(17,17,17,0.22)",
              }}
            >
              <div className="eyebrow" style={{ marginBottom: 18, color: "#7C5CFA", fontWeight: 700 }}>
                Audit score
              </div>
              {total != null ? (
                <>
                  <div className="disp tab" style={{ fontSize: 92, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: "#FFFFFF" }}>
                    {total}
                    <span style={{ fontSize: "0.32em", fontWeight: 600, color: "#6B6B6B" }}>/100</span>
                  </div>
                  <div style={{ marginTop: 26, position: "relative", height: 8, borderRadius: 999, background: "linear-gradient(90deg, #7C5CFA 0%, #E8873A 60%, #C1483B 100%)" }}>
                    <div style={{ position: "absolute", left: `${total}%`, top: -6, transform: "translateX(-50%)", width: 3, height: 20, background: "#E8873A", borderRadius: 2 }} />
                  </div>
                  <div className="tab" style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 24, color: "#6B6B6B" }}>
                    <span>0</span>
                    <span>100</span>
                  </div>
                </>
              ) : (
                <div className="disp" style={{ fontSize: 40, fontWeight: 700, color: "#6B6B6B" }}>
                  Not yet scored
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, alignSelf: "stretch", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: 24 }}>
          {cards ? (
            <>
              {cards.map((card) => (
                <PillarCardView key={card.eyebrow} card={card} />
              ))}
            </>
          ) : (
            <div style={{ gridColumn: "1 / -1", gridRow: "1 / -1", display: "flex", alignItems: "center", justifyContent: "center", color: "#9C9C9C", fontSize: 24, fontWeight: 600 }}>
              Not yet scored
            </div>
          )}
        </div>
      </div>

      <div className="obs" style={{ marginTop: 0, maxWidth: "70ch" }}>
        <div className="obs-label" style={{ color: "#7C5CFA", fontWeight: 700 }}>
          Observation
        </div>
        {observation ?? OBSERVATION_STATIC_FALLBACKS.verdict}
      </div>
    </section>
  );
}

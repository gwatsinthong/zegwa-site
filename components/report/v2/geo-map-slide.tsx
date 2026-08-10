import type { SearchVisibilityGridResult } from "@/lib/search-visibility-grid-core";
import { SCREEN_TO_DATA_INDEX, CENTER_SCREEN_SLOT, PIN_POSITIONS } from "./geo-map-layout";
import { tabularNumber } from "./deck-format";

// Pixel-perfect port of the prototype's Geo Map <section> (Audit Deck.dc.html,
// slide 7, data-om-slide-id 083c0023). This is the slide the brief calls out
// as structurally incapable of showing a fabricated grid: every pin below
// reads its rank directly off audit.searchVisibilityGrid.points[i] (see
// geo-map-layout.ts for why the screen position needs a data-index remap),
// and the "X of 9 zones" stat is a live count over those same points — there
// is no hardcoded "9" or "#1" anywhere in this file.

function Pin({ position, rank, appeared, isCenter }: { position: { left: number; top: number; size: number }; rank: number | null; appeared: boolean; isCenter: boolean }) {
  const bg = appeared ? "#111111" : "#D9D9D9";
  const labelColor = appeared ? "#FFFFFF" : "#9C9C9C";
  const highlightStyle = isCenter
    ? { border: "3px solid #FFFFFF", boxShadow: appeared ? "0 0 0 3px #7C5CFA, 0 6px 12px rgba(124,92,250,0.4)" : "0 0 0 3px #C7BEF5, 0 6px 12px rgba(124,92,250,0.2)" }
    : { boxShadow: "0 4px 8px rgba(17,17,17,0.25)" };
  const labelSize = isCenter ? 20 : 18;
  const labelOffset = isCenter ? "-145%" : "-138%";
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          transform: "translate(-50%, -100%) rotate(45deg)",
          width: position.size,
          height: position.size,
          borderRadius: "50% 50% 50% 0",
          background: bg,
          ...highlightStyle,
        }}
      />
      <div
        className="tab"
        style={{ position: "absolute", left: position.left, top: position.top, transform: `translate(-50%, ${labelOffset})`, fontSize: labelSize, fontWeight: 700, color: labelColor }}
      >
        {appeared ? `#${rank}` : "—"}
      </div>
    </>
  );
}

export type GeoMapSlideProps = {
  bizName: string;
  grid: SearchVisibilityGridResult | null;
  pageIndex: number;
  pageTotal: number;
};

// The lead's real rank at every zone where it actually appeared (rank is
// null when appeared is false — never included here). Used to tell "#1 in
// every zone" apart from "appeared in every zone but not always #1", so the
// headline and body copy below can share ONE gate instead of two that could
// silently drift apart (production bug: the body copy used to be gated only
// on zonesAppeared === total, so it claimed "no rival places above it" even
// when the lead was #2, not #1, in every zone — a real rival WAS above it at
// every point, and it directly contradicted its own headline three lines
// above, which correctly said "appears in 9 of 9 zones", not "#1 in 9 of 9").
function appearedRanks(points: { rank: number | null; appeared: boolean }[]): number[] {
  return points.filter((p) => p.appeared && p.rank != null).map((p) => p.rank!);
}

type GridState = "not_measured" | "no_appearance" | "dominant" | "uniform_rank" | "varied_rank" | "partial";

/** ONE classification, shared by the headline and the body copy below —
 *  the single source of truth that keeps them from being able to contradict
 *  each other again. */
function classifyGrid(hasGrid: boolean, zonesAppeared: number, total: number, ranks: number[]): GridState {
  if (!hasGrid) return "not_measured";
  if (zonesAppeared === 0) return "no_appearance";
  if (zonesAppeared < total) return "partial";
  // zonesAppeared === total from here on: appeared in every zone checked.
  const allRank1 = ranks.length === total && ranks.every((r) => r === 1);
  if (allRank1) return "dominant";
  const uniform = ranks.length > 0 && ranks.every((r) => r === ranks[0]);
  return uniform ? "uniform_rank" : "varied_rank";
}

export default function GeoMapSlide({ bizName, grid, pageIndex, pageTotal }: GeoMapSlideProps) {
  const hasGrid = !!grid && grid.points.length > 0;
  const points = hasGrid ? grid!.points : [];
  const zonesAppeared = points.filter((p) => p.appeared).length;
  const total = points.length || 9;
  const ranks = appearedRanks(points);
  const uniformRank = ranks.length > 0 ? ranks[0] : null;
  const minRank = ranks.length > 0 ? Math.min(...ranks) : null;
  const maxRank = ranks.length > 0 ? Math.max(...ranks) : null;
  const state = classifyGrid(hasGrid, zonesAppeared, total, ranks);

  let headline: string;
  let subhead: string;
  switch (state) {
    case "not_measured":
      headline = "Map-pack rank hasn't been measured across zones yet.";
      subhead = "Re-running the audit will populate this once the grid check completes.";
      break;
    case "no_appearance":
      headline = `${bizName} did not appear in the map pack in any of the ${total} zones checked.`;
      subhead = "That's a real gap: nearby searchers aren't seeing this business in local results at all.";
      break;
    case "dominant":
      headline = `${bizName} ranks #1 in all ${total === 9 ? "nine" : total} zones checked.`;
      subhead = `${bizName} owns the map pack across its entire service radius. This is a genuine strength in the audit.`;
      break;
    case "uniform_rank":
      headline = `${bizName} appears in the map pack in all ${total === 9 ? "nine" : total} zones checked, ranking #${uniformRank} in each.`;
      subhead = "A real, consistent presence across the service area, though not the top spot, at least one rival ranks above it at every point checked.";
      break;
    case "varied_rank":
      headline = `${bizName} appears in the map pack in all ${total === 9 ? "nine" : total} zones checked, ranking between #${minRank} and #${maxRank}.`;
      subhead = "A real presence across the service area, with the rank shifting from zone to zone.";
      break;
    case "partial":
    default:
      headline = `${bizName} appears in the map pack in ${zonesAppeared} of ${total} zones checked.`;
      subhead = "Some nearby searches surface this business, others don't. Coverage is uneven across the service area.";
      break;
  }

  return (
    <section
      className="slide"
      style={{ padding: "80px 96px", display: "flex", position: "relative", flexDirection: "column", width: "100%", height: "100%", boxSizing: "border-box", background: "linear-gradient(120deg, #F7F6FB 0%, #F2F0FA 40%, #F6F3F6 75%, #F5F3F0 100%)" }}
    >
      <div style={{ position: "absolute", right: 40, bottom: 40, fontSize: 24, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", color: "#7C5CFA" }}>
        {String(pageIndex).padStart(2, "0")}
        <span style={{ color: "#C7BEF5" }}> / {pageTotal}</span>
      </div>
      <div className="eyebrow" style={{ marginBottom: 20, color: "#7C5CFA", fontWeight: 700, position: "relative" }}>
        The map
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 12px" }}>
        {headline}
      </h2>
      <p style={{ fontSize: 24, color: "#6B6B6B", margin: "0 0 40px" }}>{subhead}</p>

      <div style={{ display: "flex", gap: 80, alignItems: "center", flex: 1, position: "relative" }}>
        {hasGrid ? (
          <div style={{ flexShrink: 0, background: "#FFFFFF", borderRadius: 28, padding: 24, boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 24px 48px -12px rgba(17,17,17,0.14)" }}>
            <div style={{ width: 520, height: 520, position: "relative", borderRadius: 20, overflow: "hidden", background: "#F4F1FD" }}>
              <svg viewBox="0 0 520 520" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <path d="M 70 60 Q 40 140 60 220 Q 30 280 70 340 Q 50 420 130 460 Q 220 495 310 470 Q 400 490 460 420 Q 495 340 455 270 Q 480 190 430 120 Q 400 55 310 45 Q 220 20 150 45 Q 100 30 70 60 Z" fill="#E4E2EA" stroke="none" />
                <g stroke="#D5D2DE" strokeWidth={1.5} opacity={0.7}>
                  <line x1={0} y1={90} x2={520} y2={90} />
                  <line x1={0} y1={170} x2={520} y2={170} />
                  <line x1={0} y1={250} x2={520} y2={250} />
                  <line x1={0} y1={330} x2={520} y2={330} />
                  <line x1={0} y1={410} x2={520} y2={410} />
                  <line x1={90} y1={0} x2={90} y2={520} />
                  <line x1={180} y1={0} x2={180} y2={520} />
                  <line x1={270} y1={0} x2={270} y2={520} />
                  <line x1={360} y1={0} x2={360} y2={520} />
                  <line x1={450} y1={0} x2={450} y2={520} />
                </g>
                <g stroke="#C9C5D6" strokeWidth={2.5} opacity={0.6} fill="none">
                  <path d="M 60 120 Q 220 90 470 150" />
                  <path d="M 40 260 Q 250 230 500 300" />
                  <path d="M 90 420 Q 260 400 460 380" />
                </g>
              </svg>
              {SCREEN_TO_DATA_INDEX.map((dataIndex, screenSlot) => {
                const point = points[dataIndex];
                return (
                  <Pin
                    key={screenSlot}
                    position={PIN_POSITIONS[screenSlot]}
                    rank={point?.rank ?? null}
                    appeared={point?.appeared ?? false}
                    isCenter={screenSlot === CENTER_SCREEN_SLOT}
                  />
                );
              })}
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, background: "#EFEAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={2}>
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
                </svg>
              </span>
              <div style={{ fontSize: 20, color: "#6B6B6B", lineHeight: 1.4, maxWidth: 420 }}>
                Each pin is a spot near {bizName} where we checked its Google rank.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flexShrink: 0, width: 520, height: 520, borderRadius: 28, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 24px 48px -12px rgba(17,17,17,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "#9C9C9C", fontSize: 24, fontWeight: 600, textAlign: "center", padding: 48 }}>
            Grid not measured
          </div>
        )}

        <div style={{ flex: 1 }}>
          {hasGrid ? (
            <div className="disp tab" style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: "#7C5CFA", marginBottom: 20 }}>
              {tabularNumber(String(zonesAppeared))}
              <span style={{ fontSize: "0.4em", fontWeight: 600, color: "#6B6B6B" }}> of {total} zones</span>
            </div>
          ) : (
            <div className="disp" style={{ fontSize: 44, fontWeight: 700, color: "#9C9C9C", marginBottom: 20 }}>Grid not measured</div>
          )}
          <div style={{ width: 90, height: 3, background: "#7C5CFA", borderRadius: 2, marginBottom: 32 }} />
          <div style={{ fontSize: 30, color: "#2E2E2E", fontWeight: 500, lineHeight: 1.55, marginBottom: 40 }}>
            {/* Same `state` classification the headline above uses — this can
                no longer claim dominance ("no rival above it") in a case the
                headline itself doesn't, since both read off one gate. */}
            {state === "dominant" ? (
              <>
                {bizName} ranks <span style={{ fontWeight: 700, color: "#7C5CFA" }}>in every zone</span> we checked: no rival places above it nearby.
              </>
            ) : state === "uniform_rank" ? (
              <>
                {bizName} appears in the map pack across <span style={{ fontWeight: 700, color: "#7C5CFA" }}>all {total} zones</span>, ranking #{uniformRank} in each. A rival sits above it at every point checked.
              </>
            ) : state === "varied_rank" ? (
              <>
                {bizName} appears in the map pack across <span style={{ fontWeight: 700, color: "#7C5CFA" }}>all {total} zones</span>, ranking between #{minRank} and #{maxRank} depending on where the search happens.
              </>
            ) : state === "no_appearance" ? (
              <>
                {bizName} <span style={{ fontWeight: 700, color: "#7C5CFA" }}>did not appear</span> in any of the zones we checked.
              </>
            ) : state === "partial" ? (
              <>
                {bizName} appears in <span style={{ fontWeight: 700, color: "#7C5CFA" }}>{zonesAppeared} of {total}</span> zones we checked across its service area.
              </>
            ) : (
              "This check hasn't completed for this lead yet."
            )}
          </div>
          {hasGrid && (
            <div style={{ borderTop: "1px solid rgba(17,17,17,0.10)", paddingTop: 28, display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 14, background: "#EFEAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFA" strokeWidth={2}>
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div style={{ fontSize: 22, color: "#6B6B6B", lineHeight: 1.4 }}>
                This is {bizName}&apos;s map-pack rank at {total} points across its service area, distinct from the single city-center position on the demand slide.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

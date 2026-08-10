import type { KeywordRow } from "@/lib/search-visibility-core";
import { formatCpc } from "@/lib/currency";
import { tabularNumber } from "./deck-format";
import { OBSERVATION_STATIC_FALLBACKS } from "@/lib/observation-static-fallbacks";

// Pixel-perfect port of the prototype's Keyword Cluster <section> (Audit
// Deck.dc.html, slide 6, data-om-slide-id e0cd0bf1). sv.keywords is already
// curated upstream (search-visibility-core.ts's buildSearchVisibility):
// keywords[0] is always the seed term (kept even at null volume), and every
// OTHER zero/absent-volume tail term is already dropped before it's ever
// stored.
//
// FIXED-FRAME CAP (production overflow, live review on a data-heavy
// prospect — Detroit Dental): a real market can retain most/all 10 of a
// vertical's KEYWORD_TEMPLATES stems (keyword-templates.ts), and the v2
// deck's slides render inside a hard-fixed 1920x1080 canvas with no
// scroll/auto-grow — a long table clips silently past the frame. Capped to
// the head term (always kept, per the upstream contract above) plus the
// top KEYWORD_ROWS_TAIL_CAP tail terms BY REAL VOLUME DESCENDING — the same
// ordering the table's own bar-chart visualization already implies
// ("biggest first"), so capping to it is honest top-N, never a hidden
// cherry-pick.
//
// The prototype's "*Directional CPC, pending wire-in at reaudit" footnote is
// REMOVED here — confirmed this session that every row's CPC comes from the
// same real DataForSEO call as volume, so there is nothing directional left
// to caveat.

const KEYWORD_ROWS_TAIL_CAP = 7; // + the always-kept head term = 8 rows max

export type KeywordClusterSlideProps = {
  keywords: KeywordRow[] | null;
  country: string | null;
  observation?: string;
  pageIndex: number;
  pageTotal: number;
};

export default function KeywordClusterSlide({ keywords, country, observation, pageIndex, pageTotal }: KeywordClusterSlideProps) {
  const all = keywords ?? [];
  const [head, ...tail] = all;
  const cappedTail = [...tail].sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0)).slice(0, KEYWORD_ROWS_TAIL_CAP);
  const rows = head ? [head, ...cappedTail] : [];
  const maxVolume = rows.reduce((max, r) => Math.max(max, r.volume ?? 0), 0);

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
        The keywords
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 40px", position: "relative" }}>
        What local customers actually search for<span style={{ color: "#7C5CFA" }}>.</span>
      </h2>

      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "24px 40px", boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 20px 40px -10px rgba(17,17,17,0.12)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px 200px",
              gap: "0 22px",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#ABABAB",
              padding: "12px 0 10px",
              borderBottom: "1px solid rgba(17,17,17,0.14)",
            }}
          >
            <span>Search term</span>
            <span style={{ textAlign: "right" }}>Volume / mo</span>
            <span style={{ textAlign: "right" }}>Avg click</span>
          </div>

          {rows.length === 0 ? (
            <div style={{ padding: "40px 0", fontSize: 24, color: "#9C9C9C", fontWeight: 500 }}>No keyword data captured for this lead yet.</div>
          ) : (
            rows.map((row, i) => {
              const isHead = i === 0;
              const barWidth = maxVolume > 0 ? ((row.volume ?? 0) / maxVolume) * 100 : 0;
              return (
                <div
                  key={row.term + i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 340px 200px",
                    gap: "0 22px",
                    alignItems: "center",
                    padding: isHead ? "18px 22px" : "13px 0",
                    margin: isHead ? "4px -22px" : undefined,
                    borderRadius: isHead ? 12 : undefined,
                    background: isHead ? "#F4F1FD" : undefined,
                    borderBottom: !isHead && i < rows.length - 1 ? "1px solid rgba(17,17,17,0.06)" : undefined,
                  }}
                >
                  <span className={isHead ? "disp" : undefined} style={{ fontSize: isHead ? 30 : 24, fontWeight: isHead ? 800 : 500, color: isHead ? "#111111" : "#2E2E2E" }}>
                    {row.term}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: isHead ? 6 : 5 }}>
                    <span className="tab" style={{ fontSize: isHead ? 28 : 23, fontWeight: isHead ? 800 : 700, color: "#111111" }}>
                      {row.volume != null ? row.volume.toLocaleString() : "Not measured"}
                    </span>
                    {row.volume != null && (
                      <div style={{ width: "100%", height: isHead ? 7 : 5, background: isHead ? "#E7E1FB" : "#EFEFEF", borderRadius: isHead ? 4 : 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${barWidth}%`, background: isHead ? "#7C5CFA" : "rgba(17,17,17,0.4)", borderRadius: isHead ? 4 : 3 }} />
                      </div>
                    )}
                  </div>
                  <span className="tab" style={{ fontSize: isHead ? 24 : 23, fontWeight: isHead ? 700 : undefined, textAlign: "right", color: isHead ? "#111111" : "#6B6B6B" }}>
                    {row.cpc != null ? tabularNumber(formatCpc(row.cpc, country)) : "Not measured"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="obs" style={{ position: "relative" }}>
        <div className="obs-label" style={{ color: "#7C5CFA", fontWeight: 700 }}>
          Observation
        </div>
        {observation ?? OBSERVATION_STATIC_FALLBACKS.keyword_cluster}
      </div>
    </section>
  );
}

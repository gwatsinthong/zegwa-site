import type { SearchVisibilityResult } from "@/lib/search-visibility-core";
import { formatMoney, formatCpc } from "@/lib/currency";
import { tabularNumber } from "./deck-format";
import { OBSERVATION_STATIC_FALLBACKS } from "@/lib/observation-static-fallbacks";

// Pixel-perfect port of the prototype's Search Demand <section> (Audit
// Deck.dc.html, slide 5, data-om-slide-id 0e6b1ebe). sv is already gated to
// status === "ok" by the caller (page.tsx), same discipline as the
// production report's `sv` derivation — everything here is either a real
// DataForSEO figure or an honest "Not measured" fallback, never a
// fabricated 0.
//
// "Map pack · top 3" is filtered to type === "local_pack" specifically
// (rather than the production report's mixed-type top-3, which badges
// individual rows) — this slide's frozen prototype heading names the map
// pack explicitly, so every row under it must genuinely be one.

export type SearchDemandSlideProps = {
  bizName: string;
  sv: SearchVisibilityResult | null;
  country: string | null;
  observation?: string;
  pageIndex: number;
  pageTotal: number;
};

export default function SearchDemandSlide({ bizName, sv, country, observation, pageIndex, pageTotal }: SearchDemandSlideProps) {
  const seedTerm = sv?.keywords?.[0]?.term ?? sv?.seed ?? null;
  // <= 0 is treated as no signal, same convention lib/search-visibility.ts's
  // buildKeywordRows already uses for tail keyword terms. A genuine zero is
  // not a fabrication, but showing "0/mo" on the demand slide reads as a
  // confident measurement rather than the honest near-zero/no-signal result
  // it actually is.
  const volume = sv?.volume != null && sv.volume > 0 ? sv.volume : null;
  const cpc = sv?.cpc ?? null;
  const searchValue = sv?.monthlyClickValue ?? null;

  const positionLabel = !sv ? "—" : sv.leadAppears && sv.leadPosition != null ? `#${sv.leadPosition}` : "—";
  const positionCaption = !sv ? "Not yet measured" : sv.leadAppears && sv.leadPosition != null ? "of local searches for this trade" : "Not appearing in the map pack for this term";

  // Production bug (Redwoods Rural Satellite Dental Clinic): the prospect's
  // own listing showed up twice in the map pack, once correctly relabeled
  // "you" at its domain-matched position, once again as an unrelabeled
  // "competitor" row under its own raw title. matchLeadDomain only tags the
  // ONE row whose domain matches the lead's own website; a second listing
  // for the same business with no matching domain (a known Google Maps
  // duplicate-listing pattern, likely for a secondary/satellite location)
  // slips through untouched. Domain-only lead identification is a known,
  // parked limitation (matchLeadDomain, search-visibility-core.ts) and a
  // full fix would need place_id in the data model, which isn't present
  // today. This component defends at render time instead: drop any row
  // that name-matches the prospect (except the one true leadPosition row),
  // then dedup exact-title duplicates among what remains.
  const normalizeTitle = (s: string) => s.trim().toLowerCase();

  const topThree = sv
    ? (() => {
        const bizNameKey = normalizeTitle(bizName);
        const localPack = [...sv.topResults].filter((r) => r.type === "local_pack").sort((a, b) => a.position - b.position);

        // Keep the single row DataForSEO's domain match already identified
        // as the lead (relabeled "you" below); drop any OTHER row that is
        // the prospect's own name, never just relabel it. Must run before
        // the dedup step below, or a duplicate sitting at a lower position
        // than the real leadPosition row could survive dedup in its place
        // and silently un-label the lead from the pack.
        const withoutExtraLeadRows = localPack.filter((r) => r.position === sv.leadPosition || normalizeTitle(r.title) !== bizNameKey);

        // Exact-match dedup only (case-insensitive, trimmed) so two
        // genuinely different businesses are never collapsed. Rows are
        // already sorted by position, so keeping the first occurrence of
        // each title keeps the lowest-position instance.
        const seenTitles = new Set<string>();
        const deduped = withoutExtraLeadRows.filter((r) => {
          const key = normalizeTitle(r.title);
          if (seenTitles.has(key)) return false;
          seenTitles.add(key);
          return true;
        });

        // Honest-empty: never backfill to 3. Fewer real rows is correct.
        return deduped.slice(0, 3);
      })()
    : [];

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
        The demand
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 40px", position: "relative" }}>
        What {bizName} owns in local search.
      </h2>

      <div style={{ flex: 1, display: "flex", gap: 48, position: "relative" }}>
        <div
          style={{
            flex: "0 0 40%",
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            background: "linear-gradient(165deg, #1A1A1A 0%, #0C0C0C 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 40px -8px rgba(17,17,17,0.28), 0 8px 16px -4px rgba(17,17,17,0.22)",
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ position: "absolute", right: "-20%", top: "-15%", width: "80%", height: "60%", background: "radial-gradient(circle, rgba(124,92,250,0.22), transparent 70%)", pointerEvents: "none" }} />
          <div className="eyebrow" style={{ color: "#B7A4F9", marginBottom: 14, fontWeight: 700 }}>
            Search term
          </div>
          <div className="disp" style={{ fontSize: 52, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 36 }}>
            {seedTerm ?? "Not measured"}
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.12)", marginBottom: 36 }} />
          <div className="eyebrow" style={{ color: "#B7A4F9", marginBottom: 10, fontWeight: 700 }}>
            Map pack position
          </div>
          <div style={{ position: "relative", marginTop: "auto" }}>
            <div style={{ position: "absolute", left: "10%", top: "50%", transform: "translate(-50%,-50%)", width: 320, height: 200, background: "radial-gradient(circle, rgba(124,92,250,0.45), transparent 70%)", filter: "blur(6px)", pointerEvents: "none" }} />
            <div className="disp tab" style={{ position: "relative", fontSize: 148, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: "#FFFFFF" }}>
              {positionLabel}
            </div>
            <div style={{ position: "relative", fontSize: 24, color: "#ABABAB", marginTop: 8 }}>{positionCaption}</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr", gap: 20 }}>
            <div style={{ background: "#FAFAFA", borderRadius: 12, padding: "30px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="eyebrow" style={{ color: "#9C9C9C" }}>
                Volume
              </span>
              <span className="disp tab" style={{ fontSize: 38, fontWeight: 700, color: "#111111" }}>
                {volume != null ? tabularNumber(`${volume.toLocaleString()}/mo`) : "Not measured"}
              </span>
            </div>
            <div style={{ background: "#FAFAFA", borderRadius: 12, padding: "30px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="eyebrow" style={{ color: "#9C9C9C" }}>
                Avg click
              </span>
              <span className="disp tab" style={{ fontSize: 38, fontWeight: 700, color: "#111111" }}>
                {cpc != null ? tabularNumber(formatCpc(cpc, country)) : "Not measured"}
              </span>
            </div>
            <div style={{ background: "linear-gradient(120deg, #F7F6FB 0%, #F2F0FA 60%, #F6F3F6 100%)", borderRadius: 12, padding: "30px 28px", display: "flex", flexDirection: "column", gap: 12, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: "-15%", top: "-30%", width: "70%", height: "100%", background: "radial-gradient(circle, rgba(124,92,250,0.14), transparent 70%)", pointerEvents: "none" }} />
              <span className="eyebrow" style={{ color: "#9C9C9C" }}>
                Search value
              </span>
              <span className="disp tab" style={{ fontSize: 52, fontWeight: 700, color: "#7C5CFA" }}>
                {searchValue != null ? tabularNumber(`~${formatMoney(searchValue, country)}/mo`) : "Not measured"}
              </span>
            </div>
          </div>

          <div style={{ flex: 1, background: "#FAFAFA", borderRadius: 12, padding: "32px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="eyebrow" style={{ marginBottom: 22, color: "#7C5CFA", fontWeight: 700 }}>
              Map pack · top 3
            </div>
            {topThree.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {topThree.map((r, i) => {
                  const isYou = sv!.leadAppears && r.position === sv!.leadPosition;
                  const isFirst = i === 0;
                  return (
                    <div
                      key={r.position}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "56px 1fr",
                        gap: 24,
                        alignItems: "center",
                        padding: "18px 16px",
                        borderRadius: isFirst ? 10 : undefined,
                        background: isFirst ? "#EFEAFB" : undefined,
                        borderBottom: !isFirst && i < topThree.length - 1 ? "1px solid rgba(17,17,17,0.08)" : undefined,
                      }}
                    >
                      <span
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: isFirst ? "#7C5CFA" : "#EFEFEF",
                          color: isFirst ? "#FFFFFF" : "#9C9C9C",
                          fontFamily: "'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                          fontWeight: 700,
                          fontSize: 22,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 28, fontWeight: isFirst ? 700 : 600, color: isFirst ? "#111111" : "#6B6B6B" }}>{isYou ? bizName : r.title}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: 24, color: "#9C9C9C", fontWeight: 500 }}>No map-pack data captured for this term yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="obs" style={{ position: "relative" }}>
        <div className="obs-label" style={{ color: "#7C5CFA", fontWeight: 700 }}>
          Observation
        </div>
        {observation ?? OBSERVATION_STATIC_FALLBACKS.search_demand}
      </div>
    </section>
  );
}

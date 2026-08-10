// Pixel-perfect port of the prototype's Contents <section> (Audit Deck.dc.html,
// slide 3, data-om-slide-id 4142b34c). Purely static index copy — the only
// wired value is the prospect's business name in the subhead. Page ranges
// below are copied verbatim from the prototype and already match the
// reconciled 19-slide order (01->02, 02->04, 03->05-06, 04->07, 05->08,
// 06->09-10, 07->11, 08->11-14, 09->15-19).

const ROWS: { num: string; title: string; note: string; pages: string }[] = [
  { num: "01", title: "The verdict", note: "where the lead stands today", pages: "02" },
  { num: "02", title: "The competition", note: "the field nearby", pages: "04" },
  { num: "03", title: "The demand", note: "what's searched, and its value", pages: "05-06" },
  { num: "04", title: "Local search", note: "map-pack rank across the area", pages: "07" },
  { num: "05", title: "Reputation", note: "the lead's strongest signal", pages: "08" },
  { num: "06", title: "The website", note: "what a customer first sees", pages: "09-10" },
  { num: "07", title: "The leak", note: "what the gaps cost", pages: "11" },
  { num: "08", title: "The findings", note: "the site issues, ranked", pages: "11-14" },
  { num: "09", title: "The fix and offer", note: "what to do, and how we help", pages: "15-19" },
];

export type ContentsSlideProps = {
  bizName: string;
  pageIndex: number;
  pageTotal: number;
};

export default function ContentsSlide({ bizName, pageIndex, pageTotal }: ContentsSlideProps) {
  return (
    <section
      className="slide"
      style={{ padding: "80px 96px", display: "flex", position: "relative", flexDirection: "column", width: "100%", height: "100%", boxSizing: "border-box" }}
    >
      <div style={{ position: "absolute", right: 40, bottom: 40, fontSize: 24, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", color: "#D2D2D2" }}>
        {String(pageIndex).padStart(2, "0")}
        <span style={{ color: "#E8E8E8" }}> / {pageTotal}</span>
      </div>
      <div className="eyebrow" style={{ marginBottom: 20 }}>
        Contents
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 12px" }}>
        What this audit covers.
      </h2>
      <p style={{ fontSize: 24, color: "#6B6B6B", margin: "0 0 32px" }}>Prepared for {bizName}.</p>

      <div
        style={{
          flex: 1,
          position: "relative",
          borderRadius: 28,
          overflow: "hidden",
          background: "linear-gradient(120deg, #F7F6FB 0%, #F2F0FA 40%, #F6F3F6 75%, #F5F3F0 100%)",
          boxShadow: "0 1px 2px rgba(17,17,17,0.05), 0 24px 48px -12px rgba(17,17,17,0.14)",
        }}
      >
        <div style={{ position: "absolute", right: "-6%", top: "-20%", width: "60%", height: "140%", background: "radial-gradient(circle, rgba(124,92,250,0.12), transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "-10%", bottom: "-25%", width: "50%", height: "90%", background: "radial-gradient(circle, rgba(124,92,250,0.06), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", padding: "8px 56px" }}>
          {ROWS.map((row) => (
            <div
              key={row.num}
              style={{ display: "grid", gridTemplateColumns: "88px 3px 1fr 130px", alignItems: "center", gap: 24, flex: 1, borderTop: "1px solid rgba(17,17,17,0.08)" }}
            >
              <span className="disp tab" style={{ fontSize: 46, fontWeight: 700, color: "#C7BEF5", letterSpacing: "-0.02em" }}>
                {row.num}
              </span>
              <span style={{ width: 3, height: 32, background: "rgba(17,17,17,0.12)", borderRadius: 2 }} />
              <div>
                <span style={{ fontSize: 29, fontWeight: 700, color: "#111111" }}>{row.title}</span>
                <span style={{ fontSize: 24, color: "#ABABAB" }}> {row.note}</span>
              </div>
              <span className="tab" style={{ fontSize: 24, color: "#ABABAB", textAlign: "right" }}>
                {row.pages}
              </span>
            </div>
          ))}
          <div style={{ height: 1, background: "rgba(17,17,17,0.08)" }} />
        </div>
      </div>
    </section>
  );
}

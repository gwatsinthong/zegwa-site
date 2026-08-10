import { resolveNicheDemo, FALLBACK_DEMOS, type NicheDemo } from "@/lib/niche-demos";

// Pixel-perfect port of the prototype's Deliverables <section> (Audit
// Deck.dc.html, slide 16, no data-om-slide-id — the bridge slide). The
// gap-to-fix mapping list is confirmed fully STATIC marketing content: a
// fixed, standard 6-row list of the agency's general problem categories
// (not filtered to this lead's actual fired gaps — it bridges into the
// general Found offering, the same list for every audit by design), and
// none of its copy references the business by name.
//
// The demo-site card, however, IS per-lead: it shows the real demo site
// matching this prospect's own trade (resolveNicheDemo, reusing the SAME
// vertical taxonomy the rest of the audit already relies on), linked to the
// real live demo — never a fabricated or mismatched niche. When the
// prospect's own vertical has no demo (chiropractic, generic, or any other
// gap — see lib/niche-demos.ts), this honestly falls back to a small set of
// REAL samples framed as "the kind of work we do" in general, with no
// niche-specific link and no claim that any one of them is this
// prospect's own trade.
//
// Screenshots are real, captured full-page shots (see lib/niche-demos.ts's
// doc comment for provenance) — served from /public, byte-identical copies
// of zegwa-site's own public/work/{slug}.webp.

// House crop window (matches zegwa-site's own WorkGrid.tsx WINDOW_RATIO):
// these screenshots are tall full-page captures, so every card crops to a
// fixed aspect window (showing the top of the page, "as a customer first
// sees it" — same framing discipline as the Your Site slide's own
// screenshot) rather than rendering the full, very-tall image uncropped.
const WINDOW_RATIO = 2 / 3; // window height / width

// Rendered noticeably larger than the old fixed 480px card — the matched
// (single, per-lead) state gets real visual weight; the unmatched fallback
// state renders 3 smaller samples side by side in roughly the same total
// footprint.
const MATCHED_CARD_WIDTH = 640;
const FALLBACK_CARD_WIDTH = 200;

function DemoCard({ demo, width, clickable }: { demo: NicheDemo; width: number; clickable: boolean }) {
  const windowHeight = Math.round(width * WINDOW_RATIO);
  const card = (
    <div style={{ width, borderRadius: 16, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(17,17,17,0.06), 0 24px 48px -14px rgba(17,17,17,0.22)", overflow: "hidden", border: "1px solid rgba(17,17,17,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid rgba(17,17,17,0.06)" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E3E3E3" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E3E3E3" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E3E3E3" }} />
        <span style={{ marginLeft: 10, fontSize: 13, color: "#ABABAB", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {new URL(demo.url).hostname}
        </span>
      </div>
      <div style={{ position: "relative", width: "100%", height: windowHeight, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/report-assets/v2/demos/${demo.slug}.webp`}
          alt={`${demo.label} demo site screenshot`}
          style={{ display: "block", width: "100%", height: "auto", position: "absolute", top: 0, left: 0 }}
        />
      </div>
    </div>
  );
  if (!clickable) return card;
  return (
    <a href={demo.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
      {card}
    </a>
  );
}

const ITEMS: { color: string; bg: string; icon: JSX.Element; problem: string; fix: string }[] = [
  {
    color: "#A8362B",
    bg: "#FBEAE8",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <line x1="5.5" y1="18.5" x2="18.5" y2="5.5" strokeLinecap="round" />
      </>
    ),
    problem: "No booking or form",
    fix: "Conversion site with click-to-call, booking, and lead forms",
  },
  {
    color: "#A8362B",
    bg: "#FBEAE8",
    icon: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="1.5" />
        <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
      </>
    ),
    problem: "No HTTPS",
    fix: "Secure site, SSL, trust restored",
  },
  {
    color: "#C1691E",
    bg: "#FBEEDA",
    icon: (
      <>
        <circle cx="12" cy="13" r="7.5" />
        <path d="M12 13l3-3" strokeLinecap="round" />
        <path d="M9 4h6" strokeLinecap="round" />
      </>
    ),
    problem: "Slow mobile load",
    fix: "Rebuilt fast and mobile-first",
  },
  {
    color: "#7C5CFA",
    bg: "#EFEAFB",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
      </>
    ),
    problem: "Found on Google, not converting",
    fix: "Local SEO, GBP, and AI-search setup that turns visits into calls",
  },
  {
    color: "#7C5CFA",
    bg: "#EFEAFB",
    icon: <path d="M8 10a3 3 0 013-3h5l-2-2M16 14a3 3 0 01-3 3H8l2 2" strokeLinecap="round" strokeLinejoin="round" />,
    problem: "Reviews sitting idle",
    fix: "Review monitoring with drafted responses",
  },
  {
    color: "#2E9E5B",
    bg: "#E3F4E9",
    icon: (
      <>
        <path d="M4 12a8 8 0 0114-5.3M4 12a8 8 0 0014 5.3" strokeLinecap="round" />
        <path d="M18 4v4h-4M6 20v-4h4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    problem: "Old leads going cold",
    fix: "A one-time dormant-lead reactivation sweep",
  },
];

export type DeliverablesSlideProps = {
  /** The prospect's real Places category — resolveNicheDemo reuses the
   *  SAME vertical taxonomy the rest of the audit already relies on
   *  (resolveVertical), never a second, divergent classifier. */
  category: string | null | undefined;
  bizName?: string | null;
  pageIndex: number;
  pageTotal: number;
};

export default function DeliverablesSlide({ category, bizName, pageIndex, pageTotal }: DeliverablesSlideProps) {
  const matchedDemo = resolveNicheDemo(category, bizName);
  const hasFallback = FALLBACK_DEMOS.length > 0;

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
        What we do
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 40px", position: "relative" }}>
        The problems we fix.
      </h2>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 72, minHeight: 0, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
          {ITEMS.map((item, i) => (
            <div
              key={item.problem}
              style={{ display: "grid", gridTemplateColumns: "56px 1fr 32px 1fr", alignItems: "center", gap: 18, padding: "16px 0", borderBottom: i < ITEMS.length - 1 ? "1px solid rgba(17,17,17,0.08)" : undefined }}
            >
              <span style={{ width: 44, height: 44, borderRadius: "50%", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth={2}>
                  {item.icon}
                </svg>
              </span>
              <span style={{ fontSize: 26, fontWeight: 600, color: "#6B6B6B" }}>{item.problem}</span>
              <span style={{ fontSize: 26, color: "#7C5CFA", textAlign: "center" }}>&rarr;</span>
              <span style={{ fontSize: 26, fontWeight: 600, color: "#111111" }}>{item.fix}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, minHeight: 0 }}>
          {matchedDemo ? (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#7C5CFA", textAlign: "center" }}>
                A recent {matchedDemo.label} build. Yours will be your own.
              </div>
              <DemoCard demo={matchedDemo} width={MATCHED_CARD_WIDTH} clickable />
            </>
          ) : hasFallback ? (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#7C5CFA", textAlign: "center" }}>
                The kind of work we do.
              </div>
              <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                {FALLBACK_DEMOS.map((demo) => (
                  <DemoCard key={demo.slug} demo={demo} width={FALLBACK_CARD_WIDTH} clickable={false} />
                ))}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 22, color: "#9C9C9C", fontWeight: 500, textAlign: "center" }}>Sample work isn&apos;t available for this report.</div>
          )}
        </div>
      </div>

      {/* STATIC PLACEHOLDER, same treatment as the earlier slides' Observation
          boxes — this is generic sales copy per the prototype, not a
          per-lead claim. */}
      <div className="obs" style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24, position: "relative" }}>
        <span style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#7C5CFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={1.8}>
            <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 16.9 5.8 20.4l1.6-6.8L2.2 9l6.9-.7z" />
          </svg>
        </span>
        <div style={{ fontSize: 26, color: "#4A4A4A" }}>None of this is exotic. It&apos;s the work, done properly, and shown to you every month.</div>
      </div>
    </section>
  );
}

import { formatMoney } from "@/lib/currency";
import { tabularNumber } from "./deck-format";

// Pixel-perfect port of the prototype's "The Offer" <section> (Audit
// Deck.dc.html, slide 18, data-om-slide-id d13dd91a) — the first of the
// two dark (near-black ground) slides. The loss line items and pricing are
// static per the locked offer; the ONE real data point on this slide is the
// annual loss / net figures, computed from the SAME monthly leak
// (estimateRevenueLeak) the Cover and Leak slides already show — never a
// hardcoded number.

const BUILD_COST = 1500;
const MONTHLY_COST = 500;
const MONTHLY_MONTHS = 12;
const ANNUAL_INVESTMENT = MONTHLY_COST * MONTHLY_MONTHS;

const LOSS_ITEMS: { icon: JSX.Element; text: string }[] = [
  {
    icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />,
    text: "Missed calls when there's no way to book",
  },
  {
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="1.5" />
        <line x1="8" y1="8" x2="16" y2="8" strokeLinecap="round" />
        <line x1="8" y1="12" x2="13" y2="12" strokeLinecap="round" />
      </>
    ),
    text: "Interest lost without a booking path or contact form",
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    text: "Leads that go cold without follow-up",
  },
  {
    icon: <path d="M3 17l5-5 4 3 7-8" strokeLinecap="round" strokeLinejoin="round" />,
    text: "Visitors bouncing off a slow or insecure site",
  },
];

export type OfferSlideProps = {
  bizName: string;
  monthlyLeak: number | null;
  country: string | null;
  pageIndex: number;
  pageTotal: number;
};

export default function OfferSlide({ bizName, monthlyLeak, country, pageIndex, pageTotal }: OfferSlideProps) {
  const annualLoss = monthlyLeak != null && monthlyLeak > 0 ? monthlyLeak * 12 : null;
  const net = annualLoss != null ? annualLoss - ANNUAL_INVESTMENT : null;

  return (
    <section
      className="slide"
      style={{ padding: "80px 96px", display: "flex", position: "relative", flexDirection: "column", width: "100%", height: "100%", boxSizing: "border-box", background: "#0B0B0C" }}
    >
      <div style={{ position: "absolute", right: "-10%", top: "-20%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(124,92,250,0.16), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 40, bottom: 40, fontSize: 24, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", color: "#B7A4F9" }}>
        {String(pageIndex).padStart(2, "0")}
        <span style={{ color: "#5A5A66" }}> / {pageTotal}</span>
      </div>
      <div className="eyebrow" style={{ marginBottom: 16, color: "#B7A4F9" }}>
        The offer · Found
      </div>
      <h2 className="disp" style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 8px", color: "#FFFFFF" }}>
        The math, plainly.
      </h2>

      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly", minHeight: 0, maxWidth: 1080, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 340px", gap: 40, alignItems: "stretch" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#E8877E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>What these gaps cost</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {LOSS_ITEMS.map((item, i) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", borderBottom: i < LOSS_ITEMS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : undefined }}>
                  <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "rgba(193,72,59,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8877E" strokeWidth={2}>
                      {item.icon}
                    </svg>
                  </span>
                  <span style={{ fontSize: 26, color: "#E5E5E5" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.18)" }} />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#E8877E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Annual loss</div>
            {annualLoss != null ? (
              <>
                <div className="disp tab" style={{ fontSize: 64, fontWeight: 800, color: "#C1483B", lineHeight: 1, whiteSpace: "nowrap" }}>
                  {tabularNumber(formatMoney(annualLoss, country))}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#E8877E", marginTop: 6 }}> / year</div>
              </>
            ) : (
              <div className="disp" style={{ fontSize: 34, fontWeight: 700, color: "#8A8A8A" }}>Not yet estimated</div>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.12)", width: "100%" }} />

        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#B7A4F9", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>What Found costs</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between", fontSize: 26, color: "#E5E5E5", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "rgba(124,92,250,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B7A4F9" strokeWidth={2}>
                    <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4l-2.1 2.1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                One-time build
              </span>
              <span className="tab">{tabularNumber(formatMoney(BUILD_COST, country))}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between", fontSize: 26, color: "#E5E5E5", padding: "10px 0" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "rgba(124,92,250,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B7A4F9" strokeWidth={2}>
                    <rect x="4" y="5" width="16" height="15" rx="1.5" />
                    <line x1="4" y1="9" x2="20" y2="9" />
                    <line x1="8" y1="3" x2="8" y2="7" strokeLinecap="round" />
                    <line x1="16" y1="3" x2="16" y2="7" strokeLinecap="round" />
                  </svg>
                </span>
                Monthly, {MONTHLY_MONTHS} months
              </span>
              <span className="tab">
                {tabularNumber(formatMoney(MONTHLY_COST, country))} &times; {MONTHLY_MONTHS}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, marginTop: 18 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#B7A4F9", textTransform: "uppercase", letterSpacing: "0.08em" }}>Annual investment</span>
            <span className="disp tab" style={{ fontSize: 40, fontWeight: 800, color: "#FFFFFF", whiteSpace: "nowrap" }}>
              {tabularNumber(formatMoney(ANNUAL_INVESTMENT, country))} / year
            </span>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.12)", width: "100%" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {net != null ? (
            net > 0 ? (
              <span className="disp" style={{ fontSize: 52, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                {bizName} keeps <span className="tab" style={{ color: "#B7A4F9" }}>{tabularNumber(formatMoney(net, country))}</span>.
              </span>
            ) : (
              <span className="disp" style={{ fontSize: 34, fontWeight: 700, color: "#ABABAB", textAlign: "center" }}>
                The estimated loss doesn&apos;t clear the investment on its own this year.
              </span>
            )
          ) : (
            <span className="disp" style={{ fontSize: 34, fontWeight: 700, color: "#8A8A8A", textAlign: "center" }}>
              Net savings available once the loss is estimated.
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 32px", border: "1.5px solid #7C5CFA", borderRadius: 999, background: "rgba(124,92,250,0.1)" }}>
            <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: "#7C5CFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2.2}>
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
                <path d="M9.5 12l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", whiteSpace: "nowrap" }}>You own everything, day one. No contract, cancel anytime.</span>
          </div>
          <div style={{ fontSize: 18, color: "#7A7A7A", textAlign: "center", maxWidth: "62ch", lineHeight: 1.5 }}>
            We&apos;re not fluff. Every month you get the real work in writing, the searches, the reviews, and a dated log of what we did.
          </div>
        </div>
      </div>
    </section>
  );
}

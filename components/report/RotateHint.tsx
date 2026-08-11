"use client";

// Full-screen "rotate to landscape" overlay for the fixed-canvas audit
// deck (deck-shell.tsx's DeckScroll), scaled to fit and readable in
// landscape or on desktop/tablet, but too small to read on a small
// portrait phone. Pure CSS media query, not a JS orientation listener: no
// resize-listener churn, no flash of the wrong state on first paint, since
// the browser applies the query before anything renders. Hidden by default
// (display: none); the scoped media query below is the only thing that
// ever shows it, so it can never interfere with the deck's own scroll
// (#deck-scroll) when hidden. Mounted once in app/(report)/layout.tsx, so
// it only ever affects routes inside the (report) route group, never the
// rest of the site.
const ROTATE_HINT_CSS = `
  .rotate-hint {
    display: none;
  }
  @media (max-width: 640px) and (orientation: portrait) {
    .rotate-hint {
      display: flex;
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #0b0b0c;
      color: #ffffff;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      padding: 32px;
      text-align: center;
    }
  }
`;

export default function RotateHint() {
  return (
    <>
      {/* dangerouslySetInnerHTML, not a JSX text child: <style> is an HTML
          "raw text" element browsers never entity-decode, while React
          HTML-escapes plain text children (see deck-shell.tsx's identical
          note), harmless for this specific CSS today, but matching the
          established pattern rather than relying on this string staying
          entity-free forever. */}
      <style dangerouslySetInnerHTML={{ __html: ROTATE_HINT_CSS }} />
      <div className="rotate-hint" role="status" aria-live="polite">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={1.6}>
          <rect x="3" y="2" width="11" height="20" rx="2" />
          <path d="M17 5a8 8 0 010 14" strokeLinecap="round" />
          <path d="M17 19l-3.2 -1M17 19l1 -3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Rotate your phone to view the audit.</div>
        <div style={{ fontSize: 14, color: "#a0a0a0" }}>This report is best viewed in landscape.</div>
      </div>
    </>
  );
}

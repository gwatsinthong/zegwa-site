import RotateHint from "@/components/report/RotateHint";

// A SEPARATE root layout (Next.js "multiple root layouts" pattern), not a
// nested layout under app/(site)/layout.tsx. It has to be a full root
// layout defining its own <html>/<body>: the site's root layout renders
// <Header /> and <Footer /> as SIBLINGS of {children}, not wrapping it, so
// no nested layout under it could ever remove them. This group opts
// /sample-audit (and only routes placed in this group) out of the site's
// chrome entirely: no Header, no Footer, no SmoothScroll, no CookieConsent,
// no max-width wrapper, no globals.css. The deck owns the full viewport and
// its own scroll (deck-shell.tsx's fixed-canvas + ResizeObserver), so this
// layout stays minimal on purpose rather than pulling in the site's shared
// chrome/fonts, which the deck doesn't use anyway (it self-hosts its own
// "Helvetica Now Display" @font-face in deck-shell.tsx's SHARED_CSS).
//
// RotateHint is mounted here (not on the individual page) so every route
// inside this group gets the small-portrait overlay automatically, never
// the rest of the site. It's a fixed-position overlay hidden by default
// (see its own CSS), so mounting it as a sibling of {children} can't
// disturb the deck's own scroll container when the overlay isn't shown.
export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
        <RotateHint />
      </body>
    </html>
  );
}

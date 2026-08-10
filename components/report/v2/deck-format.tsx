import type { ReactNode } from "react";

// Deliberately NOT "use client" — cover-slide.tsx (a Server Component) calls
// this directly during server rendering. A plain utility exported from a
// "use client" file (deck-shell.tsx) becomes a client-reference stub in the
// production RSC bundle, not the real callable — calling it server-side
// throws at runtime (only when actually invoked, so a clean lead with no
// leak figure never hit it while a real leak figure always did). Kept in its
// own plain module so both a Server Component (cover-slide.tsx) and the
// client stage (deck-shell.tsx) can import the real function safely.

/** Splits a formatted money/number string ("$3,800") into tabular-nums-safe
 *  spans, wrapping each comma/period separator in .sep — mirrors the
 *  prototype's `$3<span class="sep">,</span>800` pattern so grouping
 *  punctuation doesn't also get forced to tabular (monospaced) width. */
export function tabularNumber(formatted: string): ReactNode[] {
  return formatted.split(/([,.])/).map((part, i) =>
    part === "," || part === "." ? (
      <span className="sep" key={i}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

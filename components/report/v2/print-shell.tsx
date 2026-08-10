"use client";

import { Children, useEffect, useRef, useState } from "react";
import { SHARED_CSS, DESIGN_W, DESIGN_H } from "./deck-shell";

// Print-only counterpart to deck-shell.tsx's DeckScroll/DeckSharedStyles.
// Same 19 slide components, same SHARED_CSS (fonts, typography, page
// background). Structurally mirrors the deck's own fixed-canvas +
// transform:scale pattern (.deck-canvas inside .deck-snap-slide) — but the
// INPUT driving the scale is different, and that difference is the whole
// fix (see below).
//
// Root-caused via ?measure=1 (temporary instrumentation, since removed, on
// what was then api/report/[token]/pdf-spike, now .../pdf) + a failed
// break-inside:avoid attempt: several slides render real
// content taller than 1080px against real prospect data (height:100% with
// no overflow:hidden of their own — see report-slides.tsx's 19 slide
// components). The interactive deck never visibly bleeds because
// .deck-snap-slide's overflow:hidden clips it — 100% reliable for on-screen
// rendering. Chromium's PRINT/pagination fragmentation engine does NOT
// honor overflow:hidden as a hard per-page clip the same way (confirmed:
// adding break-inside:avoid to .print-page did not stop the bleed) — so
// print needed an actual fix, not just a clip.
//
// The deck's useStageScale computes scale from VIEWPORT size
// (min(vw/1920, vh/1080)) — it has no idea whether a slide's content
// exceeds 1080px, and does NOT itself prevent overflow; overflow:hidden
// does that, invisibly, on screen. That same "shrink a fixed-size canvas"
// PATTERN still applies here, just driven by a different, print-specific
// input: the tallest of the 19 slides' REAL measured content heights, not
// window size. Print's "viewport" (the @page/.print-page box) is fixed at
// 1920x1080, so once the worst-case content height is known, the scale
// that guarantees every slide fits is deterministic — computed once, on
// mount, and applied UNIFORMLY to all 19 canvases (never a different
// per-slide scale, so every printed page stays visually consistent).
// Capped at 1.0 so a short slide is never scaled UP past its natural size.
const PRINT_ONLY_CSS = `
      @page { size: ${DESIGN_W}px ${DESIGN_H}px; margin: 0; }
      .print-page { width: ${DESIGN_W}px; height: ${DESIGN_H}px; overflow: hidden; break-after: page; break-inside: avoid; display: flex; align-items: center; justify-content: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .print-page:last-child { break-after: auto; }
      .print-canvas { position: relative; width: ${DESIGN_W}px; flex-shrink: 0; background: #fff; }
      html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
`;

export function PrintSharedStyles() {
  return <style dangerouslySetInnerHTML={{ __html: SHARED_CSS + PRINT_ONLY_CSS }} />;
}

export function PrintShell({ children }: { children: React.ReactNode }) {
  // null = not yet measured; api/report/[token]/pdf's route waits for
  // #print-stack[data-print-ready="1"] before calling page.pdf(), so a
  // capture never runs against this unscaled, pre-measurement state.
  const [fit, setFit] = useState<{ scale: number; canvasHeight: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Measure every slide's REAL, unclipped content height (scrollHeight —
    // reports true content extent regardless of the slide root's own
    // height:100% CSS, the same mechanism ?measure=1 already relied on).
    // Runs once the canvases have painted at their natural (unscaled)
    // height, before any transform is applied, so nothing is measured
    // through its own clip yet.
    const slides = containerRef.current?.querySelectorAll<HTMLElement>(".slide");
    if (!slides || slides.length === 0) return;
    const heights = Array.from(slides).map((el) => el.scrollHeight);
    const canvasHeight = Math.max(DESIGN_H, ...heights);
    setFit({ scale: Math.min(1, DESIGN_H / canvasHeight), canvasHeight });
  }, []);

  return (
    <div id="print-stack" ref={containerRef} data-print-ready={fit ? "1" : undefined}>
      {Children.map(children, (child, index) => (
        <div className="print-page" key={index}>
          <div
            className="print-canvas"
            style={{
              height: fit?.canvasHeight ?? DESIGN_H,
              transform: fit ? `scale(${fit.scale})` : undefined,
            }}
          >
            {child}
          </div>
        </div>
      ))}
    </div>
  );
}

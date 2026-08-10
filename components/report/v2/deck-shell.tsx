"use client";

import { Children, useEffect, useState } from "react";

// New slide-deck report shell (design-handoff rebuild, Step 1: shell + Cover
// only). Renders discrete, full-viewport, scroll-snapped slides — a DELIBERATE
// deviation from the Claude Design prototype's own deck-stage.js, which
// absolute-stacks every slide and toggles one active via an index (keyboard/
// tap-driven), never scroll. deck-stage.js/support.js/image-slot.js are
// editor-authoring chrome (thumbnail rail, drag-reorder, host postMessage
// bridge, print pagination) and are NOT ported here — only two things carry
// over: the shared CSS from the prototype's <helmet> (ported 1:1 below) and
// the scale-to-fit concept from deck-stage.js's _fit() (min(vw/1920, vh/1080)),
// reimplemented as a tiny ResizeObserver-driven scale instead of an index nav.
//
// DESIGN_W/DESIGN_H match the prototype's authored canvas exactly — every
// slide is built at this fixed size and letterboxed to fit the viewport, so
// pixel values from the prototype translate directly with no re-derivation.
export const DESIGN_W = 1920;
export const DESIGN_H = 1080;

/** Ported 1:1 from the prototype's <helmet> <style> block. Everything a
 *  slide component's own className references, needed by BOTH the
 *  interactive deck (DeckScroll) and the print route (PrintShell) — fonts,
 *  typography, and the shared page background. No scroll/snap/scale rule
 *  belongs here; those are DECK_ONLY_CSS below, meaningful only inside
 *  DeckScroll.
 *
 *  dangerouslySetInnerHTML, NOT a JSX text child (`<style>{css}</style>`):
 *  React HTML-escapes text children (' -> &#x27;, etc.), and <style> is an
 *  HTML "raw text" element whose content browsers never entity-decode — a
 *  text-child style block would have every single-quoted string in this
 *  CSS (font-family names, @font-face url()s, font-feature-settings
 *  values) sit in the DOM as literal, unparsed `&#x27;...&#x27;`, silently
 *  dropping every rule that used one. Confirmed via a real headless-
 *  Chromium render: with a text child, document.fonts stayed "unloaded"
 *  and requests for the woff2 files were never even issued. */
export const SHARED_CSS = `
      @font-face {
        font-family: 'Helvetica Now Display';
        src: url('/fonts/HelveticaNowDisplay-Regular.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Helvetica Now Display';
        src: url('/fonts/HelveticaNowDisplay-Medium.woff2') format('woff2');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Helvetica Now Display';
        src: url('/fonts/HelveticaNowDisplay-Bold.woff2') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
      .tab { font-variant-numeric: tabular-nums; font-feature-settings: 'tnum' 1; }
      .tab .sep { font-variant-numeric: normal; font-feature-settings: 'tnum' 0; }
      /* Helvetica Now Text (the body cut) has not been supplied — only
         Display's Regular/Medium/Bold woff2 files were provided in the
         handoff. Both the body (.slide) and heading (.disp) stacks resolve
         to the SAME loaded Display family for now, so nothing on the deck
         silently falls back to a system font. Swap .slide back to a real
         'Helvetica Now Text' @font-face the moment those files arrive. */
      .slide { font-family: 'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #FFFFFF; color: #111111; }
      .disp { font-family: 'Helvetica Now Display', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
      .eyebrow { font-size: 24px; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase; color: #9C9C9C; }
      .obs { margin-top: auto; padding-top: 28px; border-top: 1px solid #EDEDED; font-size: 24px; color: #2E2E2E; line-height: 1.5; max-width: 70ch; }
      .obs-label { font-size: 24px; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase; color: #9C9C9C; margin-bottom: 8px; }
      .chip { font-size: 24px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; padding: 4px 12px; border-radius: 5px; }
      .chip-strong { color: #1F7A47; background: #E3F4E9; }
      .chip-weak { color: #FFFFFF; background: #A8362B; }
      .chip-mid { color: #C1691E; background: #FBEBDA; }
      html, body { margin: 0; background: #0B0B0C; }
`;

export function SharedStyles() {
  return <style dangerouslySetInnerHTML={{ __html: SHARED_CSS }} />;
}

/** Meaningful ONLY inside DeckScroll — the scroll-snap container, the
 *  per-slide snap block, and the scale-to-fit canvas. The print route never
 *  renders these; PrintShell lays slides out at natural size instead. */
const DECK_ONLY_CSS = `
      #deck-scroll { height: 100vh; overflow-y: scroll; scroll-snap-type: y mandatory; }
      .deck-snap-slide { height: 100vh; scroll-snap-align: start; scroll-snap-stop: always; display: flex; align-items: center; justify-content: center; overflow: hidden; }
      .deck-canvas { position: relative; flex-shrink: 0; background: #fff; box-shadow: 0 0 0 1.5px rgba(255,255,255,0.12); }
`;

// The interactive route's style output — SHARED_CSS + DECK_ONLY_CSS
// concatenated contains the exact same CSS rules, in the same order, that
// the old single DECK_SHARED_CSS constant emitted (an extra blank line lands
// at the join point from the two template literals' own leading/trailing
// newlines — inert for a <style> tag, CSS rule parsing ignores it). Just now
// assembled from two constants so PrintShell can reuse SHARED_CSS without
// the deck-only rules.
export function DeckSharedStyles() {
  return <style dangerouslySetInnerHTML={{ __html: SHARED_CSS + DECK_ONLY_CSS }} />;
}

/** Scale-to-fit, mirroring deck-stage.js's _fit(): scale = min(vw/1920, vh/1080).
 *  A tiny client component (ResizeObserver-driven) rather than a port of the
 *  editor's ~3000-line stage — this is the one piece of that file's behavior
 *  worth keeping. */
function useStageScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const compute = () => {
      const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
      setScale(s > 0 ? s : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return scale;
}

export function DeckScroll({ children }: { children: React.ReactNode }) {
  const scale = useStageScale();
  return (
    <div id="deck-scroll" style={{ background: "#0B0B0C" }}>
      {Children.map(children, (child, index) => (
        <DeckSnapSlide key={index} index={index} scale={scale}>
          {child}
        </DeckSnapSlide>
      ))}
    </div>
  );
}

// 1-based, matching every slide component's own pageIndex prop convention.
// Gives PDF capture (and anything else) a stable selector per slide,
// independent of slide order, instead of positional-only .deck-canvas.
function DeckSnapSlide({ index, scale, children }: { index: number; scale: number; children: React.ReactNode }) {
  return (
    <div className="deck-snap-slide">
      <div
        className="deck-canvas"
        data-slide-index={index + 1}
        style={{ width: DESIGN_W, height: DESIGN_H, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

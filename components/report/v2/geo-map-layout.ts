// Plain (NOT "use client") layout constants for the Geo Map slide's 9 pins —
// deliberately separate from geo-map-slide.tsx's JSX so the pixel positions
// and the data-to-screen index mapping are unit-testable without rendering.
//
// buildGridPoints (search-visibility-grid-core.ts) fills GridPoint[] in
// ROW-MAJOR order with LATITUDE as the outer loop, offsets [-step, 0, +step]
// in that literal order — so points[0..2] are the SOUTHERNMOST row (lower
// latitude = further south), points[3..5] are the center-latitude row, and
// points[6..8] are the NORTHERNMOST row. Screen coordinates put north at the
// TOP (smaller y), so the prototype's 9 fixed pin positions — authored
// top-to-bottom as NW,N,NE / W,CENTER,E / SW,S,SE — need the NORTH data row
// (indices 6-8) at the top of the screen and the SOUTH data row (indices
// 0-2) at the bottom. SCREEN_TO_DATA_INDEX encodes that flip once, here,
// instead of leaving it as an easy-to-invert inline computation.
export const SCREEN_TO_DATA_INDEX = [6, 7, 8, 3, 4, 5, 0, 1, 2] as const;

export const CENTER_SCREEN_SLOT = 4;

export type PinPosition = { left: number; top: number; size: number };

/** The prototype's 9 fixed pin positions (Audit Deck.dc.html, Geo Map slide),
 *  in the same top-to-bottom, left-to-right screen order SCREEN_TO_DATA_INDEX
 *  assumes. The center slot (index 4) is larger — the prototype's own
 *  highlighted-with-glow marker for the business's own location. */
export const PIN_POSITIONS: PinPosition[] = [
  { left: 110, top: 95, size: 44 },
  { left: 260, top: 70, size: 44 },
  { left: 410, top: 110, size: 44 },
  { left: 80, top: 235, size: 44 },
  { left: 262, top: 250, size: 52 },
  { left: 445, top: 245, size: 44 },
  { left: 130, top: 400, size: 44 },
  { left: 300, top: 425, size: 44 },
  { left: 420, top: 385, size: 44 },
];

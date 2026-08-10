// Pure logic for the map-pack RANK GRID: how the lead's local-pack rank for
// its own search-visibility seed varies across a 3x3 grid of points around
// its own lat/lng. Reuses the EXACT SAME seed as the single-point
// search-visibility lookup (threaded in as a plain string — see
// search-visibility-grid.ts) — this file never builds a seed and never
// imports resolveVertical. No I/O here; the server-only wiring layer
// (search-visibility-grid.ts) fetches/caches the raw per-point DataForSEO
// responses and hands them to buildSearchVisibilityGrid below, same
// core/wiring split as search-visibility-core.ts + search-visibility.ts.

import type { SerpResult } from "./search-visibility-core";
import { normalizeDomain } from "./search-visibility-core";

export const SEARCH_VISIBILITY_GRID_CACHE_VERSION = 1;

export type GridPoint = { lat: number; lng: number };

export type GridPointResult = {
  lat: number;
  lng: number;
  /** The lead's own 1-based rank WITHIN the map pack at this point (1 =
   *  first of the local_pack entries DataForSEO returned here). Null when
   *  the lead does not appear in the pack at this point at all — NEVER
   *  rendered as 0 (honesty gate: zero is a real rank, not "absent"). */
  rank: number | null;
  appeared: boolean;
};

export type SearchVisibilityGridStatus = "ok" | "no_seed" | "no_data" | "error";

export type SearchVisibilityGridResult = {
  checkedAt: string;
  version: number;
  status: SearchVisibilityGridStatus;
  /** The SAME seed the single-point search-visibility section used — never
   *  a second, independently-built seed. */
  seed: string | null;
  centerLat: number | null;
  centerLng: number | null;
  /** Always 9 entries once status is "ok", row-major (see buildGridPoints);
   *  empty for every other status. */
  points: GridPointResult[];
};

/** The honest empty shape — used for every degradation path (no seed, no
 *  lat/lng, no data at any of the 9 points, a resolution failure). Never
 *  fabricated, same convention as emptySearchVisibility. */
export function emptySearchVisibilityGrid(
  now: () => string,
  status: SearchVisibilityGridStatus = "no_seed",
  seed: string | null = null,
  centerLat: number | null = null,
  centerLng: number | null = null,
): SearchVisibilityGridResult {
  return {
    checkedAt: now(),
    version: SEARCH_VISIBILITY_GRID_CACHE_VERSION,
    status,
    seed,
    centerLat,
    centerLng,
    points: [],
  };
}

// ── Grid geometry ────────────────────────────────────────────────────────────
// 3x3 = 9 points, spaced so the box spans GRID_BOX_MILES edge to edge (the
// two outermost points on an axis are GRID_BOX_MILES apart) — GRID_SIZE - 1
// gaps of GRID_BOX_MILES / (GRID_SIZE - 1) each. Standard degrees-per-mile
// approximation: 1 degree latitude ~= 69 miles everywhere; 1 degree longitude
// shrinks with latitude by cos(lat), since lines of longitude converge at the
// poles.
export const GRID_SIZE = 3;
export const GRID_BOX_MILES = 5;
const MILES_PER_DEGREE_LATITUDE = 69.0;

export function milesToLatDegrees(miles: number): number {
  return miles / MILES_PER_DEGREE_LATITUDE;
}

export function milesToLngDegrees(miles: number, atLat: number): number {
  const milesPerDegreeLng = MILES_PER_DEGREE_LATITUDE * Math.cos((atLat * Math.PI) / 180);
  // A pathological atLat near +/-90 could flatten milesPerDegreeLng toward 0
  // (undefined/huge offset) — guard rather than divide by ~0. No real
  // business address sits at a pole, but this keeps the function total.
  if (Math.abs(milesPerDegreeLng) < 1e-6) return 0;
  return miles / milesPerDegreeLng;
}

/** 9 grid points around (centerLat, centerLng), row-major (lat outer, lng
 *  inner) so index 4 (the middle of 9) is always the exact center point. */
export function buildGridPoints(centerLat: number, centerLng: number, boxMiles: number = GRID_BOX_MILES): GridPoint[] {
  const step = boxMiles / (GRID_SIZE - 1);
  const offsets = [-1, 0, 1].map((i) => i * step);
  const points: GridPoint[] = [];
  for (const dLatMiles of offsets) {
    const lat = centerLat + milesToLatDegrees(dLatMiles);
    for (const dLngMiles of offsets) {
      const lng = centerLng + milesToLngDegrees(dLngMiles, centerLat);
      points.push({ lat, lng });
    }
  }
  return points;
}

export const GRID_CENTER_POINT_INDEX = 4; // Math.floor(9 / 2), the exact center of a row-major 3x3

// ── Cache-key rounding ───────────────────────────────────────────────────────
// Rounds a grid point's coordinates to GRID_CACHE_ROUND_DECIMALS decimal
// degrees before it's ever used as a cache key — so two nearby leads whose
// 3x3 grids overlap can share a cell's lookup, same sharing rationale as
// search_visibility_cache's shared-seed keying (ten Detroit dentists share
// one seed lookup; here, overlapping grid cells share one point lookup).
// 2 decimal degrees ~= 0.69-1.1 miles depending on latitude — coarser than
// the ~2.5 mile spacing between adjacent grid points (GRID_BOX_MILES / 2),
// so rounding never collapses two DIFFERENT points in the same lead's own
// grid into one cache key.
export const GRID_CACHE_ROUND_DECIMALS = 2;

export function roundGridCoordinate(value: number): number {
  const factor = 10 ** GRID_CACHE_ROUND_DECIMALS;
  return Math.round(value * factor) / factor;
}

export function roundGridPoint(point: GridPoint): GridPoint {
  return { lat: roundGridCoordinate(point.lat), lng: roundGridCoordinate(point.lng) };
}

// ── Per-point rank extraction ────────────────────────────────────────────────
// "Rank" here means the lead's position WITHIN the map pack specifically
// (1st/2nd/3rd of the local_pack entries at this point), not its raw
// rank_absolute across the whole SERP — a grid rank tracker is a map-pack
// visibility tool, not an organic-rank tool (search-visibility's existing
// leadPosition already covers organic). Domain identity reuses the SAME
// normalizeDomain the single-point lookup's matchLeadDomain already uses —
// never a new matching heuristic.
export function extractGridPointRank(
  results: readonly SerpResult[],
  leadWebsite: string | null | undefined,
): { rank: number | null; appeared: boolean } {
  const leadDomain = normalizeDomain(leadWebsite);
  if (!leadDomain) return { rank: null, appeared: false };
  const localPack = results.filter((r) => r.type === "local_pack").sort((a, b) => a.position - b.position);
  const idx = localPack.findIndex((r) => normalizeDomain(r.domain) === leadDomain);
  if (idx === -1) return { rank: null, appeared: false };
  return { rank: idx + 1, appeared: true };
}

// ── Assembly ────────────────────────────────────────────────────────────────
export type GridPointResultsInput = { point: GridPoint; results: SerpResult[] };

export function buildSearchVisibilityGrid(
  input: {
    seed: string;
    centerLat: number;
    centerLng: number;
    leadWebsite: string | null | undefined;
    pointResults: GridPointResultsInput[];
  },
  now: () => string,
): SearchVisibilityGridResult {
  const points: GridPointResult[] = input.pointResults.map(({ point, results }) => {
    const { rank, appeared } = extractGridPointRank(results, input.leadWebsite);
    return { lat: point.lat, lng: point.lng, rank, appeared };
  });
  return {
    checkedAt: now(),
    version: SEARCH_VISIBILITY_GRID_CACHE_VERSION,
    status: "ok",
    seed: input.seed,
    centerLat: input.centerLat,
    centerLng: input.centerLng,
    points,
  };
}

// ── Cache/quota orchestration (deps-injected, so it's testable without a real
// DB or network — same pattern as search-visibility-core.ts's
// resolveSearchVisibilityCore). The wiring layer (search-visibility-grid.ts)
// builds the real deps (Supabase cache reads/writes keyed by the ROUNDED
// point, the rate-limiter-backed spend guard, the real DataForSEO fetches,
// the shared normalizeSerp) and calls this.
export type CachedGridPointRow = { fetchedAt: string; serpAnalysis: unknown };

export type SearchVisibilityGridDeps = {
  now: () => string;
  ttlDays: number;
  hasApiKey: boolean;
  /** Resolves true while under the grid's OWN monthly quota. Checked ONCE
   *  per grid run (not once per point) — a grid run is one quota unit, same
   *  posture as search-visibility's one-quota-unit-per-seed-lookup. */
  underQuota: () => Promise<boolean>;
  resolveSerpLocationCode: () => Promise<number>;
  getCache: (seed: string, roundedLat: number, roundedLng: number, serpLoc: number) => Promise<CachedGridPointRow | null>;
  setCache: (seed: string, roundedLat: number, roundedLng: number, serpLoc: number, row: CachedGridPointRow) => Promise<void>;
  fetchPointSerp: (seed: string, lat: number, lng: number, serpLoc: number) => Promise<unknown>;
  normalizeSerp: (raw: unknown) => SerpResult[];
};

/**
 * The seed(reused) -> location -> 9x(cache -> fetch) -> assemble pipeline,
 * fully deps-injected. Never throws past a per-point fetch/normalize error —
 * any single point's failure degrades to an honest empty point (rank: null,
 * appeared: false), it never fails the whole grid. Missing seed or center
 * lat/lng skips everything and returns empty immediately, without touching
 * location resolution, the cache, quota, or network at all.
 */
export async function resolveSearchVisibilityGridCore(
  input: { seed: string | null; centerLat: number | null; centerLng: number | null; leadWebsite: string | null | undefined },
  deps: SearchVisibilityGridDeps,
): Promise<SearchVisibilityGridResult> {
  const { seed, centerLat, centerLng } = input;
  if (!seed || centerLat == null || centerLng == null) {
    return emptySearchVisibilityGrid(deps.now, "no_seed", seed, centerLat, centerLng);
  }

  const serpLoc = await deps.resolveSerpLocationCode();
  const points = buildGridPoints(centerLat, centerLng);
  const canFetchQuota = deps.hasApiKey && (await deps.underQuota());

  const pointResults = await Promise.all(
    points.map(async (point): Promise<GridPointResultsInput> => {
      const rounded = roundGridPoint(point);
      const cached = await deps.getCache(seed, rounded.lat, rounded.lng, serpLoc);
      const fresh = isGridCacheFresh(cached?.fetchedAt, deps.ttlDays, Date.parse(deps.now()));

      let serpRaw: unknown = null;
      if (fresh && cached) {
        serpRaw = cached.serpAnalysis;
      } else {
        if (canFetchQuota) {
          try {
            serpRaw = await deps.fetchPointSerp(seed, point.lat, point.lng, serpLoc);
            await deps.setCache(seed, rounded.lat, rounded.lng, serpLoc, { fetchedAt: deps.now(), serpAnalysis: serpRaw }).catch(() => {});
          } catch {
            serpRaw = null;
          }
        }
        if (!serpRaw && cached) serpRaw = cached.serpAnalysis; // stale fallback, same posture as search-visibility
      }

      const results = serpRaw ? deps.normalizeSerp(serpRaw) : [];
      return { point, results };
    }),
  );

  const anyData = pointResults.some((r) => r.results.length > 0);
  if (!anyData) return emptySearchVisibilityGrid(deps.now, "no_data", seed, centerLat, centerLng);

  return buildSearchVisibilityGrid({ seed, centerLat, centerLng, leadWebsite: input.leadWebsite, pointResults }, deps.now);
}

/** True when a cached grid-point lookup is still within its TTL. Same shape
 *  as search-visibility-core.ts's isSearchVisibilityCacheFresh, duplicated
 *  (not imported) so this file has zero dependency on the single-point
 *  wiring beyond the shared SerpResult/normalizeDomain types above — the
 *  grid is its own independently-cached feature. */
export function isGridCacheFresh(fetchedAt: string | null | undefined, ttlDays: number, nowMs: number): boolean {
  if (!fetchedAt) return false;
  const t = Date.parse(fetchedAt);
  if (Number.isNaN(t)) return false;
  return nowMs - t < ttlDays * 86_400_000;
}

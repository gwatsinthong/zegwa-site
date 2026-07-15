// Captures a full-page screenshot of each live /work demo subdomain and
// writes it to public/work/<subdomain>.webp, plus public/work/thumbs.json
// mapping subdomain -> { width, height } of the final encoded image.
//
// Run: pnpm capture:work-thumbs
//
// Each demo site shows a "this is a demo" gate on load (DemoBanner). There is
// no cookie/localStorage flag to pre-suppress it (confirmed: no such
// mechanism exists in this repo or is documented anywhere for these sites),
// so instead we drive the real dismiss flow in-browser: wait for the "Got
// it" button, click it, wait for it to disappear, then assert no "this is a
// demo site" text remains visible before capturing. If the dismiss button
// never appears, that subdomain's shot is untrustworthy (page didn't render,
// or the demo gate is off) -- we skip it and report rather than capture a
// shot that might still have the gate baked in.

import { chromium, type Page } from 'playwright'
import sharp from 'sharp'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const SUBDOMAINS = [
  'roofing',
  'plumbing',
  'hvac',
  'weight-loss',
  'electrical',
  'accounting',
  'med-spa',
  'auto',
  'cleaning',
  'vet',
  'gym',
  'dental',
  'injury-law',
  'real-estate',
  'landscaping',
]

const OUT_DIR = path.join(process.cwd(), 'public', 'work')
const CHROMIUM_PATH = process.env.CHROMIUM_PATH || undefined
const TARGET_WIDTH = 720
const WEBP_QUALITY = 80

async function dismissDemoModal(page: Page, subdomain: string) {
  const gotIt = page
    .getByRole('button', { name: /^got it$/i })
    .or(page.locator('button, [role="button"], a').filter({ hasText: /^\s*got it\s*$/i }))
    .first()

  try {
    await gotIt.waitFor({ state: 'visible', timeout: 5000 })
  } catch {
    throw new Error(
      '"Got it" dismiss button not found within 5s -- modal missing or page did not render. Shot skipped, not captured.',
    )
  }

  await gotIt.click()
  await gotIt.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
}

// Same dismiss flow, but for after the reload below: the modal may or may
// not reappear depending on whether the site persists the dismissal across
// navigations, and either case is fine.
async function dismissDemoModalIfPresent(page: Page) {
  const gotIt = page
    .getByRole('button', { name: /^got it$/i })
    .or(page.locator('button, [role="button"], a').filter({ hasText: /^\s*got it\s*$/i }))
    .first()

  const appeared = await gotIt
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false)

  if (appeared) {
    await gotIt.click()
    await gotIt.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
  }
}

// Confirms the page is truly scrolled to the top, including any lenis smooth
// -scroll instance the site may run (which keeps its own scroll state
// separate from window.scrollY). If not, forces it and re-checks once before
// giving up.
async function assertScrollAtTop(page: Page) {
  const readScrollState = () =>
    page.evaluate(() => {
      const lenis = (window as unknown as { lenis?: { scroll?: number } }).lenis
      return {
        scrollY: window.scrollY,
        lenisScroll: lenis && typeof lenis.scroll === 'number' ? lenis.scroll : 0,
      }
    })

  let state = await readScrollState()

  if (state.scrollY !== 0 || state.lenisScroll !== 0) {
    await page.evaluate(() => {
      const lenis = (window as unknown as { lenis?: { scrollTo: (target: number, opts?: unknown) => void } })
        .lenis
      if (lenis && typeof lenis.scrollTo === 'function') lenis.scrollTo(0, { immediate: true })
      document.documentElement.scrollTop = 0
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(300)
    state = await readScrollState()
  }

  if (state.scrollY !== 0 || state.lenisScroll !== 0) {
    throw new Error(
      `Page did not settle at scroll top after reload (scrollY=${state.scrollY}, lenisScroll=${state.lenisScroll}) -- shot skipped, not captured.`,
    )
  }
}

async function assertNoDemoText(page: Page) {
  const matches = page.getByText(/this is a demo site/i)
  const count = await matches.count()
  for (let i = 0; i < count; i++) {
    if (await matches.nth(i).isVisible()) {
      throw new Error('"This is a demo site" text still visible right before screenshot -- aborted, not captured.')
    }
  }
}

// Scrolls to the bottom in steps (triggering any lazy-loaded/observer-based
// images along the way) then back to the top, where the screenshot starts.
async function triggerLazyLoad(page: Page) {
  await page.evaluate(async () => {
    const step = 600
    const delay = 150
    let y = 0
    while (y < document.body.scrollHeight) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, delay))
      y += step
    }
    window.scrollTo(0, document.body.scrollHeight)
    await new Promise((r) => setTimeout(r, delay))
    window.scrollTo(0, 0)
  })
}

type Result = { width: number; height: number }

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true })
  const rawDir = await fs.mkdtemp(path.join(os.tmpdir(), 'work-thumbs-'))

  const browser = await chromium.launch(CHROMIUM_PATH ? { executablePath: CHROMIUM_PATH } : {})
  const results: Record<string, Result> = {}
  const failures: string[] = []

  for (const subdomain of SUBDOMAINS) {
    const url = `https://${subdomain}.zegwastudio.com`
    process.stdout.write(`\n=== ${subdomain} (${url}) ===\n`)

    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 2,
    })
    const page = await context.newPage()

    // Without this, the browser restores the scroll position from the
    // previous load on reload -- so the reload below (meant to return to a
    // pristine top-of-page state) instead lands back at the bottom.
    await page.addInitScript(() => {
      history.scrollRestoration = 'manual'
    })

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 })

      await dismissDemoModal(page, subdomain)

      await page.evaluate(() => document.fonts.ready)

      await triggerLazyLoad(page)

      // Reload with the now-warm cache: previously lazy-loaded images render
      // immediately, and the page returns to a genuinely pristine top-of-page
      // scroll state instead of whatever scroll-aware header/lenis state the
      // lazy-load pass above left behind.
      await page.reload({ waitUntil: 'networkidle', timeout: 45000 })

      await dismissDemoModalIfPresent(page)

      await page.evaluate(() => document.fonts.ready)

      await assertScrollAtTop(page)

      await assertNoDemoText(page)

      await page.waitForTimeout(500)

      const rawPath = path.join(rawDir, `${subdomain}.png`)
      await page.screenshot({ path: rawPath, fullPage: true })

      const outPath = path.join(OUT_DIR, `${subdomain}.webp`)
      await sharp(rawPath)
        .resize({ width: TARGET_WIDTH })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath)

      const meta = await sharp(outPath).metadata()
      const width = meta.width!
      const height = meta.height!
      const stat = await fs.stat(outPath)

      results[subdomain] = { width, height }
      console.log(`OK    ${subdomain}: ${width}x${height}  ${(stat.size / 1024).toFixed(1)} KB`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      failures.push(`${subdomain}: ${msg}`)
      console.error(`FAIL  ${subdomain}: ${msg}`)
    } finally {
      await context.close()
    }
  }

  await browser.close()
  await fs.rm(rawDir, { recursive: true, force: true })

  await fs.writeFile(
    path.join(OUT_DIR, 'thumbs.json'),
    JSON.stringify(results, null, 2) + '\n',
  )

  console.log('\n=== SUMMARY ===')
  console.table(results)

  if (failures.length) {
    console.error(`\n=== ${failures.length} SITE(S) FAILED -- NOT CAPTURED ===`)
    for (const f of failures) console.error(' -', f)
    process.exitCode = 1
  }
}

main()

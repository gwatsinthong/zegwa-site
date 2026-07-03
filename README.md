# Zegwa

Marketing site for Zegwa. Next.js 14 App Router, TypeScript, Tailwind, pnpm.

Static frontend. No database, no server actions, no API routes. It will later
call one external endpoint from the browser.

## Develop

```bash
pnpm install
pnpm dev
```

## Check

```bash
pnpm typecheck
pnpm build
```

## Design tokens

Tokens live as CSS custom properties in `app/globals.css` and are mapped into
Tailwind in `tailwind.config.ts`. Light is the default. Dark tokens are stubbed
for a later step.

- `--bg` warm off-white background
- `--text` near-black text
- `--accent-red` / `--accent-red-bright` reserved for the money-band section and
  the VSL play button only. Never on CTAs, errors, or forms.

CTAs are black. Corners are sharp. Dividers are hairlines.

## Fonts

Loaded through `next/font`.

- Space Grotesk 600 for display headlines (`--font-display`)
- Inter 400/500/600 for body, labels, inputs (`--font-body`)
- Instrument Serif 400 italic, loaded now, used later in the money-band kicker
  line only (`--font-serif`)

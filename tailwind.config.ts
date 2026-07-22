import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        hairline: 'var(--hairline)',
        'accent-red': 'var(--accent-red)',
        'accent-red-bright': 'var(--accent-red-bright)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      maxWidth: {
        shell: '1200px',
      },
      keyframes: {
        // Slow comet-light sweep for the black PillCta's idle ring accent.
        'ring-spin': {
          to: { transform: 'rotate(360deg)' },
        },
        // Soft diagonal sheen drifting across the black PillCta's pill face.
        'pill-shimmer': {
          '0%': { backgroundPosition: '-160% 0' },
          '100%': { backgroundPosition: '220% 0' },
        },
      },
      animation: {
        'ring-spin': 'ring-spin 7s linear infinite',
        'pill-shimmer': 'pill-shimmer 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config

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
        // Hero orbit entrance, sequenced glow -> orb -> cards (SearchOrbit).
        'glow-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'orb-in': {
          '0%': { opacity: '0', transform: 'scale(0.75)' },
          '60%': { opacity: '1', transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(18px) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        // Slow breathing glow for the red money-band PillCta's idle state
        // (it sits on a dark surface, so a soft red bloom reads well there).
        // 0%/100% match the CTA's plain rest shadow so prefers-reduced-motion
        // users (who never get the animate-* utility) still see that shadow.
        'red-glow-pulse': {
          '0%, 100%': { boxShadow: '0 10px 24px rgba(0,0,0,0.35), 0 0 0px rgba(249,22,38,0)' },
          '50%': { boxShadow: '0 10px 24px rgba(0,0,0,0.35), 0 0 30px rgba(249,22,38,0.55)' },
        },
      },
      animation: {
        'ring-spin': 'ring-spin 7s linear infinite',
        'pill-shimmer': 'pill-shimmer 3.2s ease-in-out infinite',
        'glow-in': 'glow-in 900ms ease-out both',
        'orb-in': 'orb-in 650ms cubic-bezier(0.16,1,0.3,1) both',
        'card-in': 'card-in 600ms cubic-bezier(0.16,1,0.3,1) both',
        'red-glow-pulse': 'red-glow-pulse 2600ms ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config

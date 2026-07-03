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
    },
  },
  plugins: [],
}

export default config

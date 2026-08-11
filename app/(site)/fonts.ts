import { Space_Grotesk, Inter, Instrument_Serif } from 'next/font/google'

// Display headlines.
export const display = Space_Grotesk({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-display',
  display: 'swap',
})

// Body, labels, inputs.
export const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

// Loaded now, used later in the money-band kicker line only.
export const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-serif',
  display: 'swap',
})

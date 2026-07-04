import type { Metadata } from 'next'
import { display, body, serif } from './fonts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import { SITE_URL, SITE_NAME, OG_IMAGE, organizationJsonLd } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Zegwa Studio: get found and never miss a booking',
    template: '%s · Zegwa Studio',
  },
  description:
    'We build your web presence and an AI front desk so local businesses show up in search and answer every call. Get a free audit in 24 hours.',
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    url: SITE_URL,
    // Swap: real OG image once Gwatsin supplies one.
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${serif.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-bg font-body text-text">
        {/* Organization + WebSite JSON-LD, rendered in the SSR/SSG HTML. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <SmoothScroll />
        {/* Two full-height vertical margin rules (frame 321:1284 / 1285, present
            on every frame): a #cecece hairline flanked by #fefefe, 3px wide, at
            the 100px page insets (a 1240px column). Fixed, behind content, and
            hidden below the column width. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-y-0 left-1/2 -z-10 hidden w-full max-w-[1240px] -translate-x-1/2 min-[1240px]:block"
        >
          <span className="absolute inset-y-0 left-0 w-[3px] border-x border-[#fefefe] bg-[#cecece]" />
          <span className="absolute inset-y-0 right-0 w-[3px] border-x border-[#fefefe] bg-[#cecece]" />
        </div>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

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
      <body className="relative isolate flex min-h-screen flex-col bg-bg font-body text-text">
        {/* Organization + WebSite JSON-LD, rendered in the SSR/SSG HTML. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <SmoothScroll />
        {/* Header/main/Footer + the margin rules share this wrapper so the rules'
            height tracks real content instead of a hardcoded number: the
            wrapper's height is set by its normal-flow children (Header + main +
            Footer), and the absolutely-positioned rules stretch to match via
            inset-y-0 (top:0/bottom:0) rather than a fixed h-[]. That keeps
            document scrollHeight equal to the footer's bottom on every page,
            regardless of how tall that page's content is. */}
        <div className="relative flex flex-1 flex-col">
          {/* Two vertical margin rules (frame 321:1284 / 1285): bg #cecece with a
              1px #fefefe border on each side, 3px wide. They live in a
              max-w-[1440px] mx-auto container (the frame artboard width) centered
              on the full-bleed #e8e8e8 surface, with each rule 100px inside the
              container edge — symmetric 100/100 at 1440 (x=100 / x=1337). Beyond
              1440 the container caps and centers, so the rules stay locked to the
              centered 1440 artboard (100px inside it) instead of spreading with
              the viewport. -z-10 (inside the isolated body) keeps them behind
              content: they show through the transparent header at the top and
              are occluded by the dark band and footer. Hidden below the column
              width. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 hidden w-full max-w-[1440px] -translate-x-1/2 min-[1240px]:block"
          >
            <span className="absolute left-[100px] top-0 h-full w-[3px] border-x border-[#fefefe] bg-[#cecece]" />
            <span className="absolute right-[100px] top-0 h-full w-[3px] border-x border-[#fefefe] bg-[#cecece]" />
          </div>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'

// Public base URL of the deployed site. Gwatsin sets the real domain via
// NEXT_PUBLIC_SITE_URL in Vercel; this fallback keeps builds working locally.
// FLAG: confirm the production value before launch.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://zegwastudio.com').replace(
  /\/$/,
  '',
)

export const SITE_NAME = 'Zegwa Studio'

// Swap: replace with the real 1200x630 Open Graph image once Gwatsin supplies
// one. Referenced by path only; the asset does not exist yet.
export const OG_IMAGE = '/og-default.png'

function absolute(path: string) {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`
}

// Builds a page's Metadata: unique title (templated unless absoluteTitle),
// description, self-canonical, and matching Open Graph + Twitter cards.
export function pageMeta({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string
  description: string
  path: string
  absoluteTitle?: boolean
}): Metadata {
  const url = absolute(path)
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      // Swap: real OG image (see OG_IMAGE).
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  }
}

// Organization + WebSite JSON-LD, server-rendered in the root layout. Only
// genuinely displayed facts: name, legal name, registered address, CIN, and the
// contact email. No ratings, reviews, or awards (none are shown). sameAs is
// omitted until real social profiles exist.
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: 'Zegwa Studio (OPC) Private Limited',
        url: SITE_URL,
        email: 'hello@zegwastudio.com',
        // Swap: real logo asset once available (no logo exists yet).
        logo: `${SITE_URL}/logo.png`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No. 472/7, Balaji Arcade, AVS Compound, Ejipura, Koramangala VI Bk',
          addressLocality: 'Bangalore South',
          addressRegion: 'Karnataka',
          postalCode: '560095',
          addressCountry: 'IN',
        },
        identifier: {
          '@type': 'PropertyValue',
          propertyID: 'CIN',
          value: 'U62012KA2026OPC218915',
        },
        // Swap: add real social profile URLs here (sameAs) once socials exist.
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }
}

// Per-page Service JSON-LD, rendered by the page itself (not the layout) on
// upcoming service/vertical pages. provider references the same Organization
// node organizationJsonLd() emits site-wide, by @id, rather than repeating or
// re-deriving it. Only genuinely assertable fields -- no aggregateRating, no
// review, no offers with invented prices.
export type ServiceJsonLdArgs = {
  name: string
  description: string
  url: string
  serviceType?: string
}

export function serviceJsonLd({ name, description, url, serviceType }: ServiceJsonLdArgs) {
  return {
    '@type': 'Service',
    name,
    description,
    url,
    serviceType: serviceType ?? name,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: 'United States',
  }
}

// Per-page FAQ JSON-LD. Google requires FAQ schema content to match what's
// visibly rendered on the page -- `items` MUST be the exact same array the
// page passes to the visible FaqList component, not a separately authored
// list. Define one `faqs` const per page and pass it to both.
export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }
}

// Combines a page's Service + FAQPage nodes into the single @graph object the
// page renders as its one JSON-LD <script> tag (mirrors organizationJsonLd()'s
// @graph shape).
export function pageJsonLd({
  service,
  faqs,
}: {
  service: ServiceJsonLdArgs
  faqs: { q: string; a: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [serviceJsonLd(service), faqPageJsonLd(faqs)],
  }
}

import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Allow all indexable content. /sample-report is noindex and shared manually,
// so it is disallowed. The AI-search crawlers named in the guidelines get an
// explicit allow rule (allow = simply not disallowed, stated per the docs).
export default function robots(): MetadataRoute.Robots {
  const rule = { allow: '/', disallow: '/sample-report' }
  return {
    rules: [
      { userAgent: '*', ...rule },
      { userAgent: 'GPTBot', ...rule },
      { userAgent: 'OAI-SearchBot', ...rule },
      { userAgent: 'ClaudeBot', ...rule },
      { userAgent: 'PerplexityBot', ...rule },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

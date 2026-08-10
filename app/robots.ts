import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Allow all indexable content. The AI-search crawlers named in the
// guidelines get an explicit allow rule (allow = simply not disallowed,
// stated per the docs).
export default function robots(): MetadataRoute.Robots {
  const rule = { allow: '/' }
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

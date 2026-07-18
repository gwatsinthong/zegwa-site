import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Only real, indexable routes. Excludes /sample-report (noindex) and the
// non-existent /capture and /hvac.
const ROUTES = [
  '/',
  '/work',
  '/pricing',
  '/local-seo',
  '/about',
  '/contact',
  '/start',
  '/privacy',
  '/terms',
  '/cookies',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }))
}

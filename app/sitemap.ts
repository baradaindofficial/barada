import type { MetadataRoute } from 'next'

const BASE = 'https://barada.in'

// Public, indexable pages only. Authenticated and admin routes are excluded (see robots.ts).
const PATHS = ['', '/qorvian', '/services', '/ecosystem', '/about', '/contact', '/enquire', '/privacy', '/terms']

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return PATHS.map((p) => ({
    url: `${BASE}${p}`,
    lastModified,
    changeFrequency: p === '' || p === '/qorvian' ? 'weekly' : 'monthly',
    priority: p === '' ? 1 : p === '/qorvian' ? 0.9 : 0.6,
  }))
}

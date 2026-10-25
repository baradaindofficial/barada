import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://barada.in'

// Public, indexable pages only. Authenticated and admin routes are excluded (see robots.ts).
const PATHS = ['', '/academy', '/services', '/ecosystem', '/about', '/contact', '/privacy', '/terms']

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return PATHS.map((p) => ({
    url: `${BASE}${p}`,
    lastModified,
    changeFrequency: p === '' || p === '/academy' ? 'weekly' : 'monthly',
    priority: p === '' ? 1 : p === '/academy' ? 0.9 : 0.6,
  }))
}

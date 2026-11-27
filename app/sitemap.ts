import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

const BASE = 'https://www.barada.in'

// Public, indexable pages only. Authenticated and admin routes are excluded (see robots.ts).
const PATHS = ['', '/qorvian', '/services', '/ecosystem', '/about', '/contact', '/enquire', '/verify', '/privacy', '/terms']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  let slugs: string[] = []
  try {
    const { data } = await (createAdminClient() as any).from('courses').select('slug, visibility').eq('status', 'published')
    slugs = (data || []).filter((c: any) => c.visibility !== 'private').map((c: any) => c.slug)
  } catch {}
  const courseEntries = slugs.map((s) => ({ url: `${BASE}/qorvian/${s}`, lastModified, changeFrequency: 'monthly' as const, priority: 0.7 }))
  return [...PATHS.map((p) => ({
    url: `${BASE}${p}`,
    lastModified,
    changeFrequency: (p === '' || p === '/qorvian' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: p === '' ? 1 : p === '/qorvian' ? 0.9 : 0.6,
  })), ...courseEntries]
}

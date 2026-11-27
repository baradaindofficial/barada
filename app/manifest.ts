import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QORVIAN by Barada',
    short_name: 'QORVIAN',
    description: 'Practical AI courses and certificates from Barada.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0A1A52',
    icons: [{ src: '/icon', sizes: '64x64', type: 'image/png' }],
  }
}

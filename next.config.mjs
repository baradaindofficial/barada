/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  // QORVIAN lives at /qorvian; the old /academy URL redirects permanently.
  async redirects() {
    return [{ source: '/academy', destination: '/qorvian', permanent: true }]
  },
  async rewrites() {
    return [{ source: '/qorvian', destination: '/academy' }]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

export default nextConfig

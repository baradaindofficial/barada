/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  // The certificate PDF reads the QORVIAN logo from public/ at runtime; make
  // sure the file is bundled with the API routes that render certificates.
  experimental: {
    outputFileTracingIncludes: { '/api/**/*': ['./public/qorvian-logo/image.png'] },
  },
  // QORVIAN lives at /qorvian; the old /academy URL redirects permanently.
  async redirects() {
    return [
      { source: '/academy', destination: '/qorvian', permanent: true },
      { source: '/academy/:slug', destination: '/qorvian/:slug', permanent: true },
    ]
  },
  async rewrites() {
    return [
      { source: '/qorvian', destination: '/academy' },
      { source: '/qorvian/:slug', destination: '/academy/:slug' },
    ]
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

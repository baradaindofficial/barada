import Image from 'next/image'
import Link from 'next/link'

type LogoVariant = 'corporate' | 'academy' | 'icon' | 'footer'

interface LogoProps {
  variant: LogoVariant
  height?: number
  linkTo?: string
  className?: string
}

/**
 * Logo component — single source of truth for all Barada logos.
 * To swap a logo: replace the file in public/logo/ — no code changes needed.
 *
 * Variants:
 *   corporate — Barada parent brand logo (red square, white B, "BARADA")
 *   academy   — Barada Academy logo (white bg, red B, "BARADA ACADEMY")
 *   icon      — B mark only (for favicon, small spaces)
 *   footer    — Same as corporate, used in footer context
 *
 * Logo policy (Architecture v3.0):
 *   corporate → all pages under / /about /ecosystem /resources /community
 *   academy   → all pages under /academy /dashboard /learn /login /register
 *   icon      → favicon, nav small spaces
 *   footer    → footer column logo
 */
export default function Logo({ variant, height = 40, linkTo, className = '' }: LogoProps) {
  const config: Record<LogoVariant, { src: string; alt: string; width: number }> = {
    corporate: {
      src: '/logo/barada-logo.png',
      alt: 'Barada',
      width: Math.round(height * 1),   // square logo
    },
    academy: {
      // Using corporate logo temporarily until academy-logo.png is confirmed
      src: '/logo/academy-logo.png',
      alt: 'Barada Academy',
      width: Math.round(height * 1),   // square logo
    },
    icon: {
      src: '/logo/barada-icon.png',
      alt: 'Barada',
      width: height,
    },
    footer: {
      src: '/logo/barada-logo.png',
      alt: 'Barada',
      width: Math.round(height * 1),
    },
  }

  const { src, alt, width } = config[variant]

  const img = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  )

  if (linkTo) {
    return (
      <Link href={linkTo} style={{ display: 'inline-block', lineHeight: 0 }}>
        {img}
      </Link>
    )
  }

  return img
}

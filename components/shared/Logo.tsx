import Image from 'next/image'
import Link from 'next/link'
import BaradaMark from '@/components/shared/BaradaMark'

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
 *   corporate — Barada parent brand logo (B icon + "BARADA" text)
 *   academy   — Barada Academy logo (B icon + "BARADA ACADEMY" text)
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
      src: '/logo/barada-symbol-96.png',
      alt: 'Barada',
      width: Math.round(height * 1),
    },
    academy: {
      src: '/logo/barada-symbol-96.png',
      alt: 'QORVIAN by Barada',
      width: Math.round(height * 1),
    },
    icon: {
      src: '/logo/barada-icon.png',
      alt: 'Barada',
      width: height,
    },
    footer: {
      src: '/logo/barada-symbol-96.png',
      alt: 'Barada',
      width: Math.round(height * 1),
    },
  }

  const { src, alt, width } = config[variant]

  if (variant === 'academy') {
    // QORVIAN by Barada lockup, cropped from the supplied logo (tagline row hidden).
    const k = height / 400
    const lockup = (
      <span
        role="img"
        aria-label={alt}
        style={{
          display: 'inline-block',
          position: 'relative',
          flexShrink: 0,
          width: Math.round(1970 * k),
          height: Math.round(400 * k),
          overflow: 'hidden',
          background: '#fff',
          borderRadius: Math.max(6, Math.round(height * 0.2)),
          lineHeight: 0,
        }}
      >
        <Image
          src="/qorvian-logo/image.png"
          alt=""
          width={Math.round(2172 * k)}
          height={Math.round(724 * k)}
          unoptimized
          style={{ position: 'absolute', left: -Math.round(90 * k), top: -Math.round(80 * k), maxWidth: 'none' }}
        />
      </span>
    )
    if (linkTo) {
      return (
        <Link href={linkTo} style={{ display: 'inline-block', lineHeight: 0 }}>
          {lockup}
        </Link>
      )
    }
    return lockup
  }

  const img = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {variant === 'icon' ? (
        <Image src={src} alt={alt} width={width} height={height} className={className} priority />
      ) : (
        <BaradaMark size={height} label={alt} className={className} />
      )}
      {(variant === 'corporate' || variant === 'footer') && (
        <span style={{ fontWeight: 800, fontSize: height * 0.45, color: '#fff', letterSpacing: 0.5 }}>BARADA</span>
      )}
    </span>
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

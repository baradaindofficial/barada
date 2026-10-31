'use client'

import { useRef } from 'react'

// Lightweight 3D hover effect for image cards: the card tilts toward the
// pointer and lifts slightly. CSS transforms only, no library. Disabled on
// touch input and for visitors who prefer reduced motion.
export default function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'touch') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) translateZ(8px)`
    el.style.boxShadow = '0 24px 40px -18px rgba(13,24,61,0.45)'
  }

  function leave() {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.boxShadow = ''
  }

  return (
    <div style={{ perspective: 800 }}>
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        style={{ transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out', borderRadius: 16, transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  )
}

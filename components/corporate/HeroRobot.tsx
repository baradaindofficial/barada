'use client'

import { useRef } from 'react'

// Original Barada robot illustration for the corporate homepage hero.
// Drawn from scratch as vector shapes (no stock art, no existing mascot).
// "3D" is a lightweight CSS effect: the figure tilts slightly toward the
// pointer and its layers sit at different depths. No 3D library, no model
// file, no extra network requests. The tilt and float animations are
// disabled for visitors who prefer reduced motion (see the style block).
export default function HeroRobot() {
  const stageRef = useRef<HTMLDivElement>(null)

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'touch') return
    const el = stageRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 16).toFixed(2)}deg`)
  }

  function handleLeave() {
    const el = stageRef.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div className="b-robot-wrap" onPointerMove={handleMove} onPointerLeave={handleLeave}>
      <div ref={stageRef} className="b-robot-stage">
        {/* Back layer: glow, circuit lines, nodes */}
        <svg className="b-layer b-back" viewBox="0 0 420 460" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="brGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#D4AF37" stopOpacity=".32" />
              <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="210" cy="230" r="205" fill="url(#brGlow)" />
          <g stroke="#2B3A66" strokeWidth="2" fill="none">
            <path d="M30 120h90l30 30" />
            <path d="M390 140h-80l-30 30" />
            <path d="M40 360h100l30-30" />
            <path d="M380 340h-90l-30-30" />
          </g>
          <g fill="#D4AF37">
            <circle cx="30" cy="120" r="6" />
            <circle cx="390" cy="140" r="6" />
            <circle cx="40" cy="360" r="6" />
            <circle cx="380" cy="340" r="6" />
          </g>
        </svg>

        {/* Front layer: the robot */}
        <svg
          className="b-layer b-front"
          viewBox="0 0 420 460"
          role="img"
          aria-label="Illustration of a friendly Barada robot with a glowing visor"
        >
          <defs>
            <linearGradient id="brBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#26335A" />
              <stop offset="1" stopColor="#141C38" />
            </linearGradient>
          </defs>
          <line x1="210" y1="60" x2="210" y2="95" stroke="#5B6A8C" strokeWidth="6" strokeLinecap="round" />
          <circle className="b-beacon" cx="210" cy="50" r="12" fill="#E31E24" />
          <rect x="105" y="95" width="210" height="150" rx="38" fill="url(#brBody)" stroke="#3A4C85" strokeWidth="3" />
          <rect x="130" y="130" width="160" height="72" rx="28" fill="#070C1A" stroke="#D4AF37" strokeWidth="3" />
          <ellipse className="b-eye" cx="177" cy="166" rx="16" ry="19" fill="#D4AF37" />
          <ellipse className="b-eye" cx="243" cy="166" rx="16" ry="19" fill="#D4AF37" />
          <rect x="188" y="222" width="44" height="6" rx="3" fill="#3A4C85" />
          <rect x="88" y="145" width="18" height="50" rx="9" fill="#3A4C85" />
          <rect x="314" y="145" width="18" height="50" rx="9" fill="#3A4C85" />
          <rect x="190" y="245" width="40" height="22" fill="#3A4C85" />
          <rect x="120" y="267" width="180" height="140" rx="34" fill="url(#brBody)" stroke="#3A4C85" strokeWidth="3" />
          <rect x="160" y="300" width="100" height="64" rx="14" fill="#070C1A" stroke="#2B3A66" strokeWidth="2" />
          <polyline points="172,345 192,325 208,338 228,312 248,330" fill="none" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="150" cy="385" r="5" fill="#E31E24" />
          <circle cx="170" cy="385" r="5" fill="#D4AF37" />
          <path d="M120 300q-45 10-55 55" fill="none" stroke="#3A4C85" strokeWidth="20" strokeLinecap="round" />
          <path d="M300 300q45-30 60-75" fill="none" stroke="#3A4C85" strokeWidth="20" strokeLinecap="round" />
          <circle cx="64" cy="362" r="16" fill="#26335A" stroke="#D4AF37" strokeWidth="3" />
          <circle cx="362" cy="220" r="16" fill="#26335A" stroke="#D4AF37" strokeWidth="3" />
          <rect x="150" y="415" width="120" height="16" rx="8" fill="#3A4C85" />
        </svg>
      </div>

      <style>{`
        .b-robot-wrap { width: 100%; max-width: 440px; margin: 0 auto; perspective: 900px; }
        .b-robot-stage {
          --rx: 0deg; --ry: 0deg;
          position: relative; width: 100%; aspect-ratio: 420 / 460;
          transform-style: preserve-3d;
          transform: rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform 0.15s ease-out;
          animation: b-float 6s ease-in-out infinite;
        }
        .b-layer { position: absolute; inset: 0; width: 100%; height: 100%; }
        .b-back { transform: translateZ(0); }
        .b-front { transform: translateZ(50px); filter: drop-shadow(0 18px 24px rgba(0,0,0,0.45)); }
        .b-eye { transform-box: fill-box; transform-origin: center; animation: b-blink 5s infinite; }
        .b-beacon { animation: b-pulse 2.4s ease-in-out infinite; }
        @keyframes b-float { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
        @keyframes b-blink { 0%,94%,100% { transform: scaleY(1); } 97% { transform: scaleY(0.1); } }
        @keyframes b-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
        @media (prefers-reduced-motion: reduce) {
          .b-robot-stage { animation: none; transition: none; transform: none; }
          .b-eye, .b-beacon { animation: none; }
        }
      `}</style>
    </div>
  )
}

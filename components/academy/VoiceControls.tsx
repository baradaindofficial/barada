'use client'

/**
 * components/academy/VoiceControls.tsx
 * Barada Academy -- Voice Activation, Sprint 5 follow-on (2026-10-02, CTO approved)
 *
 * Read-aloud (text-to-speech) + optional voice-command navigation, built
 * entirely on the browser-native Web Speech API -- no external service,
 * no API key, no recurring cost (CTO decision).
 *
 * `enableCommands` controls whether the mic/voice-command UI renders at
 * all. It is explicitly left OFF on the Evaluation pages (CTO safety
 * decision, 2026-10-02): a misheard word must never be able to submit an
 * answer or advance a paid (INR 299) certification attempt. Evaluation
 * pages pass enableCommands={false} and get the "Read Aloud" button only.
 *
 * Commands recognised when enabled: "next" / "previous" / "repeat" /
 * "stop". Unsupported browsers (no SpeechSynthesis / no SpeechRecognition)
 * simply don't render the corresponding control -- no broken buttons.
 */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import { useVoiceCommands } from '@/hooks/useVoiceCommands'

const navy = '#0D183D'
const red = '#E31E24'
const gold = '#D4AF37'

interface VoiceControlsProps {
  /** Plain text to read aloud. */
  text: string
  /** Show the mic / voice-command toggle. Off by default -- pass true only for lesson pages. */
  enableCommands?: boolean
  /** Where "next" should navigate, when enableCommands is true. */
  nextHref?: string
  /** Where "previous" should navigate, when enableCommands is true. */
  prevHref?: string
  /** Short label for the read-aloud button, e.g. "Read lesson aloud" or "Read question aloud". */
  label?: string
}

export default function VoiceControls({
  text,
  enableCommands = false,
  nextHref,
  prevHref,
  label = 'Read aloud',
}: VoiceControlsProps) {
  const router = useRouter()
  const tts = useTextToSpeech()
  const [readAloudHover, setReadAloudHover] = useState(false)

  const voice = useVoiceCommands(
    enableCommands
      ? {
          next: () => nextHref && router.push(nextHref),
          previous: () => prevHref && router.push(prevHref),
          repeat: () => tts.speak(text),
          stop: () => tts.stop(),
        }
      : {}
  )

  // Stop any in-progress speech if the underlying text changes (e.g. the
  // learner navigates to a new lesson, or the evaluation question changes)
  // so audio never reads stale content.
  useEffect(() => {
    return () => {
      tts.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  if (!tts.supported && !voice.supported) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10, padding: '0.625rem 0.875rem', marginBottom: '1.25rem',
    }}>
      {tts.supported && (
        <button
          type="button"
          onClick={() => tts.toggle(text)}
          onMouseEnter={() => setReadAloudHover(true)}
          onMouseLeave={() => setReadAloudHover(false)}
          aria-label={tts.speaking ? 'Stop reading aloud' : label}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            // Navy by default; Red while speaking, active, or hovered (CTO colour rule, 2026-10-03).
            background: (tts.speaking || readAloudHover) ? red : navy, color: '#fff', border: 'none',
            borderRadius: 8, padding: '0.5rem 0.875rem', fontSize: '0.8rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s ease',
          }}
        >
          <span aria-hidden="true">{tts.speaking ? '⏹' : '🔊'}</span>
          {tts.speaking ? 'Stop' : label}
        </button>
      )}

      {enableCommands && voice.supported && (
        <button
          type="button"
          onClick={voice.toggle}
          aria-pressed={voice.listening}
          aria-label={voice.listening ? 'Stop voice commands' : 'Start voice commands'}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: voice.listening ? 'rgba(212,175,55,0.15)' : 'transparent',
            color: voice.listening ? gold : 'rgba(255,255,255,0.6)',
            border: `1.5px solid ${voice.listening ? gold : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 8, padding: '0.5rem 0.875rem', fontSize: '0.8rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <span aria-hidden="true">{'🎙️'}</span>
          {voice.listening ? 'Listening…' : 'Voice commands'}
        </button>
      )}

      {enableCommands && voice.supported && voice.listening && (
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>
          Say &ldquo;next&rdquo;, &ldquo;previous&rdquo;, &ldquo;repeat&rdquo;, or &ldquo;stop&rdquo;
        </span>
      )}
    </div>
  )
}

'use client'

// Barada Academy -- Voice Activation, Sprint 5 follow-on (2026-10-02, CTO approved)
//
// Thin wrapper around the browser-native Web Speech API (SpeechSynthesis).
// No external service, no API key, no recurring cost -- per CTO decision.
// Support varies by browser (works in Chrome/Edge/Safari; degrades
// gracefully -- `supported` is false -- where it is missing, e.g. some
// older/locked-down browsers). Callers should hide/disable their UI when
// `supported` is false rather than calling speak().

import { useCallback, useEffect, useRef, useState } from 'react'

export function useTextToSpeech() {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const ok = typeof window !== 'undefined' && 'speechSynthesis' in window
    setSupported(ok)
    return () => {
      if (ok) window.speechSynthesis.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.98
    utterance.pitch = 1
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const toggle = useCallback((text: string) => {
    if (speaking) stop()
    else speak(text)
  }, [speaking, speak, stop])

  return { supported, speaking, speak, stop, toggle }
}

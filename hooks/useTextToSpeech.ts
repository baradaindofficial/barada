'use client'

// Barada Academy -- Voice Activation, Sprint 5 follow-on (2026-10-02, CTO approved)
//
// Thin wrapper around the browser-native Web Speech API (SpeechSynthesis).
// No external service, no API key, no recurring cost -- per CTO decision.
// 2026-11-12: prefers an Indian-English (en-IN) voice when the device has one
// (Google / Microsoft / Apple ship them), then any English voice. speak()
// takes an optional onEnd callback so the slide player can auto-advance.
// Support varies by browser; `supported` is false where it is missing.

import { useCallback, useEffect, useRef, useState } from 'react'

const INDIAN_NAMES = /(heera|neerja|ravi|prabhat|rishi|veena|lekha|kalpana|hemant|google.*(india|en-in))/i

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  const inVoices = voices.filter((v) => /en[-_]IN/i.test(v.lang) || INDIAN_NAMES.test(v.name))
  const pool = inVoices.length ? inVoices : voices.filter((v) => /^en/i.test(v.lang))
  if (!pool.length) return null
  const natural = pool.find((v) => /(natural|neural|online|google)/i.test(v.name))
  return natural || pool[0]
}

export function useTextToSpeech() {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceLabel, setVoiceLabel] = useState('')
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    const ok = typeof window !== 'undefined' && 'speechSynthesis' in window
    setSupported(ok)
    if (!ok) return
    const load = () => {
      voiceRef.current = pickVoice()
      setVoiceLabel(voiceRef.current ? `${voiceRef.current.name} (${voiceRef.current.lang})` : '')
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = voiceRef.current || pickVoice()
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    } else {
      utterance.lang = 'en-IN'
    }
    utterance.rate = 0.96
    utterance.pitch = 1
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => {
      setSpeaking(false)
      if (onEnd) onEnd()
    }
    utterance.onerror = () => setSpeaking(false)
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const toggle = useCallback((text: string) => {
    if (speaking) stop()
    else speak(text)
  }, [speaking, speak, stop])

  return { supported, speaking, speak, stop, toggle, voiceLabel }
}

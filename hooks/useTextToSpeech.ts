'use client'

// Barada Academy -- Voice Activation, Sprint 5 follow-on (2026-10-02, CTO approved)
//
// Thin wrapper around the browser-native Web Speech API (SpeechSynthesis).
// No external service, no API key, no recurring cost -- per CTO decision.
// 2026-11-15: voice picker. Voices are ranked: Indian-English female first,
// then any English female, then Indian-English, then English; male names are
// ranked down. The learner can choose any listed voice and the choice is
// remembered on the device. speak() takes an optional onEnd callback so the
// slide player can auto-advance. Support varies by browser; `supported` is
// false where it is missing.

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'barada-tts-voice'
const FEMALE = /(female|woman|neerja|heera|veena|lekha|kalpana|aditi|raveena|priya|swara|zira|hazel|susan|samantha|karen|moira|tessa|serena|sonia|libby|natasha|\b(ava|emma|aria|jenny)\b)/i
const MALE = /(\bmale\b|ravi|prabhat|rishi|hemant|david|mark|james|george|daniel|\b(alex|fred|guy|ryan|thomas|liam)\b)/i

export interface VoiceOption {
  name: string
  lang: string
  label: string
}

function score(v: SpeechSynthesisVoice): number {
  let s = 0
  if (/en[-_]IN/i.test(v.lang)) s += 40
  else if (/^en/i.test(v.lang)) s += 20
  else if (/^hi/i.test(v.lang)) s += 10
  else return -100
  if (FEMALE.test(v.name)) s += 30
  if (MALE.test(v.name)) s -= 30
  if (/(natural|neural|online|google)/i.test(v.name)) s += 5
  return s
}

function listVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return []
  return window.speechSynthesis
    .getVoices()
    .filter((v) => score(v) > -100)
    .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name))
}

function pickVoice(preferred?: string | null): SpeechSynthesisVoice | null {
  const list = listVoices()
  if (!list.length) return null
  if (preferred) {
    const found = list.find((v) => v.name === preferred)
    if (found) return found
  }
  return list[0]
}

function readStored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function useTextToSpeech() {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceLabel, setVoiceLabel] = useState('')
  const [voices, setVoices] = useState<VoiceOption[]>([])
  const [voiceName, setVoiceNameState] = useState('')
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    const ok = typeof window !== 'undefined' && 'speechSynthesis' in window
    setSupported(ok)
    if (!ok) return
    const load = () => {
      voiceRef.current = pickVoice(readStored())
      setVoices(listVoices().map((v) => ({ name: v.name, lang: v.lang, label: v.name + ' (' + v.lang + ')' })))
      setVoiceNameState(voiceRef.current ? voiceRef.current.name : '')
      setVoiceLabel(voiceRef.current ? voiceRef.current.name + ' (' + voiceRef.current.lang + ')' : '')
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [])

  const setVoiceName = useCallback((name: string) => {
    const v = listVoices().find((x) => x.name === name)
    if (!v) return
    voiceRef.current = v
    setVoiceNameState(v.name)
    setVoiceLabel(v.name + ' (' + v.lang + ')')
    try {
      window.localStorage.setItem(STORAGE_KEY, v.name)
    } catch {
      /* storage unavailable: choice just is not remembered */
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
    const voice = voiceRef.current || pickVoice(readStored())
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

  return { supported, speaking, speak, stop, toggle, voiceLabel, voices, voiceName, setVoiceName }
}

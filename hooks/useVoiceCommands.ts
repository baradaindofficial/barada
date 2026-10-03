'use client'

// Barada Academy -- Voice Activation, Sprint 5 follow-on (2026-10-02, CTO approved)
//
// Thin wrapper around the browser-native Web Speech API (SpeechRecognition /
// webkitSpeechRecognition). No external service, no API key, no recurring
// cost -- per CTO decision. Support is narrower than SpeechSynthesis (no
// Firefox, for example) -- `supported` is false where it is missing, and
// callers should hide/disable their mic UI in that case.
//
// CTO safety decision (2026-10-02): voice *commands* (this hook) are wired
// into lesson pages only, never into the Evaluation pages, so a misheard
// word cannot accidentally submit an answer or advance a paid (INR 299)
// certification attempt. Evaluation pages use useTextToSpeech only --
// see app/learn/[course]/evaluation/page.tsx.

import { useCallback, useEffect, useRef, useState } from 'react'

type CommandMap = Record<string, () => void>

// Minimal shape of the non-standard SpeechRecognition API -- not in
// TypeScript's default DOM lib, so we type only what we use.
interface SpeechRecognitionLike {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: any) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}

export function useVoiceCommands(commands: CommandMap) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const listeningRef = useRef(false)
  const commandsRef = useRef(commands)
  commandsRef.current = commands

  useEffect(() => {
    const SpeechRecognitionCtor =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null

    if (!SpeechRecognitionCtor) {
      setSupported(false)
      return
    }
    setSupported(true)

    const recognition: SpeechRecognitionLike = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-IN'

    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1]
      const transcript: string = last[0].transcript.trim().toLowerCase()
      for (const [phrase, action] of Object.entries(commandsRef.current)) {
        if (transcript.includes(phrase)) {
          action()
          break
        }
      }
    }
    recognition.onerror = () => {
      listeningRef.current = false
      setListening(false)
    }
    recognition.onend = () => {
      // Browsers end recognition after a pause in speech. If the user
      // hasn't explicitly turned listening off, restart it so "listening"
      // stays continuous rather than one-shot.
      if (listeningRef.current) {
        try {
          recognition.start()
        } catch {
          // Already started, or the tab lost mic focus -- ignore.
        }
      }
    }

    recognitionRef.current = recognition
    return () => {
      listeningRef.current = false
      try {
        recognition.stop()
      } catch {
        // Not started -- ignore.
      }
    }
  }, [])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    listeningRef.current = true
    setListening(true)
    try {
      recognitionRef.current.start()
    } catch {
      // Already running -- ignore.
    }
  }, [])

  const stop = useCallback(() => {
    listeningRef.current = false
    setListening(false)
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch {
      // Not running -- ignore.
    }
  }, [])

  const toggle = useCallback(() => {
    if (listeningRef.current) stop()
    else start()
  }, [start, stop])

  return { supported, listening, start, stop, toggle }
}

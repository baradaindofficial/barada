'use client'

/**
 * components/academy/LessonPlayer.tsx
 * Barada Academy -- slide-style lesson player (2026-11-12, CTO).
 *
 * Turns the lesson's text fields into a slide deck (title, intro, one slide
 * per section, exercise, takeaways) with narration (Indian-English browser
 * voice where available), a "Transcript" toggle for the full text, and a
 * mascot checkpoint of scenario questions at the end. Passing the checkpoint
 * (>= PASS_PCT) unlocks the next lesson; retries are unlimited.
 *
 * No new data is required: slides are derived from lessons.body ('### '
 * headings, '- ' bullets, '1. ' lists, ``` code fences). Scenario questions
 * come from lessons.checkpoint (jsonb) when present, otherwise a recall quiz
 * is generated from key_points.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import LessonBody from '@/components/academy/LessonBody'
import { courseTheme, type WatermarkKind } from '@/lib/academy/courseTheme'

const FOREST = '#0D4638'
const DEEP = '#08372C'
const GREEN = '#0E7A58'
const GOLD = '#D4AF37'
const PASS_PCT = 60

export interface CheckpointQuestion {
  scenario?: string
  question: string
  options: string[]
  answer: number
  explain?: string
}

interface Props {
  lessonKey: string
  title: string
  moduleNumber: number
  lessonNumber: number
  objectives: string[]
  description: string | null
  body: string | null
  practiceTask: string | null
  keyPoints: string[]
  checkpoint: CheckpointQuestion[] | null
  distractorPool: string[]
  nextHref?: string
  nextLabel: string
  isLast: boolean
  evaluationHref: string
  courseSlug?: string
  courseTitle?: string
  courseIcon?: string | null
  themeColor?: string | null
}

type Block =
  | { kind: 'h'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'code'; text: string }

type Slide =
  | { type: 'title'; heading: string; items: string[] }
  | { type: 'content'; heading: string; blocks: Block[] }
  | { type: 'exercise'; heading: string; text: string }
  | { type: 'takeaways'; heading: string; items: string[] }

function parseBlocks(text: string): Block[] {
  const lines = text.replace(/\r/g, '').split('\n')
  const blocks: Block[] = []
  let para: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null

  const flushPara = () => {
    if (para.length) blocks.push({ kind: 'p', text: para.join(' ').trim() })
    para = []
  }
  const flushList = () => {
    if (list) blocks.push({ kind: list.ordered ? 'ol' : 'ul', items: list.items })
    list = null
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trim()
    if (line.startsWith('```')) {
      flushPara()
      flushList()
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i])
        i++
      }
      blocks.push({ kind: 'code', text: code.join('\n') })
      continue
    }
    if (!line) {
      flushPara()
      flushList()
      continue
    }
    if (line.startsWith('### ')) {
      flushPara()
      flushList()
      blocks.push({ kind: 'h', text: line.slice(4) })
      continue
    }
    if (line.startsWith('- ')) {
      flushPara()
      if (!list || list.ordered) {
        flushList()
        list = { ordered: false, items: [] }
      }
      list.items.push(line.slice(2))
      continue
    }
    if (/^\d+\.\s/.test(line)) {
      flushPara()
      if (!list || !list.ordered) {
        flushList()
        list = { ordered: true, items: [] }
      }
      list.items.push(line.replace(/^\d+\.\s/, ''))
      continue
    }
    flushList()
    para.push(line)
  }
  flushPara()
  flushList()
  return blocks
}

function blockLength(b: Block): number {
  if (b.kind === 'ul' || b.kind === 'ol') return b.items.join(' ').length
  if (b.kind === 'h') return 0
  return b.text.length
}

function buildSlides(p: Props): Slide[] {
  const slides: Slide[] = []
  slides.push({ type: 'title', heading: p.title, items: p.objectives.slice(0, 4) })

  if (p.description) {
    slides.push({ type: 'content', heading: 'Why this matters', blocks: [{ kind: 'p', text: p.description }] })
  }

  if (p.body) {
    const blocks = parseBlocks(p.body)
    let heading = 'The big picture'
    let current: Block[] = []
    let size = 0
    let part = 0
    const push = () => {
      if (!current.length) return
      slides.push({ type: 'content', heading: part > 0 ? `${heading} (cont.)` : heading, blocks: current })
      current = []
      size = 0
      part++
    }
    for (const b of blocks) {
      if (b.kind === 'h') {
        push()
        heading = b.text
        part = 0
        continue
      }
      const len = blockLength(b)
      if (current.length && size + len > 560) push()
      current.push(b)
      size += len
    }
    push()
  }

  if (p.practiceTask) slides.push({ type: 'exercise', heading: 'Try it yourself', text: p.practiceTask })
  if (p.keyPoints.length) slides.push({ type: 'takeaways', heading: 'Key takeaways', items: p.keyPoints })
  return slides
}

function sentences(text: string): string[] {
  const out: string[] = []
  const add = (raw: string) => {
    const t = raw.trim()
    if (!t) return
    const prev = out[out.length - 1]
    if (prev && prev.length < 20) out[out.length - 1] = prev + ' ' + t
    else out.push(t)
  }
  let cur = ''
  for (let i = 0; i < text.length; i++) {
    cur += text[i]
    if ('.!?'.includes(text[i])) {
      let j = i + 1
      while (j < text.length && '"\u201D\')]'.includes(text[j])) {
        cur += text[j]
        j++
      }
      // A sentence ends only where the punctuation is followed by whitespace or the end (so "Claude.ai" and "e.g." stay whole).
      if (j >= text.length || /\s/.test(text[j])) {
        add(cur)
        cur = ''
      }
      i = j - 1
    }
  }
  add(cur)
  return out.length ? out : [text]
}

function withEnd(t: string): string {
  const x = t.trim()
  return /[.!?:;]["\u201D')\]]*$/.test(x) ? x : x + '.'
}

// One entry per highlightable "line" of a slide, in the exact order the slide renders them.
function slideSegments(s: Slide): string[] {
  const out: string[] = [withEnd(s.heading)]
  if (s.type === 'title') {
    if (s.items.length) {
      out.push('By the end of this lesson you will be able to:')
      s.items.forEach((i) => out.push(withEnd(i)))
    }
  } else if (s.type === 'content') {
    for (const b of s.blocks) {
      if (b.kind === 'p') sentences(b.text).forEach((x) => out.push(withEnd(x)))
      else if (b.kind === 'ul' || b.kind === 'ol') b.items.forEach((i) => out.push(withEnd(i)))
      else if (b.kind === 'code') out.push('A short code example is on screen.')
    }
  } else if (s.type === 'exercise') {
    const parts = splitPrompt(s.text)
    if (!parts) sentences(s.text).forEach((x) => out.push(withEnd(x)))
    else {
      if (parts.before) sentences(parts.before).forEach((x) => out.push(withEnd(x)))
      out.push(withEnd(parts.prompt))
      if (parts.after) sentences(parts.after).forEach((x) => out.push(withEnd(x)))
    }
  } else {
    s.items.forEach((i) => out.push(withEnd(i)))
  }
  return out
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice()
  let s = seed || 1
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildFallbackQuestions(keyPoints: string[], pool: string[], seed: number): CheckpointQuestion[] {
  const picks = keyPoints.slice(0, 3)
  const others = pool.filter((x) => !keyPoints.includes(x))
  return picks
    .map((kp, idx) => {
      const distractors = shuffle(others, seed + idx).slice(0, 2)
      if (distractors.length < 2) return null
      const options = shuffle([kp, ...distractors], seed + idx * 7)
      return {
        scenario: 'Quick check: you are explaining this lesson to a colleague at work.',
        question: 'Which of these is something this lesson actually taught?',
        options,
        answer: options.indexOf(kp),
        explain: 'Right answer: ' + kp,
      } as CheckpointQuestion
    })
    .filter((q): q is CheckpointQuestion => q !== null)
}

function Mascot({ mood }: { mood: 'wave' | 'happy' | 'think' }) {
  return (
    <svg viewBox="0 0 120 130" width="104" height="112" role="img" aria-label="Bara, the Barada Academy guide" className="bb-pop">
      <line x1="60" y1="8" x2="60" y2="24" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="8" r="6" fill={GOLD} className="bb-glow" />
      <rect x="14" y="52" width="10" height="26" rx="5" fill={GOLD} />
      <rect x="96" y="52" width="10" height="26" rx="5" fill={GOLD} />
      <rect x="22" y="24" width="76" height="66" rx="22" fill={GREEN} stroke={GOLD} strokeWidth="3" />
      <rect x="32" y="36" width="56" height="42" rx="14" fill={DEEP} />
      {mood === 'think' ? (
        <>
          <path d="M42 56 q6 -7 12 0" stroke={GOLD} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M66 56 q6 -7 12 0" stroke={GOLD} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M50 68 h20" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="48" cy="54" rx="6" ry="7" fill={GOLD} className="bb-blink" />
          <ellipse cx="72" cy="54" rx="6" ry="7" fill={GOLD} className="bb-blink" />
          <path d={mood === 'happy' ? 'M46 66 q14 16 28 0' : 'M48 67 q12 10 24 0'} stroke={GOLD} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}
      <rect x="40" y="92" width="40" height="26" rx="10" fill={FOREST} stroke={GOLD} strokeWidth="3" />
      <circle cx="60" cy="105" r="5" fill={GOLD} />
      {mood === 'wave' && <rect x="94" y="40" width="10" height="26" rx="5" fill={GOLD} className="bb-wave" />}
    </svg>
  )
}

function Hl({ on, accent, inline, tag, style, children }: { on: boolean; accent: string; inline?: boolean; tag?: 'div' | 'p' | 'h2'; style?: React.CSSProperties; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (on && ref.current && typeof ref.current.scrollIntoView === 'function') ref.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [on])
  const hl: React.CSSProperties = on
    ? inline
      ? { background: accent + '40', boxShadow: '0 0 0 2px ' + accent + '40', borderRadius: 4 }
      : { background: accent + '2e', boxShadow: 'inset 3px 0 0 ' + accent }
    : {}
  const Tag: any = inline ? 'span' : tag || 'div'
  return (
    <Tag ref={ref} style={{ transition: 'background .25s, box-shadow .25s', ...style, ...hl }}>
      {children}
    </Tag>
  )
}

function Watermark({ kind, color }: { kind: WatermarkKind; color: string }) {
  const common = { position: 'absolute' as const, right: '-4%', bottom: '-6%', width: 'min(58%, 380px)', opacity: 0.1, pointerEvents: 'none' as const, zIndex: 0 }
  if (kind === 'barada')
    return <img src="/logo/barada-symbol-512.png" alt="" aria-hidden="true" style={{ ...common, height: 'auto', opacity: 0.07 }} />
  let shapes: React.ReactNode = null
  if (kind === 'spark')
    shapes = Array.from({ length: 12 }).map((_, i) => (
      <line key={i} x1="100" y1="100" x2="100" y2={i % 2 ? 28 : 8} stroke={color} strokeWidth="13" strokeLinecap="round" transform={'rotate(' + i * 30 + ' 100 100)'} />
    ))
  else if (kind === 'ring')
    shapes = Array.from({ length: 6 }).map((_, i) => (
      <ellipse key={i} cx="100" cy="58" rx="22" ry="44" fill="none" stroke={color} strokeWidth="9" transform={'rotate(' + i * 60 + ' 100 100)'} />
    ))
  else if (kind === 'blocks')
    shapes = [[20, 20], [108, 20], [20, 108], [108, 108]].map(([x, y], i) => <rect key={i} x={x} y={y} width="72" height="72" rx="12" fill={color} />)
  else if (kind === 'dots')
    shapes = [[62, 62], [138, 62], [62, 138], [138, 138]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="34" fill={color} />)
  else if (kind === 'grid')
    shapes = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <rect key={r + '-' + c} x={22 + c * 58} y={22 + r * 58} width="48" height="48" rx="8" fill={color} />))
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" style={common}>
      {shapes}
    </svg>
  )
}

function splitPrompt(text: string): { before: string; prompt: string; after: string } | null {
  const m = text.match(/["“]([^"”]{15,}?)["”]/)
  if (!m || m.index === undefined) return null
  return { before: text.slice(0, m.index).trim(), prompt: m[1].trim(), after: text.slice(m.index + m[0].length).trim() }
}

// "Try it yourself" slide: when the exercise contains a quoted prompt, show it in
// a search-bar style box (Copy + open-in-assistant) instead of a plain text block.
function ExerciseSlide({ text, act, base, accent }: { text: string; act: number; base: number; accent: string }) {
  const [copied, setCopied] = useState(false)
  const parts = splitPrompt(text)
  let k = base
  const spans = (t: string, color: string) =>
    sentences(t).map((x) => (
      <Hl key={k} inline on={act === k++} accent={accent} style={{ color }}>
        {x}{' '}
      </Hl>
    ))
  if (!parts) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid ' + accent + '4d', borderRadius: 14, padding: '1.1rem 1.2rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
        {spans(text, 'inherit')}
      </div>
    )
  }
  const lead = parts.before
  const brand = /claude/i.test(lead) ? 'claude' : /chatgpt|openai/i.test(lead) ? 'chatgpt' : ''
  const openUrl = brand === 'claude' ? 'https://claude.ai/new?q=' + encodeURIComponent(parts.prompt) : brand === 'chatgpt' ? 'https://chatgpt.com/?q=' + encodeURIComponent(parts.prompt) : ''
  const copy = () => {
    try {
      navigator.clipboard.writeText(parts.prompt).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      })
    } catch {
      /* clipboard unavailable: learner can select the text */
    }
  }
  const label = brand === 'claude' ? 'Claude' : brand === 'chatgpt' ? 'ChatGPT' : 'AI assistant'
  const leadSpans = lead ? spans(lead, '#5A5242') : null
  const promptOn = act === k++
  const afterSpans = parts.after ? spans(parts.after, '#5A5242') : null
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid ' + accent + '66', boxShadow: '0 14px 40px rgba(0,0,0,0.4)' }}>
      <ChatChrome label={label + ' \u00b7 try it live'} />
      <div style={{ background: 'linear-gradient(180deg, #F5F1E6 0%, #EFE9DA 100%)', padding: '1.5rem 1.2rem 1.3rem' }}>
        <p style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: 'clamp(1.15rem, 3vw, 1.5rem)', color: '#3B3326', margin: '0 0 1.1rem' }}>
          <span style={{ color: '#D97757' }}>&#10022;</span> How can I help you today?
        </p>
        {lead && <p style={{ lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '0.9rem' }}>{leadSpans}</p>}
        <div style={{ background: '#FFFFFF', border: '1.5px solid ' + (promptOn ? accent : '#E5DFD3'), borderRadius: 24, boxShadow: promptOn ? '0 0 0 5px ' + accent + '66, 0 10px 30px rgba(0,0,0,0.16)' : '0 10px 30px rgba(0,0,0,0.14)', transition: 'box-shadow .25s, border-color .25s', padding: '1.1rem 1.2rem 0.9rem', color: '#29261B' }}>
          <p style={{ margin: 0, fontSize: '1.12rem', lineHeight: 1.6, fontWeight: 500 }}>{parts.prompt}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #D9D2C3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6558', fontSize: '1.15rem' }}>+</span>
            <button type="button" onClick={copy} style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #D9D2C3', borderRadius: 10, padding: '0.45rem 0.9rem', fontSize: '0.8rem', fontWeight: 700, color: '#29261B', cursor: 'pointer', fontFamily: 'inherit' }}>
              {copied ? 'Copied \u2713' : 'Copy prompt'}
            </button>
            {openUrl && (
              <a href={openUrl} target="_blank" rel="noopener noreferrer" aria-label={'Open this prompt in ' + label} title={'Open in ' + label} style={{ width: 36, height: 36, borderRadius: 10, background: brand === 'claude' ? '#D97757' : '#10A37F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 800, fontSize: '1.1rem' }}>
                &uarr;
              </a>
            )}
          </div>
        </div>
        {afterSpans && <p style={{ lineHeight: 1.65, fontSize: '0.95rem', marginTop: '0.9rem' }}>{afterSpans}</p>}
      </div>
    </div>
  )
}

function ChatChrome({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 0.9rem', background: 'rgba(0,0,0,0.4)' }}>
      {['#FF6B6B', '#F5C451', '#3DDC97'].map((c) => (
        <span key={c} aria-hidden="true" style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.85 }} />
      ))}
      <span style={{ marginLeft: 8, fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em' }}>{label}</span>
    </div>
  )
}

function Avatar({ accent }: { accent: string }) {
  return (
    <span aria-hidden="true" style={{ width: 34, height: 34, borderRadius: '50%', background: accent, color: '#1b1b1b', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>
      &#10022;
    </span>
  )
}

// AI-chat styled frame for "Example" slides.
function ExampleFrame({ show, accent, children }: { show: boolean; accent: string; children: React.ReactNode }) {
  if (!show) return <>{children}</>
  return (
    <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid ' + accent + '55', background: 'rgba(0,0,0,0.28)', boxShadow: '0 12px 34px rgba(0,0,0,0.35)' }}>
      <ChatChrome label="Example conversation" />
      <div style={{ display: 'flex', gap: '0.8rem', padding: '1.1rem 1rem 0.4rem' }}>
        <Avatar accent={accent} />
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      </div>
    </div>
  )
}

// One chat message bubble (assistant on the left, learner on the right).
function Bubble({ me, accent, dark, children }: { me?: boolean; accent: string; dark: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '0.7rem', margin: '0 0 0.8rem', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      {!me && <Avatar accent={accent} />}
      <div style={{ maxWidth: '86%', background: me ? accent : 'rgba(255,255,255,0.08)', color: me ? dark : '#fff', borderRadius: me ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '0.75rem 1rem', lineHeight: 1.6, fontSize: '0.95rem', fontWeight: me ? 700 : 400 }}>{children}</div>
    </div>
  )
}

export default function LessonPlayer(props: Props) {
  const slides = useMemo(() => buildSlides(props), [props])
  const theme = useMemo(() => courseTheme(props.courseSlug || '', props.courseTitle || '', props.themeColor), [props.courseSlug, props.courseTitle, props.themeColor])
  const GOLD = theme.accent
  const GREEN = theme.mid
  const FOREST = theme.dark
  const segData = useMemo(
    () =>
      slides.map((sl) => {
        const segs = slideSegments(sl)
        const starts: number[] = []
        let pos = 0
        segs.forEach((x) => {
          starts.push(pos)
          pos += x.length + 1
        })
        return { text: segs.join(' '), starts }
      }),
    [slides]
  )
  const total = slides.length
  const seed = useMemo(() => props.lessonKey.split('').reduce((a, c) => a + c.charCodeAt(0), 7), [props.lessonKey])
  const questions = useMemo<CheckpointQuestion[]>(() => {
    if (props.checkpoint && props.checkpoint.length) return props.checkpoint
    return buildFallbackQuestions(props.keyPoints, props.distractorPool, seed)
  }, [props.checkpoint, props.keyPoints, props.distractorPool, seed])

  const storageKey = 'barada-cp-' + props.lessonKey
  const [index, setIndex] = useState(0) // 0..total-1 slides, total = checkpoint
  const [showTranscript, setShowTranscript] = useState(false)
  const [narrating, setNarrating] = useState(false)
  const [activeSeg, setActiveSeg] = useState(-1)
  const [needTap, setNeedTap] = useState(false)
  const autoStarted = useRef(false)
  const [passed, setPassed] = useState(false)
  const [qIndex, setQIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const [isFull, setIsFull] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const narratingRef = useRef(false)
  const tts = useTextToSpeech()

  useEffect(() => {
    try {
      if (window.localStorage.getItem(storageKey) === '1') setPassed(true)
    } catch {
      /* storage unavailable: fine */
    }
  }, [storageKey])

  useEffect(() => {
    const onFs = () => setIsFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const atCheckpoint = index >= total
  const pct = questions.length ? Math.round((correct / questions.length) * 100) : 100

  const go = useCallback(
    (n: number) => {
      const next = Math.max(0, Math.min(total, n))
      setIndex(next)
    },
    [total]
  )

  const AUTO_KEY = 'barada-tts-auto'
  const setAutoPref = (on: boolean) => {
    try {
      window.localStorage.setItem(AUTO_KEY, on ? 'on' : 'off')
    } catch {
      /* storage unavailable: fine */
    }
  }

  const narrateFrom = useCallback(
    (n: number) => {
      if (n >= total) {
        narratingRef.current = false
        setNarrating(false)
        setActiveSeg(-1)
        setIndex(total)
        return
      }
      setIndex(n)
      setActiveSeg(0)
      const d = segData[n]
      tts.speak(
        d.text,
        () => {
          if (narratingRef.current) narrateFrom(n + 1)
        },
        {
          onProgress: (ci) => {
            let a = 0
            for (let i = 0; i < d.starts.length; i++) {
              if (d.starts[i] <= ci) a = i
              else break
            }
            setActiveSeg(a)
          },
          onBlocked: () => {
            narratingRef.current = false
            setNarrating(false)
            setNeedTap(true)
          },
        }
      )
    },
    [segData, total, tts]
  )

  const toggleNarration = () => {
    if (narrating) {
      narratingRef.current = false
      setNarrating(false)
      setActiveSeg(-1)
      tts.stop()
      setAutoPref(false)
    } else {
      setNeedTap(false)
      setAutoPref(true)
      narratingRef.current = true
      setNarrating(true)
      narrateFrom(atCheckpoint ? 0 : index)
    }
  }

  const manualGo = (n: number) => {
    const t = Math.max(0, Math.min(total, n))
    if (narratingRef.current && t < total) {
      go(t)
      narrateFrom(t)
      return
    }
    if (narratingRef.current) {
      narratingRef.current = false
      setNarrating(false)
      setActiveSeg(-1)
      tts.stop()
    }
    go(t)
  }

  // Narration starts by itself when the lesson opens (unless the learner turned it off).
  // Browsers may block speech until the page has had a click or key press; if so, the first
  // tap or key press anywhere starts it.
  useEffect(() => {
    if (!tts.supported || autoStarted.current) return
    let pref: string | null = null
    try {
      pref = window.localStorage.getItem(AUTO_KEY)
    } catch {
      /* storage unavailable: default on */
    }
    if (pref === 'off') return
    const t = setTimeout(() => {
      autoStarted.current = true
      narratingRef.current = true
      setNarrating(true)
      narrateFrom(0)
    }, tts.voices.length > 0 ? 300 : 1500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tts.supported, tts.voices.length])

  useEffect(() => {
    if (!needTap) return
    const start = () => {
      setNeedTap(false)
      narratingRef.current = true
      setNarrating(true)
      narrateFrom(index >= total ? 0 : index)
    }
    window.addEventListener('pointerdown', start, { once: true })
    window.addEventListener('keydown', start, { once: true })
    return () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needTap])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight') manualGo(index + 1)
      if (e.key === 'ArrowLeft') manualGo(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total])

  useEffect(() => () => tts.stop(), []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleFull = () => {
    const el = stageRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen()
    else if (el.requestFullscreen) el.requestFullscreen()
  }

  const answer = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    if (i === questions[qIndex].answer) setCorrect((c) => c + 1)
  }

  const nextQuestion = () => {
    if (qIndex + 1 < questions.length) {
      setQIndex(qIndex + 1)
      setPicked(null)
    } else {
      const score = Math.round(((correct) / questions.length) * 100)
      setFinished(true)
      if (score >= PASS_PCT) {
        setPassed(true)
        try {
          window.localStorage.setItem(storageKey, '1')
        } catch {
          /* ignore */
        }
      }
    }
  }

  const retry = () => {
    setQIndex(0)
    setPicked(null)
    setCorrect(0)
    setFinished(false)
  }

  const slide = !atCheckpoint ? slides[index] : null
  const act = narrating ? activeSeg : -1
  const cta = props.nextHref ? (
    <Link href={props.nextHref} className="bb-cta">
      Next lesson: {props.nextLabel} &rarr;
    </Link>
  ) : (
    <Link href={props.evaluationHref} className="bb-cta">
      Course complete &mdash; take the evaluation &rarr;
    </Link>
  )

  const card: React.CSSProperties = {
    position: 'relative',
    background: 'radial-gradient(circle at 88% 0%, ' + GOLD + '26 0%, transparent 55%), linear-gradient(145deg, ' + theme.mid + ' 0%, ' + theme.dark + ' 100%)',
    border: '1px solid ' + GOLD + '40',
    borderRadius: 18,
    boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
    overflow: 'hidden',
  }

  return (
    <div>
      <style>{`
        .bb-pop{animation:bbpop .5s cubic-bezier(.2,1.4,.4,1) both}
        @keyframes bbpop{0%{transform:translateY(40px) scale(.6);opacity:0}100%{transform:none;opacity:1}}
        .bb-blink{animation:bbblink 4s infinite;transform-origin:center;transform-box:fill-box}
        @keyframes bbblink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
        .bb-glow{animation:bbglow 1.6s ease-in-out infinite}
        @keyframes bbglow{0%,100%{opacity:1}50%{opacity:.4}}
        .bb-wave{animation:bbwave 1s ease-in-out infinite;transform-origin:50% 90%;transform-box:fill-box}
        @keyframes bbwave{0%,100%{transform:rotate(0)}50%{transform:rotate(-25deg)}}
        .bb-slide{animation:bbslide .35s ease both}
        @keyframes bbslide{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}
        .bb-btn{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:.55rem .95rem;font-size:.82rem;font-weight:700;cursor:pointer;font-family:inherit}
        .bb-btn:hover{background:${GOLD}40}
        .bb-btn:disabled{opacity:.35;cursor:default}
        .bb-btn.gold{background:${GOLD};color:${FOREST};border-color:${GOLD}}
        .bb-cta{display:inline-block;background:${GOLD};color:${FOREST};font-weight:800;font-size:.95rem;border-radius:12px;padding:.8rem 1.4rem;text-decoration:none}
        .bb-opt{display:block;width:100%;text-align:left;background:rgba(255,255,255,.06);color:#fff;border:1.5px solid rgba(255,255,255,.14);border-radius:12px;padding:.8rem 1rem;font-size:.92rem;line-height:1.5;cursor:pointer;font-family:inherit;margin-bottom:.6rem}
        .bb-opt:hover:enabled{border-color:${GOLD}}
        .bb-stage:fullscreen{background:${theme.page};display:flex;flex-direction:column;justify-content:center;padding:2rem}
        .bb-stage:fullscreen .bb-body{font-size:1.25rem}
        .bb-chip{display:none}
        @media(min-width:760px){.bb-chip{display:inline-flex}}
      `}</style>

      <div ref={stageRef} className="bb-stage">
        <div style={card}>
          <Watermark kind={theme.mark} color={GOLD} />
          <div style={{ position: 'relative', zIndex: 1, height: 5, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ height: '100%', width: `${Math.round((Math.min(index, total) / total) * 100)}%`, background: GOLD, transition: 'width .3s' }} />
          </div>

          <div className="bb-body" style={{ position: 'relative', zIndex: 1, padding: 'clamp(1.25rem, 3vw, 2.25rem)', minHeight: 360 }}>
            {props.courseTitle && (
              <span className="bb-chip" style={{ position: 'absolute', top: 14, right: 18, alignItems: 'center', gap: 6, fontSize: '0.7rem', fontWeight: 700, color: GOLD, background: 'rgba(0,0,0,0.25)', border: '1px solid ' + GOLD + '40', borderRadius: 999, padding: '0.25rem 0.7rem' }}>
                {props.courseIcon ? <span aria-hidden="true">{props.courseIcon}</span> : null}
                {props.courseTitle}
              </span>
            )}
            {needTap && (
              <button type="button" onClick={() => { /* window listener starts narration */ }} style={{ display: 'block', margin: '0 0 0.9rem', background: GOLD, color: FOREST, border: 'none', borderRadius: 999, padding: '0.5rem 1rem', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                🔊 Tap anywhere to start narration
              </button>
            )}
            {slide && (
              <div key={index} className="bb-slide">
                <p style={{ color: GOLD, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  {slide.type === 'title' ? `Module ${props.moduleNumber} · Lesson ${props.lessonNumber}` : `Slide ${index + 1} of ${total}`}
                </p>
                {(() => {
                  let k = 1
                  const on = (i: number) => act === i
                  return (
                    <>
                      <Hl tag="h2" on={on(0)} accent={GOLD} style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#fff', fontSize: slide.type === 'title' ? 'clamp(1.6rem, 4vw, 2.4rem)' : 'clamp(1.25rem, 3vw, 1.8rem)', lineHeight: 1.25, marginBottom: '1.1rem', borderRadius: 8 }}>
                        {slide.heading}
                      </Hl>

                      {slide.type === 'title' && slide.items.length > 0 && (
                        <div>
                          <Hl tag="p" on={on(k++)} accent={GOLD} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '0.6rem' }}>By the end you will be able to:</Hl>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                            {slide.items.map((o, i) => (
                              <Hl key={i} on={on(k++)} accent={GOLD} style={{ display: 'flex', gap: '0.7rem', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '0.7rem 0.9rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, fontSize: '0.95rem' }}>
                                <span style={{ color: GOLD, fontWeight: 800 }}>&#10003;</span>
                                {o}
                              </Hl>
                            ))}
                          </div>
                        </div>
                      )}

                      {slide.type === 'content' && (
                        <ExampleFrame show={/example/i.test(slide.heading)} accent={GOLD}>
                          {slide.blocks.map((b, i) => {
                            if (b.kind === 'p')
                              return (
                                <p key={i} style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, fontSize: '1.02rem', marginBottom: '0.9rem' }}>
                                  {sentences(b.text).map((x) => (
                                    <Hl key={k} inline on={on(k++)} accent={GOLD}>
                                      {x}{' '}
                                    </Hl>
                                  ))}
                                </p>
                              )
                            if (b.kind === 'ul' || b.kind === 'ol')
                              return (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '0.9rem' }}>
                                  {b.items.map((it, j) => (
                                    <Hl key={j} on={on(k++)} accent={GOLD} style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '0.7rem 0.9rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.55, fontSize: '0.97rem' }}>
                                      <span style={{ background: GOLD, color: FOREST, borderRadius: '50%', width: 22, height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                                        {j + 1}
                                      </span>
                                      {it}
                                    </Hl>
                                  ))}
                                </div>
                              )
                            if (b.kind === 'code')
                              return (
                                <Hl key={i} on={on(k++)} accent={GOLD} style={{ borderRadius: 12, marginBottom: '0.9rem' }}>
                                  <pre style={{ background: '#04201A', color: '#E8F5EE', borderRadius: 12, padding: '1rem', overflowX: 'auto', fontSize: '0.82rem', lineHeight: 1.6, border: '1px solid ' + GOLD + '33', margin: 0 }}>
                                    <code>{b.text}</code>
                                  </pre>
                                </Hl>
                              )
                            return null
                          })}
                        </ExampleFrame>
                      )}

                      {slide.type === 'exercise' && <ExerciseSlide text={slide.text} act={act} base={1} accent={GOLD} />}

                      {slide.type === 'takeaways' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                          {slide.items.map((it, i) => (
                            <Hl key={i} on={on(k++)} accent={GOLD} style={{ display: 'flex', gap: '0.7rem', background: GOLD + '14', borderRadius: 12, padding: '0.7rem 0.9rem', color: '#fff', lineHeight: 1.55, fontSize: '0.97rem' }}>
                              <span style={{ color: GOLD, fontWeight: 800 }}>&#9733;</span>
                              {it}
                            </Hl>
                          ))}
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}

            {atCheckpoint && (
              <div className="bb-slide">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <Mascot mood={finished ? (pct >= PASS_PCT ? 'happy' : 'think') : picked === null && qIndex === 0 ? 'wave' : 'happy'} />
                  <div style={{ flex: 1, minWidth: 220, background: '#fff', color: FOREST, borderRadius: '16px 16px 16px 4px', padding: '0.9rem 1.1rem', fontSize: '0.95rem', lineHeight: 1.55, fontWeight: 600 }}>
                    {!finished && qIndex === 0 && picked === null && <>Namaste! I&rsquo;m Bara. Let&rsquo;s try this on real workplace situations. Score at least {PASS_PCT}% to unlock the next lesson.</>}
                    {!finished && picked !== null && (picked === questions[qIndex].answer ? <>Excellent! That&rsquo;s exactly right.</> : <>Good try! Here&rsquo;s the thinking behind it.</>)}
                    {!finished && picked === null && qIndex > 0 && <>Next situation. Take your time.</>}
                    {finished && pct >= PASS_PCT && <>Shabash! You scored {pct}%. Excellent work &mdash; you&rsquo;re ready for the next lesson.</>}
                    {finished && pct < PASS_PCT && <>You scored {pct}%. Almost there! Skim the slides again and have another go &mdash; unlimited tries.</>}
                  </div>
                </div>

                {questions.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <p style={{ color: '#fff', marginBottom: '1rem' }}>Great work finishing this lesson!</p>
                    {cta}
                  </div>
                )}

                {questions.length > 0 && !finished && (
                  <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid ' + GOLD + '55', background: 'rgba(0,0,0,0.28)', boxShadow: '0 12px 34px rgba(0,0,0,0.35)' }}>
                    <ChatChrome label={'Chat with Bara \u00b7 Scenario ' + (qIndex + 1) + ' of ' + questions.length} />
                    <div style={{ padding: '1.1rem 1rem 0.6rem' }}>
                      {questions[qIndex].scenario && (
                        <Bubble accent={GOLD} dark={FOREST}>
                          <span style={{ display: 'block', color: GOLD, fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Situation</span>
                          {questions[qIndex].scenario}
                        </Bubble>
                      )}
                      <Bubble accent={GOLD} dark={FOREST}>
                        <strong>{questions[qIndex].question}</strong>
                      </Bubble>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0.2rem 0 0.5rem' }}>Choose your reply</p>
                      {questions[qIndex].options.map((o, i) => {
                        const isAns = i === questions[qIndex].answer
                        const show = picked !== null
                        const border = show ? (isAns ? '#3DDC97' : i === picked ? '#FF6B6B' : 'rgba(255,255,255,0.14)') : undefined
                        return (
                          <button key={i} type="button" className="bb-opt" disabled={show} onClick={() => answer(i)} style={{ borderColor: border, background: show && isAns ? 'rgba(61,220,151,0.12)' : undefined }}>
                            <strong style={{ color: GOLD, marginRight: 8 }}>{String.fromCharCode(65 + i)}</strong>
                            {o}
                          </button>
                        )
                      })}
                      {picked !== null && (
                        <div style={{ marginTop: '0.4rem' }}>
                          <Bubble me accent={GOLD} dark={FOREST}>{questions[qIndex].options[picked]}</Bubble>
                          <Bubble accent={GOLD} dark={FOREST}>
                            <strong style={{ color: picked === questions[qIndex].answer ? '#3DDC97' : '#FF9B9B' }}>{picked === questions[qIndex].answer ? 'Correct.' : 'Not quite.'}</strong>{' '}
                            {questions[qIndex].explain}
                          </Bubble>
                          <button type="button" className="bb-btn gold" onClick={nextQuestion} style={{ marginBottom: '0.6rem' }}>
                            {qIndex + 1 < questions.length ? 'Next scenario →' : 'See my score'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {questions.length > 0 && finished && (
                  <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
                    <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.3rem' }}>
                      {correct} / {questions.length} correct ({pct}%)
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1rem' }}>Pass mark: {PASS_PCT}%</p>
                    {pct >= PASS_PCT ? cta : (
                      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button type="button" className="bb-btn gold" onClick={retry}>Try again</button>
                        <button type="button" className="bb-btn" onClick={() => { retry(); manualGo(0) }}>Review slides</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', position: 'relative', zIndex: 1, padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.18)' }}>
            <button type="button" className="bb-btn" onClick={() => manualGo(index - 1)} disabled={index === 0} aria-label="Previous slide">&larr; Back</button>
            <button type="button" className="bb-btn" onClick={() => manualGo(index + 1)} disabled={atCheckpoint} aria-label="Next slide">
              {index === total - 1 ? 'Checkpoint →' : 'Next →'}
            </button>
            {tts.supported && (
              <button type="button" className="bb-btn" onClick={toggleNarration} aria-pressed={narrating}>
                {narrating ? '⏹ Stop narration' : '🔊 Narrate'}
              </button>
            )}
            {tts.supported && tts.voices.length > 1 && (
<select aria-label="Narration voice" title="Narration voice" value={tts.voiceName} onChange={(e) => tts.setVoiceName(e.target.value)} className="bb-btn" style={{ maxWidth: 230 }}>
{tts.voices.map((v) => (
<option key={v.name} value={v.name} style={{ color: '#000' }}>{v.label}</option>
))}
</select>
)}
<button type="button" className="bb-btn" onClick={() => setShowTranscript((v) => !v)} aria-expanded={showTranscript}>
              {showTranscript ? 'Hide transcript' : '📄 Transcript'}
            </button>
            <button type="button" className="bb-btn" onClick={toggleFull} aria-label="Toggle full screen">
              {isFull ? 'Exit full screen' : '⛶ Full screen'}
            </button>
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
              {passed ? 'Checkpoint passed ✓' : atCheckpoint ? 'Checkpoint' : `${index + 1} / ${total}`}
            </span>
          </div>
        </div>
      </div>

      {tts.supported && tts.voiceLabel && (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', margin: '0.5rem 0 0' }}>Narration plays automatically &mdash; press Stop anytime and it stays off. Voice: {tts.voiceLabel}</p>
      )}

      {showTranscript && (
        <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: GOLD, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>Transcript</p>
          {props.description && <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontSize: '0.92rem', marginBottom: '1rem' }}>{props.description}</p>}
          {props.body && <LessonBody text={props.body} />}
          {props.practiceTask && (
            <>
              <p style={{ color: GOLD, fontWeight: 700, fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>Exercise</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontSize: '0.92rem', whiteSpace: 'pre-wrap' }}>{props.practiceTask}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

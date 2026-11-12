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

function slideSpeech(s: Slide): string {
  if (s.type === 'title') {
    return `${s.heading}. ${s.items.length ? 'By the end of this lesson you will be able to: ' + s.items.join('. ') : ''}`
  }
  if (s.type === 'exercise') return `${s.heading}. ${s.text}`
  if (s.type === 'takeaways') return `${s.heading}. ${s.items.join('. ')}`
  const parts = s.blocks.map((b) => {
    if (b.kind === 'code') return 'A short code example is on screen.'
    if (b.kind === 'ul' || b.kind === 'ol') return b.items.join('. ')
    if (b.kind === 'h') return ''
    return b.text
  })
  return `${s.heading}. ${parts.join(' ')}`
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

export default function LessonPlayer(props: Props) {
  const slides = useMemo(() => buildSlides(props), [props])
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

  const narrateFrom = useCallback(
    (n: number) => {
      if (n >= total) {
        narratingRef.current = false
        setNarrating(false)
        setIndex(total)
        return
      }
      setIndex(n)
      tts.speak(slideSpeech(slides[n]), () => {
        if (narratingRef.current) narrateFrom(n + 1)
      })
    },
    [slides, total, tts]
  )

  const toggleNarration = () => {
    if (narrating) {
      narratingRef.current = false
      setNarrating(false)
      tts.stop()
    } else {
      narratingRef.current = true
      setNarrating(true)
      narrateFrom(atCheckpoint ? 0 : index)
    }
  }

  const manualGo = (n: number) => {
    if (narratingRef.current) {
      narratingRef.current = false
      setNarrating(false)
      tts.stop()
    }
    go(n)
  }

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
    background: 'linear-gradient(145deg, #0D4638 0%, #08372C 100%)',
    border: '1px solid rgba(212,175,55,0.25)',
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
        .bb-btn:hover{background:${GREEN}}
        .bb-btn:disabled{opacity:.35;cursor:default}
        .bb-btn.gold{background:${GOLD};color:${FOREST};border-color:${GOLD}}
        .bb-cta{display:inline-block;background:${GOLD};color:${FOREST};font-weight:800;font-size:.95rem;border-radius:12px;padding:.8rem 1.4rem;text-decoration:none}
        .bb-opt{display:block;width:100%;text-align:left;background:rgba(255,255,255,.06);color:#fff;border:1.5px solid rgba(255,255,255,.14);border-radius:12px;padding:.8rem 1rem;font-size:.92rem;line-height:1.5;cursor:pointer;font-family:inherit;margin-bottom:.6rem}
        .bb-opt:hover:enabled{border-color:${GOLD}}
        .bb-stage:fullscreen{background:#072E24;display:flex;flex-direction:column;justify-content:center;padding:2rem}
        .bb-stage:fullscreen .bb-body{font-size:1.25rem}
      `}</style>

      <div ref={stageRef} className="bb-stage">
        <div style={card}>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ height: '100%', width: `${Math.round((Math.min(index, total) / total) * 100)}%`, background: GOLD, transition: 'width .3s' }} />
          </div>

          <div className="bb-body" style={{ padding: 'clamp(1.25rem, 3vw, 2.25rem)', minHeight: 360 }}>
            {slide && (
              <div key={index} className="bb-slide">
                <p style={{ color: GOLD, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  {slide.type === 'title' ? `Module ${props.moduleNumber} · Lesson ${props.lessonNumber}` : `Slide ${index + 1} of ${total}`}
                </p>
                <h2 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 800, color: '#fff', fontSize: slide.type === 'title' ? 'clamp(1.6rem, 4vw, 2.4rem)' : 'clamp(1.25rem, 3vw, 1.8rem)', lineHeight: 1.25, marginBottom: '1.1rem' }}>
                  {slide.heading}
                </h2>

                {slide.type === 'title' && slide.items.length > 0 && (
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', marginBottom: '0.6rem' }}>By the end you will be able to:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {slide.items.map((o, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.7rem', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '0.7rem 0.9rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, fontSize: '0.95rem' }}>
                          <span style={{ color: GOLD, fontWeight: 800 }}>&#10003;</span>
                          {o}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {slide.type === 'content' &&
                  slide.blocks.map((b, i) => {
                    if (b.kind === 'p')
                      return (
                        <p key={i} style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, fontSize: '1.02rem', marginBottom: '0.9rem' }}>
                          {b.text}
                        </p>
                      )
                    if (b.kind === 'ul' || b.kind === 'ol')
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '0.9rem' }}>
                          {b.items.map((it, j) => (
                            <div key={j} style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '0.7rem 0.9rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.55, fontSize: '0.97rem' }}>
                              <span style={{ background: GOLD, color: FOREST, borderRadius: '50%', width: 22, height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                                {j + 1}
                              </span>
                              {it}
                            </div>
                          ))}
                        </div>
                      )
                    if (b.kind === 'code')
                      return (
                        <pre key={i} style={{ background: '#04201A', color: '#E8F5EE', borderRadius: 12, padding: '1rem', overflowX: 'auto', fontSize: '0.82rem', lineHeight: 1.6, border: '1px solid rgba(212,175,55,0.2)', marginBottom: '0.9rem' }}>
                          <code>{b.text}</code>
                        </pre>
                      )
                    return null
                  })}

                {slide.type === 'exercise' && (
                  <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 14, padding: '1.1rem 1.2rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                    {slide.text}
                  </div>
                )}

                {slide.type === 'takeaways' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {slide.items.map((it, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.7rem', background: 'rgba(212,175,55,0.08)', borderRadius: 12, padding: '0.7rem 0.9rem', color: '#fff', lineHeight: 1.55, fontSize: '0.97rem' }}>
                        <span style={{ color: GOLD, fontWeight: 800 }}>&#9733;</span>
                        {it}
                      </div>
                    ))}
                  </div>
                )}
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
                  <div>
                    <p style={{ color: GOLD, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Scenario {qIndex + 1} of {questions.length}
                    </p>
                    {questions[qIndex].scenario && (
                      <p style={{ color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.05)', borderLeft: `3px solid ${GOLD}`, borderRadius: 8, padding: '0.7rem 0.9rem', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '0.8rem' }}>
                        {questions[qIndex].scenario}
                      </p>
                    )}
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.02rem', lineHeight: 1.5, marginBottom: '0.8rem' }}>{questions[qIndex].question}</p>
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
                      <div>
                        {questions[qIndex].explain && (
                          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, fontSize: '0.9rem', margin: '0.4rem 0 0.9rem' }}>{questions[qIndex].explain}</p>
                        )}
                        <button type="button" className="bb-btn gold" onClick={nextQuestion}>
                          {qIndex + 1 < questions.length ? 'Next scenario →' : 'See my score'}
                        </button>
                      </div>
                    )}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.18)' }}>
            <button type="button" className="bb-btn" onClick={() => manualGo(index - 1)} disabled={index === 0} aria-label="Previous slide">&larr; Back</button>
            <button type="button" className="bb-btn" onClick={() => manualGo(index + 1)} disabled={atCheckpoint} aria-label="Next slide">
              {index === total - 1 ? 'Checkpoint →' : 'Next →'}
            </button>
            {tts.supported && (
              <button type="button" className="bb-btn" onClick={toggleNarration} aria-pressed={narrating}>
                {narrating ? '⏹ Stop narration' : '🔊 Narrate'}
              </button>
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
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', margin: '0.5rem 0 0' }}>Voice: {tts.voiceLabel}</p>
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

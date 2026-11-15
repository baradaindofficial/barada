'use client'

/**
 * components/academy/SubjectVisual.tsx
 * Barada Academy -- subject visuals (2026-11-15).
 *
 * A small illustrative "screen" shown on lesson slides so the learner can see WHERE
 * the idea lives: a prompt bar for prompting lessons, a profile page for LinkedIn,
 * a worksheet for Excel, slides for PowerPoint, a resume page, a Copilot pane.
 * Everything is drawn in CSS (no images, no vendor logos) and the part that the slide
 * is talking about is highlighted.
 */
import React from 'react'

export type VisualKind = 'linkedin' | 'excel' | 'ppt' | 'resume' | 'prompt' | 'copilot'

const has = (t: string, re: RegExp) => re.test(t)

export function pickVisual(courseSlug: string, courseTitle: string, text: string): { kind: VisualKind; focus: string } | null {
  const c = (courseSlug + ' ' + courseTitle).toLowerCase()
  const t = text.toLowerCase()
  if (/linkedin/.test(c)) {
    const focus = has(t, /headline/) ? 'headline' : has(t, /\babout\b|summary|story/) ? 'about' : has(t, /experience|achievement|career|job/) ? 'experience' : has(t, /skill|endorse|recommend/) ? 'skills' : has(t, /post|content|article|newsletter|engage/) ? 'post' : has(t, /connect|network|recruiter/) ? 'network' : 'profile'
    return { kind: 'linkedin', focus }
  }
  if (/excel|spreadsheet/.test(c)) {
    const focus = has(t, /pivot/) ? 'pivot' : has(t, /chart|dashboard|visual|kpi/) ? 'chart' : has(t, /clean|dedup|duplicate|missing|power query/) ? 'clean' : has(t, /macro|vba/) ? 'macro' : 'formula'
    return { kind: 'excel', focus }
  }
  if (/powerpoint|presentation|slides/.test(c)) {
    const focus = has(t, /chart|data|graph|number/) ? 'chart' : has(t, /design|layout|visual|template|brand/) ? 'design' : has(t, /speaker|notes|rehears|deliver/) ? 'notes' : 'outline'
    return { kind: 'ppt', focus }
  }
  if (/resume|cv\b/.test(c)) {
    const focus = has(t, /summary|profile|objective/) ? 'summary' : has(t, /skill|keyword|ats/) ? 'skills' : has(t, /bullet|achievement|impact|metric|quantif/) ? 'bullets' : 'layout'
    return { kind: 'resume', focus }
  }
  if (/copilot|microsoft/.test(c)) return { kind: 'copilot', focus: has(t, /agent|automat|flow/) ? 'agent' : has(t, /secur|govern|permission|data/) ? 'govern' : 'ask' }
  if (has(t, /prompt|context|role\b|persona|format|instruction|example|constraint|few-shot|chain/)) {
    const focus = has(t, /role|persona/) ? 'role' : has(t, /context|background/) ? 'context' : has(t, /format|table|bullet|length/) ? 'format' : has(t, /example|few-shot/) ? 'example' : 'task'
    return { kind: 'prompt', focus }
  }
  return null
}

function Frame({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid ' + accent + '55', background: 'rgba(0,0,0,0.3)', margin: '0 0 1rem', boxShadow: '0 10px 28px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.4rem 0.8rem', background: 'rgba(0,0,0,0.4)' }}>
        {['#FF6B6B', '#F5C451', '#3DDC97'].map((c) => (
          <span key={c} aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.85 }} />
        ))}
        <span style={{ marginLeft: 8, fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.04em' }}>{label}</span>
      </div>
      <div style={{ padding: '0.8rem' }}>{children}</div>
    </div>
  )
}

function Tag({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <span style={{ position: 'absolute', top: -9, right: 8, background: accent, color: '#1b1b1b', fontSize: '0.62rem', fontWeight: 800, borderRadius: 999, padding: '0.1rem 0.5rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{children}</span>
  )
}

function Zone({ on, accent, tag, style, children }: { on: boolean; accent: string; tag: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', borderRadius: 8, outline: on ? '2px solid ' + accent : '2px solid transparent', outlineOffset: 2, background: on ? accent + '1f' : 'transparent', transition: 'all .25s', ...style }}>
      {on && <Tag accent={accent}>{tag}</Tag>}
      {children}
    </div>
  )
}

const line = (w: string, c = 'rgba(0,0,0,0.14)', h = 7): React.CSSProperties => ({ height: h, width: w, background: c, borderRadius: 4, marginTop: 6 })

function LinkedIn({ focus, accent }: { focus: string; accent: string }) {
  return (
    <Frame label="LinkedIn · your profile page" accent={accent}>
      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', color: '#1d2226' }}>
        <div style={{ height: 46, background: 'linear-gradient(90deg,#9db8d6,#c9d8e8)' }} />
        <div style={{ padding: '0 0.9rem 0.8rem', marginTop: -20 }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#b8c4d0', border: '3px solid #fff' }} />
          <div style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: 4 }}>Your Name</div>
          <Zone on={focus === 'headline'} accent={accent} tag="HEADLINE" style={{ padding: '2px 4px', margin: '2px -4px' }}>
            <div style={{ fontSize: '0.78rem', color: '#444' }}>Procurement Leader | Strategic Sourcing &bull; Cost Savings &bull; Digital P2P</div>
          </Zone>
          <Zone on={focus === 'network'} accent={accent} tag="NETWORK" style={{ padding: '2px 4px', margin: '2px -4px' }}>
            <div style={{ fontSize: '0.72rem', color: '#0a66c2' }}>Bengaluru &middot; 500+ connections</div>
          </Zone>
          <Zone on={focus === 'about'} accent={accent} tag="ABOUT" style={{ padding: '6px 6px', margin: '8px -6px 0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>About</div>
            <div style={line('96%')} /><div style={line('90%')} /><div style={line('62%')} />
          </Zone>
          <Zone on={focus === 'experience'} accent={accent} tag="EXPERIENCE" style={{ padding: '6px 6px', margin: '8px -6px 0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>Experience</div>
            <div style={{ fontSize: '0.72rem', color: '#444', marginTop: 4 }}>Cut supplier spend 14% across 3 categories</div>
            <div style={line('70%')} />
          </Zone>
          <Zone on={focus === 'skills'} accent={accent} tag="SKILLS" style={{ padding: '6px 6px', margin: '8px -6px 0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>Skills</div>
            <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap' }}>
              {['Sourcing', 'SAP Ariba', 'Negotiation', 'Analytics'].map((s) => (
                <span key={s} style={{ fontSize: '0.66rem', border: '1px solid #bbb', borderRadius: 999, padding: '1px 8px' }}>{s}</span>
              ))}
            </div>
          </Zone>
          <Zone on={focus === 'post'} accent={accent} tag="POST" style={{ padding: '6px 6px', margin: '8px -6px 0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>Start a post</div>
            <div style={{ ...line('100%', 'transparent', 22), border: '1px solid #ccc', borderRadius: 999 }} />
          </Zone>
        </div>
      </div>
    </Frame>
  )
}

function Excel({ focus, accent }: { focus: string; accent: string }) {
  const f: Record<string, string> = { formula: '=SUMIFS(C:C, A:A, "North", B:B, "Q1")', pivot: 'PivotTable fields: Region → Rows, Sales → Values', chart: 'Insert → Chart → Clustered column', clean: '=TRIM(PROPER(A2))', macro: 'Alt + F11 → Visual Basic editor' }
  const cols = ['A', 'B', 'C', 'D']
  const rows = [['Region', 'Qtr', 'Sales', 'Cost'], ['North', 'Q1', '4,200', '3,100'], ['South', 'Q1', '3,800', '2,900'], ['North', 'Q2', '5,100', '3,600'], ['East', 'Q1', '2,700', '2,000']]
  return (
    <Frame label="Excel · worksheet" accent={accent}>
      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', color: '#1d2226', fontSize: '0.74rem' }}>
        <Zone on accent={accent} tag={focus.toUpperCase()} style={{ borderRadius: 0, padding: '5px 8px', background: '#f3f6f4', borderBottom: '1px solid #d7ddd9', outlineOffset: -2 }}>
          <span style={{ color: '#1d6f42', fontWeight: 800, marginRight: 8 }}>fx</span>
          <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{f[focus] || f.formula}</span>
        </Zone>
        {focus === 'chart' ? (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 96, padding: '10px 18px', background: '#fff' }}>
            {[60, 85, 45, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, height: h + '%', background: i === 1 ? accent : '#1d6f42', borderRadius: '3px 3px 0 0' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '28px repeat(4, 1fr)' }}>
            <div style={{ background: '#eef1ef' }} />
            {cols.map((c) => (
              <div key={c} style={{ background: '#eef1ef', textAlign: 'center', fontWeight: 700, padding: '2px 0', borderLeft: '1px solid #d7ddd9' }}>{c}</div>
            ))}
            {rows.map((r, ri) => (
              <React.Fragment key={ri}>
                <div style={{ background: '#eef1ef', textAlign: 'center', borderTop: '1px solid #d7ddd9', padding: '2px 0' }}>{ri + 1}</div>
                {r.map((v, ci) => (
                  <div key={ci} style={{ borderTop: '1px solid #e3e7e4', borderLeft: '1px solid #e3e7e4', padding: '2px 6px', fontWeight: ri === 0 ? 700 : 400, background: ri > 0 && ci === 2 && focus !== 'clean' ? accent + '33' : undefined }}>{v}</div>
                ))}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </Frame>
  )
}

function Ppt({ focus, accent }: { focus: string; accent: string }) {
  return (
    <Frame label="PowerPoint · slide editor" accent={accent}>
      <div style={{ display: 'grid', gridTemplateColumns: '54px 1fr', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: 32, background: '#fff', borderRadius: 4, outline: i === 0 ? '2px solid ' + accent : 'none', padding: 4 }}><div style={line('70%', '#bbb', 4)} /><div style={line('50%', '#ddd', 3)} /></div>
          ))}
        </div>
        <div>
          <Zone on={focus === 'outline' || focus === 'design'} accent={accent} tag={focus === 'design' ? 'DESIGN' : 'OUTLINE'} style={{ background: '#fff', padding: '0.8rem', color: '#1d2226' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Q3 supplier performance</div>
            <div style={{ fontSize: '0.74rem', color: '#555', marginTop: 4 }}>&bull; On-time delivery up 6 pts<br />&bull; Savings: 2.4 Cr vs target 2.0 Cr</div>
            {focus === 'chart' && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 40, marginTop: 8 }}>
                {[40, 65, 50, 90].map((h, i) => <div key={i} style={{ flex: 1, height: h + '%', background: accent, borderRadius: 2 }} />)}
              </div>
            )}
          </Zone>
          <Zone on={focus === 'notes'} accent={accent} tag="SPEAKER NOTES" style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)', fontSize: '0.7rem' }}>
            Click to add notes &mdash; open with the result, then the ask.
          </Zone>
        </div>
      </div>
    </Frame>
  )
}

function Resume({ focus, accent }: { focus: string; accent: string }) {
  return (
    <Frame label="Resume · one-page view" accent={accent}>
      <div style={{ background: '#fff', borderRadius: 6, padding: '0.8rem 1rem', color: '#1d2226', maxWidth: 420, margin: '0 auto' }}>
        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Your Name</div>
        <div style={{ fontSize: '0.68rem', color: '#555' }}>Bengaluru &middot; you@email.com</div>
        <Zone on={focus === 'summary'} accent={accent} tag="SUMMARY" style={{ padding: '4px 6px', margin: '6px -6px 0' }}>
          <div style={{ fontWeight: 700, fontSize: '0.72rem' }}>Summary</div><div style={line('95%')} /><div style={line('78%')} />
        </Zone>
        <Zone on={focus === 'bullets'} accent={accent} tag="IMPACT BULLETS" style={{ padding: '4px 6px', margin: '6px -6px 0' }}>
          <div style={{ fontWeight: 700, fontSize: '0.72rem' }}>Experience</div>
          <div style={{ fontSize: '0.68rem', color: '#333', marginTop: 3 }}>&bull; Reduced cycle time 32% by automating approvals</div>
          <div style={{ fontSize: '0.68rem', color: '#333' }}>&bull; Negotiated 11% savings on a 5 Cr contract</div>
        </Zone>
        <Zone on={focus === 'skills' || focus === 'layout'} accent={accent} tag={focus === 'layout' ? 'LAYOUT' : 'ATS KEYWORDS'} style={{ padding: '4px 6px', margin: '6px -6px 0' }}>
          <div style={{ fontWeight: 700, fontSize: '0.72rem' }}>Skills</div>
          <div style={{ fontSize: '0.68rem', color: '#333' }}>Sourcing &middot; SAP Ariba &middot; Negotiation &middot; Analytics</div>
        </Zone>
      </div>
    </Frame>
  )
}

function Prompt({ focus, accent }: { focus: string; accent: string }) {
  const parts: [string, string, string][] = [
    ['role', 'Role', 'You are a senior procurement analyst.'],
    ['task', 'Task', 'Summarise this supplier email in three bullets.'],
    ['context', 'Context', 'The deadline is Friday; I need to reply today.'],
    ['example', 'Example', 'Style: "Ask → Deadline → Risk".'],
    ['format', 'Format', 'Return a table: item, owner, date.'],
  ]
  return (
    <Frame label="Prompt bar · anatomy of a good prompt" accent={accent}>
      <div style={{ background: '#fff', borderRadius: 18, padding: '0.7rem 0.9rem', color: '#29261B', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {parts.map(([k, label, text]) => (
          <Zone key={k} on={focus === k} accent={accent} tag={label.toUpperCase()} style={{ padding: '3px 6px', fontSize: '0.78rem', opacity: focus === k || focus === 'task' ? 1 : 0.6 }}>
            {text}
          </Zone>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><span style={{ width: 26, height: 26, borderRadius: 8, background: '#D97757', color: '#fff', textAlign: 'center', lineHeight: '26px', fontWeight: 800 }}>&uarr;</span></div>
      </div>
    </Frame>
  )
}

function Copilot({ focus, accent }: { focus: string; accent: string }) {
  const msg = focus === 'agent' ? 'Agent: when a PO is over 5 lakh, route to the approver and notify the buyer.' : focus === 'govern' ? 'Admin: label sensitive files, restrict who Copilot can read from.' : 'Summarise the last 3 emails from the supplier and draft a reply.'
  return (
    <Frame label="Copilot · side pane" accent={accent}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: 8 }}>
        <div style={{ background: '#fff', borderRadius: 6, padding: 8 }}><div style={line('80%')} /><div style={line('92%')} /><div style={line('60%')} /><div style={line('85%')} /></div>
        <Zone on accent={accent} tag={focus === 'agent' ? 'AGENT' : focus === 'govern' ? 'ADMIN' : 'ASK'} style={{ background: 'rgba(255,255,255,0.1)', padding: 8, fontSize: '0.68rem', color: '#fff', lineHeight: 1.4 }}>{msg}</Zone>
      </div>
    </Frame>
  )
}

export default function SubjectVisual({ kind, focus, accent }: { kind: VisualKind; focus: string; accent: string }) {
  if (kind === 'linkedin') return <LinkedIn focus={focus} accent={accent} />
  if (kind === 'excel') return <Excel focus={focus} accent={accent} />
  if (kind === 'ppt') return <Ppt focus={focus} accent={accent} />
  if (kind === 'resume') return <Resume focus={focus} accent={accent} />
  if (kind === 'copilot') return <Copilot focus={focus} accent={accent} />
  return <Prompt focus={focus} accent={accent} />
}

// Barada Academy — LMS content-rendering fix (2026-09-27, CTO approved)
//
// Renders the `lessons.body` field, which stores plain text (no Markdown
// library exists anywhere in this project, so we do not introduce one or
// use dangerouslySetInnerHTML — this matches the same plain-string
// rendering already used for `lesson.description` and `lesson.key_points`
// elsewhere in the lesson page).
//
// Content is authored as blocks separated by a blank line. Within a block:
//   - every line starting with "- "        -> bullet list
//   - every line starting with "1. " etc.  -> numbered list
//   - a single line starting with "### "   -> a bold sub-heading
//     (a lightweight, project-local convention — not Markdown — used so
//     one `body` field can carry both "detailed teaching content" and a
//     "practical examples" sub-section without a new schema field)
//   - anything else                        -> a paragraph (line breaks
//                                              inside it are preserved)
'use client'

function renderBlock(block: string, key: number) {
  const lines = block.split('\n').filter((l) => l.trim().length > 0)
  if (lines.length === 0) return null

  if (lines.length === 1 && lines[0].trim().startsWith('### ')) {
    return (
      <p key={key} style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        {lines[0].trim().slice(4)}
      </p>
    )
  }

  if (lines.every((l) => l.trim().startsWith('- '))) {
    return (
      <ul key={key} style={{ margin: '0 0 1rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {lines.map((l, i) => (
          <li key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', lineHeight: 1.7 }}>
            {l.trim().slice(2)}
          </li>
        ))}
      </ul>
    )
  }

  if (lines.every((l) => /^\d+\.\s/.test(l.trim()))) {
    return (
      <ol key={key} style={{ margin: '0 0 1rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {lines.map((l, i) => (
          <li key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', lineHeight: 1.7 }}>
            {l.trim().replace(/^\d+\.\s/, '')}
          </li>
        ))}
      </ol>
    )
  }

  return (
    <p key={key} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: '0 0 1rem' }}>
      {lines.join('\n')}
    </p>
  )
}

export default function LessonBody({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  return <div>{blocks.map((b, i) => renderBlock(b, i))}</div>
}

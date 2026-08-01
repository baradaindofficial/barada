'use client'

interface ContentComingSoonProps {
  lessonTitle: string
  availableAssets?: { type: string; title: string; url: string }[]
}

export default function ContentComingSoon({ lessonTitle, availableAssets = [] }: ContentComingSoonProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0D183D, #1a2b5e)',
      borderRadius: 16,
      padding: '3rem 2rem',
      textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.08)',
      minHeight: 360,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.25rem',
    }}>
      <div style={{
        width: 72, height: 72,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        🎬
      </div>
      <div>
        <p style={{
          color: '#D4AF37', fontWeight: 700,
          fontSize: '0.72rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: '0.5rem',
        }}>
          Content Being Prepared
        </p>
        <h3 style={{
          fontFamily: 'Poppins, system-ui, sans-serif',
          fontWeight: 700, color: '#fff',
          fontSize: '1.125rem', marginBottom: '0.5rem',
        }}>
          {lessonTitle}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', maxWidth: 420, margin: '0 auto' }}>
          This lesson video is being produced. We publish new content regularly — check back soon.
        </p>
      </div>
      {availableAssets.length > 0 && (
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: 400 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Available Now
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {availableAssets.map((asset, i) => (
              <a key={i} href={asset.url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 8, padding: '0.625rem 1rem',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)',
                }}>
                <span style={{ fontSize: '1rem' }}>
                  {asset.type === 'pdf' ? '📄' : asset.type === 'ppt' ? '📽️' : '⬇️'}
                </span>
                <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>{asset.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

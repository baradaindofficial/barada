// Barada Academy -- per-course look for the lesson player (2026-11-15).
// Picks accent / background colours and a watermark motif from the course slug,
// title or DB theme_color. Watermarks are original abstract marks (not vendor logos).

export type WatermarkKind = 'spark' | 'ring' | 'blocks' | 'dots' | 'grid' | 'barada'

export interface CourseTheme {
  accent: string // highlights, progress, labels
  mid: string // card gradient start
  dark: string // card gradient end / text on accent
  page: string // page + fullscreen background
  nav: string // top bar / side panel
  mark: WatermarkKind
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function mix(hex: string, other: string, t: number): string {
  const a = hexToRgb(hex)
  const b = hexToRgb(other)
  if (!a || !b) return hex
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('')
}

export const BARADA_THEME: CourseTheme = {
  accent: '#D4AF37',
  mid: '#0D4638',
  dark: '#08372C',
  page: '#072E24',
  nav: '#0D4638',
  mark: 'barada',
}

export function courseTheme(slug: string, title: string, themeColor?: string | null): CourseTheme {
  const key = (slug + ' ' + title).toLowerCase()
  if (/claude/.test(key))
    return { accent: '#E8956C', mid: '#4A2E20', dark: '#2A1B14', page: '#1B120D', nav: '#2A1B14', mark: 'spark' }
  if (/chatgpt|openai/.test(key))
    return { accent: '#19C37D', mid: '#0F3B30', dark: '#0A2620', page: '#061A16', nav: '#0A2620', mark: 'ring' }
  if (/copilot|microsoft/.test(key))
    return { accent: '#6BA5FF', mid: '#17356B', dark: '#0E2147', page: '#09152F', nav: '#0E2147', mark: 'blocks' }
  if (/gemini|google/.test(key))
    return { accent: '#7FB0FF', mid: '#1B3563', dark: '#10213F', page: '#0A152B', nav: '#10213F', mark: 'dots' }
  if (/excel|spreadsheet|data/.test(key))
    return { accent: '#35C985', mid: '#12482F', dark: '#0A301F', page: '#061F14', nav: '#0A301F', mark: 'grid' }
  if (themeColor && hexToRgb(themeColor) && !/^v5-/.test(slug)) {
    return {
      accent: mix(themeColor, '#ffffff', 0.5),
      mid: mix(themeColor, '#000000', 0.5),
      dark: mix(themeColor, '#000000', 0.72),
      page: mix(themeColor, '#000000', 0.84),
      nav: mix(themeColor, '#000000', 0.72),
      mark: 'barada',
    }
  }
  return BARADA_THEME
}

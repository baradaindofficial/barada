// Single source of truth for Barada ecosystem vertical data.
// Previously defined independently in app/page.tsx and app/ecosystem/page.tsx
// with diverging status labels and colors for the same items — see
// BARADA_CORPORATE_WEBSITE_IMPLEMENTATION_BRIEF.md Section 3/10.

export type VerticalStatus = 'live' | 'in_development' | 'planned'

export interface EcosystemVertical {
  icon: string
  name: string
  tagline: string
  desc: string
  href: string
  status: VerticalStatus
  color: string
  external?: boolean
}

export const STATUS_LABEL: Record<VerticalStatus, string> = {
  live: 'Active',
  in_development: 'In Development',
  planned: 'Planned',
}

export const ECOSYSTEM_VERTICALS: EcosystemVertical[] = [
  {
    icon: '\uD83C\uDF93',
    name: 'Barada Academy',
    tagline: 'AI & Professional Learning',
    desc: 'Structured professional courses on AI tools, productivity, and career skills. Free to learn.',
    href: '/academy',
    status: 'live',
    color: '#E31E24',
  },
  {
    icon: '\uD83D\uDD17',
    name: 'Partnerschaft',
    tagline: 'B2B Lean Mediation',
    desc: 'Pan-India B2B mediation for retail execution, BTL, procurement, and instore branding.',
    href: 'https://partnerschaft.in',
    status: 'live',
    color: '#0D183D',
    external: true,
  },
  {
    icon: '\uD83E\uDD16',
    name: 'Technology',
    tagline: 'AI Products & Platforms',
    desc: 'Building the next generation of AI-powered tools and technology platforms for professionals.',
    href: '/technology',
    status: 'in_development',
    color: '#475569',
  },
  {
    icon: '\uD83D\uDCCB',
    name: 'Consulting',
    tagline: 'Corporate Transformation',
    desc: 'AI adoption advisory, procurement transformation, and corporate excellence consulting.',
    href: '/consulting',
    status: 'in_development',
    color: '#475569',
  },
  {
    icon: '\uD83C\uDF31',
    name: 'Ayushman',
    tagline: 'Social Impact',
    desc: 'A platform for autism awareness, caregiver support, and community building across India.',
    href: '#',
    status: 'planned',
    color: '#475569',
  },
]

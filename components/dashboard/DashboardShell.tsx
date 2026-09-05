'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import DashboardHeader from './DashboardHeader'

interface DashboardShellProps {
  learnerName: string
  avatarUrl?: string | null
  children: React.ReactNode
}

export default function DashboardShell({ learnerName, avatarUrl, children }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader learnerName={learnerName} avatarUrl={avatarUrl} onMenuClick={() => setMobileNavOpen(true)} />
        <main style={{ flex: 1, padding: 'clamp(1rem, 3vw, 2rem)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

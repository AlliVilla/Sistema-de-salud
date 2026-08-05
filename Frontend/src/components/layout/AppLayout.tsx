import type { ReactNode } from 'react'
import { isOnboardingScreen } from '../../constants/navigation'
import type { ScreenId } from '../../types'
import NavBar from './NavBar'

interface AppLayoutProps {
  currentScreen: ScreenId
  onNavigate: (screen: ScreenId) => void
  children: ReactNode
}

// Responsive application shell: full-viewport web layout (no phone frame).
//
//  - Desktop (md+): header con marca + navegación superior + estado del dispositivo.
//  - Mobile: barra superior compacta y navegación inferior.
//  - El contenido se centra con ancho máximo para mantener legibilidad en monitores.
export default function AppLayout({ currentScreen, onNavigate, children }: AppLayoutProps) {
  const showNav = !isOnboardingScreen(currentScreen)

  return (
    <div className="flex h-screen flex-col bg-[#060E10] text-[var(--text-primary)]">
      {/* Header desktop */}
      <header className="hidden md:flex items-center gap-8 border-b border-[var(--border)] bg-[var(--bg-base)] px-8 py-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-1)]">
            <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
              <path d="M6 18 L12 10 L18 26 L24 10 L30 18" stroke="var(--accent-teal)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="font-display text-base font-bold leading-tight tracking-tight text-[var(--text-primary)]">VitaCore</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Monitor</p>
          </div>
        </div>

        {showNav && <NavBar currentScreen={currentScreen} onNavigate={onNavigate} variant="desktop" />}

        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-3 py-1.5 flex-shrink-0">
          <span className="h-2 w-2 rounded-full bg-[var(--accent-teal)]" />
          <span className="text-xs text-[var(--text-muted)]">dispositivo conectado</span>
        </div>
      </header>

      {/* Header mobile */}
      <header className="flex md:hidden items-center justify-between border-b border-[var(--border)] bg-[var(--bg-base)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-1)]">
            <svg width="15" height="15" viewBox="0 0 36 36" fill="none">
              <path d="M6 18 L12 10 L18 26 L24 10 L30 18" stroke="var(--accent-teal)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">VitaCore Monitor</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-teal)]" />
          <span className="text-[10px] text-[var(--text-muted)]">conectado</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        <div className="mx-auto h-full w-full max-w-4xl md:px-8">
          {children}
        </div>
      </main>

      {/* Nav inferior mobile */}
      {showNav && <NavBar currentScreen={currentScreen} onNavigate={onNavigate} variant="mobile" />}
    </div>
  )
}
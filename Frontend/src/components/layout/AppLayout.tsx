import { Outlet, useLocation } from 'react-router-dom'
import { screenFromPath } from '../../constants/routes'
import { isOnboardingScreen } from '../../constants/navigation'
import NavBar from './NavBar'

// Responsive application shell: full-viewport web layout (no phone frame).
//
//  - Desktop (md+): header con marca + navegación superior + estado del dispositivo.
//  - Mobile: barra superior compacta y navegación inferior.
//  - El contenido se centra con ancho máximo para mantener legibilidad en monitores.
export default function AppLayout() {
  const { pathname } = useLocation()
  const currentScreen = screenFromPath(pathname)
  const showNav = !isOnboardingScreen(currentScreen)

  return (
    <div className="flex h-screen w-full flex-col bg-[#060E10] text-[var(--text-primary)]">
      {/* Header desktop — padre w-full, hijo centrado vía .app-desktop-center (md+) */}
      <div className="hidden w-full md:block border-b border-[var(--border)] bg-[var(--bg-base)]">
        <div className="app-desktop-center flex w-full items-center gap-8 px-8 py-3">
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

          {showNav && <NavBar currentScreen={currentScreen} variant="desktop" />}

          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-3 py-1.5 flex-shrink-0">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-teal)]" />
            <span className="text-xs text-[var(--text-muted)]">dispositivo conectado</span>
          </div>
        </div>
      </div>

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

      {/* Content — padre w-full; columna centrada solo en md+ */}
      <main className="w-full flex-1 overflow-hidden">
        <div className="app-desktop-center h-full w-full md:px-8">
          <Outlet />
        </div>
      </main>

      {/* Nav inferior mobile */}
      {showNav && <NavBar currentScreen={currentScreen} variant="mobile" />}
    </div>
  )
}

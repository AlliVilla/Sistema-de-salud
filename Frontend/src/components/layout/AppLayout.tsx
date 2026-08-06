import { Outlet, useLocation } from 'react-router-dom'
import { screenFromPath } from '../../constants/routes'
import { isOnboardingScreen } from '../../constants/navigation'
import Sidebar from './Sidebar'
import NavBar from './NavBar'

export default function AppLayout() {
  const { pathname } = useLocation()
  const currentScreen = screenFromPath(pathname)
  const showNav = !isOnboardingScreen(currentScreen)

  return (
    <div className="flex h-screen w-full bg-[#060E10] text-[var(--text-primary)]">
      {/* Sidebar lateral fijo (md+) */}
      {showNav && <Sidebar currentScreen={currentScreen} />}

      {/* Columna principal */}
      <div className="flex min-w-0 flex-1 flex-col">
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

        {/* Contenido con scroll propio */}
        <main className="w-full flex-1 overflow-y-auto">
          {/* .app-desktop-center: max-width 56rem + margin: 0 auto (solo md+), centrado dentro de main = espacio restante */}
          <div className="app-desktop-center h-full w-full md:px-8">
            <Outlet />
          </div>
        </main>

        {/* Nav inferior mobile */}
        {showNav && <NavBar currentScreen={currentScreen} />}
      </div>
    </div>
  )
}
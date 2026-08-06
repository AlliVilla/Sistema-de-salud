import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'
import { ROUTES } from '../../constants/routes'
import type { ScreenId } from '../../types'

interface SidebarProps {
  currentScreen: ScreenId
}

function renderIcon(key: string, size: number): ReactNode {
  return (
    <svg key={key} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {key === 'home' && (
        <>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </>
      )}
      {key === 'alert' && (
        <>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </>
      )}
      {key === 'hist' && (
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      )}
      {key === 'user' && (
        <>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      )}
    </svg>
  )
}

const NAV_KEYS = ['home', 'alert', 'hist', 'user']

export default function Sidebar({ currentScreen }: SidebarProps) {
  return (
    <aside className="hidden w-[264px] flex-none flex-col border-r border-[var(--border)] bg-[var(--bg-base)] md:flex">
      {/* Logo + dispositivo conectado */}
      <div className="flex flex-col gap-4 px-6 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-1)]">
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <path d="M6 18 L12 10 L18 26 L24 10 L30 18" stroke="var(--accent-teal)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="font-display text-base font-bold leading-tight tracking-tight text-[var(--text-primary)]">VitaCore</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--accent-teal)]" />
          <span className="text-xs text-[var(--text-muted)]">dispositivo conectado</span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex flex-1 flex-col gap-2 px-4 py-3" aria-label="Navegación principal">
        {NAV_ITEMS.map((item, i) => {
          const isActive = currentScreen === item.screen
          return (
            <NavLink
              key={item.screen}
              to={ROUTES[item.screen]}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200',
                isActive
                  ? 'border-[var(--border)] bg-[var(--surface-1)] text-[var(--accent-teal)]'
                  : 'border-transparent text-[var(--text-muted)] hover:bg-[var(--surface-1)]/60 hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              {renderIcon(NAV_KEYS[i], 22)}
              <span
                className="text-[15px]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: isActive ? 600 : 500 }}
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

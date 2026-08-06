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
      {/* Logo */}
      <div className="flex items-center gap-3 px-[22px] pt-7 pb-6">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-1)]">
          <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
            <path d="M6 18 L12 10 L18 26 L24 10 L30 18" stroke="var(--accent-teal)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="font-display text-base font-bold leading-tight tracking-tight text-[var(--text-primary)]">VitaCore</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Monitor</p>
        </div>
      </div>

      <div className="mt-[30px] mx-[22px] h-px bg-[var(--border)]" />

      {/* Navegación — pegada a la parte superior, bajo el logo */}
      <div className="flex flex-1 flex-col px-3">
        <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Menú
        </p>
        <nav
          className="flex flex-col gap-1"
          aria-label="Navegación principal"
        >
          {NAV_ITEMS.map((item, i) => {
            const isActive = currentScreen === item.screen
            return (
              <NavLink
                key={item.screen}
                to={ROUTES[item.screen]}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex w-full items-center gap-3 rounded-xl py-[14px] pr-4 pl-[16px] transition-all duration-200 ${isActive
                  ? 'bg-[var(--surface-1)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-1)]/60 hover:text-[var(--text-primary)]'
                  }`}
              >
                {isActive && (
                  <span className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[var(--accent-teal)]" />
                )}
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${isActive ? 'bg-[rgba(45,212,191,0.14)] text-[var(--accent-teal)]' : ''
                    }`}
                >
                  {renderIcon(NAV_KEYS[i], 20)}
                </span>
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
      </div>

      {/* Dispositivo empujado al fondo */}
      <div className="px-4 pb-5 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] px-3 py-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent-teal)] opacity-60 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent-teal)]" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--text-primary)]">VitaCore X2 Pro</p>
            <p className="truncate text-[11px] text-[var(--text-muted)]">dispositivo conectado</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
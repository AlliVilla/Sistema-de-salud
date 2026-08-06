import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'
import { ROUTES } from '../../constants/routes'
import type { ScreenId } from '../../types'

interface NavBarProps {
  currentScreen: ScreenId
  /** desktop = barra superior (md+), mobile = barra inferior (menor a md) */
  variant: 'desktop' | 'mobile'
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

export default function NavBar({ currentScreen, variant }: NavBarProps) {
  const isDesktop = variant === 'desktop'

  const navClass = isDesktop
    ? 'hidden md:flex flex-1 items-center justify-center gap-1'
    : 'flex md:hidden items-stretch justify-between border-t border-[var(--border)] bg-[var(--bg-base)] px-1'

  return (
    <nav className={navClass} aria-label="Navegación principal">
      {NAV_ITEMS.map((item, i) => {
        const isActive = currentScreen === item.screen
        const color = isActive ? 'text-[var(--accent-teal)]' : 'text-[var(--text-muted)]'
        const iconSize = isDesktop ? 18 : 24

        const buttonClass = isDesktop
          ? `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${color} ${isActive ? 'bg-[var(--surface-1)] border border-[var(--border)]' : 'hover:text-[var(--text-primary)]'
          }`
          : `flex flex-1 flex-col items-center justify-center gap-1.5 py-3 min-h-[64px] ${color}`

        return (
          <NavLink
            key={item.screen}
            to={ROUTES[item.screen]}
            aria-current={isActive ? 'page' : undefined}
            className={buttonClass}
          >
            {renderIcon(NAV_KEYS[i], iconSize)}
            <span style={{ fontSize: isDesktop ? 14 : 11, fontFamily: "'Inter', sans-serif", fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}

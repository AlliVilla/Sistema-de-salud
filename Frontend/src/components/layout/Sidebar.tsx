import { NavLink } from 'react-router-dom'
import { getNavItems } from '../../constants/navigation'
import { ROUTES } from '../../constants/routes'
import { renderNavIcon } from '../shared/Icons'
import type { NavIconKey } from '../shared/Icons'
import type { BluetoothState } from '../../lib/bluetooth'
import { getSessionRole } from '../../lib/auth'
import type { ScreenId } from '../../types'

interface SidebarProps {
  currentScreen: ScreenId
  btState: BluetoothState
  connectedName: string | null
}

const NAV_ICONS: NavIconKey[] = ['home', 'alert', 'hist', 'user']

export default function Sidebar({ currentScreen, btState, connectedName }: SidebarProps) {
  const isConnected = btState === 'connected'
  const deviceName = connectedName || 'Sin dispositivo'
  const deviceStatus = isConnected ? 'dispositivo conectado' : 'desconectado'
  const role = getSessionRole()
  const navItems = getNavItems(role)

  return (
    <aside className="hidden w-[264px] flex-none flex-col border-r border-[var(--border)] bg-[var(--bg-base)] md:flex">
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

      <div className="flex flex-1 flex-col px-3">
        <p className="px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Menú
        </p>
        <nav
          className="flex flex-col gap-1"
          aria-label="Navegación principal"
        >
          {navItems.map((item, i) => {
            const isActive = currentScreen === item.screen
            const iconKey = role === 'Admin' ? 'admin' : NAV_ICONS[Math.min(i, NAV_ICONS.length - 1)]
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
                  {renderNavIcon(iconKey, 20)}
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

      <div className="px-4 pb-5 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] px-3 py-3">
          <span className="relative flex h-2.5 w-2.5">
            {isConnected && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent-teal)] opacity-60 animate-ping" />
            )}
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-[var(--accent-teal)]' : 'bg-[#3E5652]'}`} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--text-primary)]">{deviceName}</p>
            <p className="truncate text-[11px] text-[var(--text-muted)]">{deviceStatus}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

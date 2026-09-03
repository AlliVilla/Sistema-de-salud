import { NavLink } from 'react-router-dom'
import { getNavItems } from '../../constants/navigation'
import { ROUTES } from '../../constants/routes'
import { renderNavIcon } from '../shared/Icons'
import type { NavIconKey } from '../shared/Icons'
import { getSessionRole } from '../../lib/auth'
import type { ScreenId } from '../../types'

interface NavBarProps {
  currentScreen: ScreenId
}

const NAV_ICONS: NavIconKey[] = ['home', 'alert', 'hist', 'user']

export default function NavBar({ currentScreen }: NavBarProps) {
  const role = getSessionRole()
  const navItems = getNavItems(role)

  return (
    <nav
      className="flex items-stretch justify-between border-t border-[var(--border)] bg-[var(--bg-base)] px-1 md:hidden"
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
            className={`flex flex-1 flex-col items-center justify-center gap-1.5 py-3 min-h-[64px] ${isActive ? 'text-[var(--accent-teal)]' : 'text-[var(--text-muted)]'
            }`}
          >
            {renderNavIcon(iconKey, 24)}
            <span
              style={{
                fontSize: 11,
                fontFamily: "'Inter', sans-serif",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {item.label}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}

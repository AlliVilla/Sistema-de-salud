import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../constants/navigation'
import { ROUTES } from '../../constants/routes'
import { renderNavIcon } from '../shared/Icons'
import type { NavIconKey } from '../shared/Icons'
import type { ScreenId } from '../../types'

interface NavBarProps {
  currentScreen: ScreenId
}

const NAV_ICONS: NavIconKey[] = ['home', 'alert', 'hist', 'user']

export default function NavBar({ currentScreen }: NavBarProps) {
  return (
    <nav
      className="flex items-stretch justify-between border-t border-[var(--border)] bg-[var(--bg-base)] px-1 md:hidden"
      aria-label="Navegación principal"
    >
      {NAV_ITEMS.map((item, i) => {
        const isActive = currentScreen === item.screen
        return (
          <NavLink
            key={item.screen}
            to={ROUTES[item.screen]}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-1.5 py-3 min-h-[64px] ${isActive ? 'text-[var(--accent-teal)]' : 'text-[var(--text-muted)]'
            }`}
          >
            {renderNavIcon(NAV_ICONS[i], 24)}
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

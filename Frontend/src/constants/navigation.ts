import type { NavItem, ScreenId } from '../types'
import type { UserRole } from '../lib/auth'

export const CLIENT_NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', screen: 'dashboard' },
  { label: 'Alertas', screen: 'alertas' },
  { label: 'Historial', screen: 'historial' },
  { label: 'Perfil', screen: 'perfil' },
]

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Administración', screen: 'admin' },
]

const ONBOARDING_SCREENS: ScreenId[] = ['vincular', 'login', 'registro']

export function getNavItems(role: UserRole | null): NavItem[] {
  return role === 'Admin' ? ADMIN_NAV_ITEMS : CLIENT_NAV_ITEMS
}

export function isOnboardingScreen(screen: ScreenId): boolean {
  return ONBOARDING_SCREENS.includes(screen)
}

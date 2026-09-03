import type { NavItem, ScreenId } from '../types'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', screen: 'dashboard' },
  { label: 'Alertas', screen: 'alertas' },
  { label: 'Historial', screen: 'historial' },
  { label: 'Perfil', screen: 'perfil' },
]

const ONBOARDING_SCREENS: ScreenId[] = ['vincular', 'login', 'registro']

export function isOnboardingScreen(screen: ScreenId): boolean {
  return ONBOARDING_SCREENS.includes(screen)
}
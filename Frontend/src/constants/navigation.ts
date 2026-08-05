import type { NavItem, ScreenId } from '../types'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', screen: 'dashboard' },
  { label: 'Alertas', screen: 'alertas' },
  { label: 'Historial', screen: 'blockchain' },
  { label: 'Perfil', screen: 'perfil' },
]

// Pantallas previas a la vinculación: no muestran la navegación principal.
const ONBOARDING_SCREENS: ScreenId[] = ['vincular', 'login', 'registro']

export function isOnboardingScreen(screen: ScreenId): boolean {
  return ONBOARDING_SCREENS.includes(screen)
}

// Centralized patient/device mock data. Replace with API results once connected.
export const PATIENT = {
  name: 'Elena Morales',
  initials: 'EM',
  age: 42,
  condition: 'Diabetes tipo 2',
  subline: 'paciente crónico · diabetes tipo 2',
  device: 'VitaCore X2 Pro',
  deviceMac: 'BC:4F:A2:11:DE:09',
  deviceBattery: 87,
  deviceBt: 'BT 5.2',
} as const
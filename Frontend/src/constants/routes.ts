import type { ScreenId } from '../types'

export const ROUTES: Record<ScreenId, string> = {
  vincular: '/vincular',
  login: '/login',
  registro: '/registro',
  dashboard: '/dashboard',
  alertas: '/alertas',
  historial: '/historial',
  perfil: '/perfil',
}

export function screenFromPath(pathname: string): ScreenId {
  const entry = Object.entries(ROUTES).find(([, path]) => path === pathname)
  return (entry?.[0] as ScreenId | undefined) ?? 'vincular'
}

import type { ReactNode } from 'react'

export type NavIconKey = 'home' | 'alert' | 'hist' | 'user' | 'admin'

export const NAV_ICON_KEYS: NavIconKey[] = ['home', 'alert', 'hist', 'user', 'admin']

export function renderNavIcon(key: NavIconKey, size: number): ReactNode {
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
      {key === 'admin' && (
        <>
          <path d="M12 2l7 4v6c0 4.4-2.6 7.6-7 10-4.4-2.4-7-5.6-7-10V6z" />
          <path d="M9 12l2 2 4-4" />
        </>
      )}
    </svg>
  )
}

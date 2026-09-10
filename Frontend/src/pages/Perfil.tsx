import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EcgLine from '../components/charts/EcgLine'
import { getMe } from '../lib/api/users'
import type { UserResponse } from '../lib/api/users'
import { clearSession } from '../lib/auth'
import { theme } from '../theme'

interface SettingsItem {
  label: string
  danger: boolean
  icon: ReactNode
  action?: 'logout'
}

const settingsItems: SettingsItem[] = [
  {
    label: 'Historial médico compartido',
    danger: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: 'Notificaciones de alerta',
    danger: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    label: 'Privacidad y datos en blockchain',
    danger: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    label: 'Cerrar sesión',
    danger: true,
    action: 'logout',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
  },
]

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

const dataLabels = {
  age: 'Edad',
  condition: 'Condición',
  device: 'Dispositivo',
} as const

export default function Perfil({ connectedName }: { connectedName: string | null }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserResponse | null>(null)

  useEffect(() => {
    let active = true
    getMe()
      .then((u) => { if (active) setUser(u) })
      .catch(() => { if (active) setUser(null) })
    return () => { active = false }
  }, [])

  const dataRows = [
    { label: dataLabels.age, value: user ? `${user.age} años` : '—' },
    { label: dataLabels.condition, value: user ? user.condition.join(', ') : '—' },
  ]

  const deviceName = connectedName ?? 'Sin dispositivo'
  const isDeviceConnected = !!connectedName

  const handleItemClick = (item: SettingsItem) => {
    if (item.action !== 'logout') return
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.teal} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28, marginTop: 8 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(45,212,191,0.1)',
              border: '1.5px solid rgba(45,212,191,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <span className="font-display" style={{ fontSize: 26, fontWeight: 700, color: theme.colors.teal, letterSpacing: '-0.02em' }}>
              {user ? getInitials(user.name) : '•'}
            </span>
          </div>
          <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em', marginBottom: 6 }}>
            {user?.name ?? 'Paciente'}
          </h2>
          <span style={{ fontSize: 12, color: theme.colors.muted }}>
            {user ? (user.condition.length > 0 ? user.condition.join(' · ') : user.email) : ''}
          </span>
        </div>

        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, border: `1px solid ${theme.colors.border}`, padding: '6px 0', marginBottom: 16 }}>
          {dataRows.map((row, i, arr) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '13px 16px',
                borderBottom: i < arr.length - 1 ? `1px solid ${theme.colors.borderSubtle}` : 'none',
              }}
            >
              <span className="font-mono" style={{ fontSize: 11, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {row.label}
              </span>
              <span style={{ fontSize: 14, color: theme.colors.text, fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderTop: `1px solid ${theme.colors.borderSubtle}` }}>
            <span className="font-mono" style={{ fontSize: 11, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {dataLabels.device}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: theme.colors.text, fontWeight: 500 }}>{deviceName}</span>
              {isDeviceConnected && (
                <span
                  style={{
                    background: 'rgba(45,212,191,0.1)',
                    color: theme.colors.teal,
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 20,
                    border: '1px solid rgba(45,212,191,0.2)',
                  }}
                >
                  conectado
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, border: `1px solid ${theme.colors.border}`, padding: '6px 0' }}>
          {settingsItems.map((item, i, arr) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                borderBottom: i < arr.length - 1 ? `1px solid ${theme.colors.borderSubtle}` : 'none',
                padding: '15px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <span style={{ color: item.danger ? theme.colors.danger : theme.colors.muted, flexShrink: 0 }}>{item.icon}</span>
              <span
                style={{
                  flex: 1,
                  textAlign: 'left',
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  color: item.danger ? theme.colors.danger : theme.colors.text,
                }}
              >
                {item.label}
              </span>
              {!item.danger && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#283E42" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <p className="font-mono" style={{ fontSize: 10, color: theme.colors.border, textAlign: 'center', marginTop: 24 }}>
          VitaCore Monitor v2.4.1 · build 20260804
        </p>
      </div>
    </div>
  )
}
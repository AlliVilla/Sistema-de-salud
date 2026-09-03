import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EcgLine from '../../components/charts/EcgLine'
import { theme } from '../../theme'
import { loginUser } from '../../lib/api/users'
import type { BluetoothState } from '../../lib/bluetooth'
import { setToken } from '@/lib/api/client'
interface LoginProps {
  btState: BluetoothState
}

const TOKEN_KEY = 'vitacare_token'

export default function Login({ btState }: LoginProps) {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: theme.colors.surface2,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.input,
    padding: '12px 14px',
    color: theme.colors.text,
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 6,
  }

  const handleLogin = async () => {
    const trimmed = correo.trim()
    if (!trimmed || !contrasena) {
      setError('Ingresa tu correo y contraseña.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const { token } = await loginUser(trimmed, contrasena)
      localStorage.setItem(TOKEN_KEY, token)
      setToken(token)
      navigate(btState === 'connected' ? '/dashboard' : '/vincular')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.teal} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 28, marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'rgba(45,212,191,0.08)',
              border: '1px solid rgba(45,212,191,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 18,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em', marginBottom: 8, textAlign: 'center' }}>
            Iniciar sesión
          </h1>
          <p style={{ fontSize: 13, color: theme.colors.muted, textAlign: 'center', lineHeight: 1.6, maxWidth: 280 }}>
            Ingresa con tu cuenta para acceder a tu historial y signos vitales encriptados.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: theme.radius.input,
                background: 'rgba(244,63,94,0.08)',
                border: '1px solid rgba(244,63,94,0.35)',
                color: '#F87171',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}
          <div>
            <span style={labelStyle}>Correo electrónico</span>
            <input
              type="email"
              autoComplete="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              style={inputStyle}
            />
          </div>

          <div>
            <span style={labelStyle}>Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? 'rgba(45,212,191,0.15)' : theme.colors.teal,
            border: 'none',
            borderRadius: theme.radius.button,
            padding: '16px',
            color: loading ? theme.colors.teal : '#0A1618',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '-0.01em',
          }}
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p style={{ fontSize: 13, color: theme.colors.muted, textAlign: 'center', marginTop: 20 }}>
          ¿No tienes cuenta?{' '}
          <button
            onClick={() => navigate('/registro')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: theme.colors.teal,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Crear perfil médico
          </button>
        </p>
      </div>
    </div>
  )
}
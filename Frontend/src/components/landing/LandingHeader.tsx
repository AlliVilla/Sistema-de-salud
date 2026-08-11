import { useNavigate } from 'react-router-dom'
import { theme } from '../../theme'
import { LANDING } from './content'

interface LandingHeaderProps {
  onLogin: () => void
}

export default function LandingHeader({ onLogin }: LandingHeaderProps) {
  const navigate = useNavigate()

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10,22,24,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.colors.borderSubtle}`,
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 0 }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 36 36" fill="none">
              <path d="M6 18 L12 10 L18 26 L24 10 L30 18" stroke={theme.colors.teal} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span style={{ textAlign: 'left' }}>
            <span className="font-display" style={{ display: 'block', fontSize: 15, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {LANDING.product}
            </span>
            <span style={{ display: 'block', fontSize: 10, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.18em', lineHeight: 1.2 }}>
              {LANDING.productSubline}
            </span>
          </span>
        </button>

        <button
          onClick={onLogin}
          style={{
            background: theme.colors.teal,
            border: 'none',
            borderRadius: 12,
            padding: '10px 18px',
            color: '#0A1618',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Iniciar sesión
        </button>
      </div>
    </header>
  )
}
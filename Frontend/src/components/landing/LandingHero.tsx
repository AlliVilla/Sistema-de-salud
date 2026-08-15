import { theme } from '../../theme'
import EcgLine from '../charts/EcgLine'
import { LANDING } from './content'

interface LandingHeroProps {
  onCreateAccount: () => void
}

export default function LandingHero({ onCreateAccount }: LandingHeroProps) {
  return (
    <section style={{ position: 'relative' }}>
      <EcgLine color={theme.colors.teal} />

      <div style={{ position: 'relative', overflow: 'hidden', padding: '72px 24px 88px' }}>
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45,212,191,0.12) 0%, rgba(45,212,191,0) 60%)',
            top: -200,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(45,212,191,0.08)',
              border: `1px solid rgba(45,212,191,0.25)`,
              borderRadius: 999,
              padding: '6px 14px',
              marginBottom: 24,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: theme.colors.teal,
              letterSpacing: '0.06em',
            }}
          >
            <span className="blink" style={{ width: 7, height: 7, borderRadius: '50%', background: theme.colors.green }} />
            Monitoreo en tiempo real
          </span>

          <h1
            className="font-display"
            style={{ fontSize: 'clamp(34px, 6vw, 54px)', fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 18 }}
          >
            {LANDING.headline}
          </h1>

          <p style={{ fontSize: 16, color: theme.colors.muted, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 32px' }}>
            {LANDING.description}
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onCreateAccount}
              style={{
                background: theme.colors.teal,
                border: 'none',
                borderRadius: theme.radius.button,
                padding: '15px 28px',
                color: '#0A1618',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              Crear cuenta
            </button>
          </div>

          <div style={{ display: 'flex', gap: 28, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
            {[
              { value: '3', label: 'señales monitoreadas' },
              { value: '24/7', label: 'vigilancia continua' },
              { value: 'Bluetooth', label: 'conexión del wearable' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div className="font-mono" style={{ fontSize: 24, fontWeight: 600, color: theme.colors.text, lineHeight: 1.2 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: theme.colors.muted, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
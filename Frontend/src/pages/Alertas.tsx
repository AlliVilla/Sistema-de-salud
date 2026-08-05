import { useState } from 'react'
import EcgLine from '../components/charts/EcgLine'
import { mockActiveAlert, mockResolvedAlerts } from '../lib/mock'
import { theme } from '../theme'

export default function Alertas() {
  const [reviewed, setReviewed] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.danger} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 32px' }}>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em', marginBottom: 6 }}>
          Alertas
        </h1>
        <p style={{ fontSize: 13, color: theme.colors.muted, marginBottom: 20 }}>1 activa · {mockResolvedAlerts.length} resueltas</p>

        {!reviewed && (
          <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, border: '1px solid rgba(255,107,107,0.4)', padding: '18px 16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span
                className="blink"
                style={{
                  background: 'rgba(255,107,107,0.15)',
                  color: theme.colors.danger,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 20,
                  border: '1px solid rgba(255,107,107,0.25)',
                }}
              >
                riesgo alto
              </span>
              <span className="font-mono" style={{ fontSize: 11, color: theme.colors.muted }}>{mockActiveAlert.timestamp}</span>
            </div>
            <h3 className="font-display" style={{ fontSize: 16, fontWeight: 600, color: theme.colors.text, marginBottom: 6 }}>
              {mockActiveAlert.title}
            </h3>
            <p style={{ fontSize: 13, color: theme.colors.muted, lineHeight: 1.6, marginBottom: 14 }}>
              {mockActiveAlert.description}
            </p>

            <div style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                </svg>
                <span style={{ fontSize: 11, color: theme.colors.violet, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Nota de IA
                </span>
              </div>
              <p style={{ fontSize: 12, color: theme.colors.violetText, lineHeight: 1.65 }}>{mockActiveAlert.aiNote}</p>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <span style={{ background: 'rgba(167,139,250,0.12)', color: theme.colors.violet, fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 6 }}>
                  Confianza: {mockActiveAlert.confidence}%
                </span>
                <span style={{ background: 'rgba(167,139,250,0.08)', color: theme.colors.violet, fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 6 }}>
                  {mockActiveAlert.model}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                style={{
                  flex: 1,
                  background: theme.colors.danger,
                  border: 'none',
                  borderRadius: 10,
                  padding: '13px',
                  color: '#fff',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Contactar médico
              </button>
              <button
                onClick={() => setReviewed(true)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: 10,
                  padding: '13px',
                  color: theme.colors.muted,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Marcar revisada
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: reviewed ? 0 : 8 }}>
          <p style={{ fontSize: 11, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Resueltas</p>
          {mockResolvedAlerts.map((a) => (
            <div
              key={a.id}
              style={{
                background: theme.colors.surface,
                borderRadius: 12,
                border: `1px solid ${theme.colors.borderMuted}`,
                padding: '14px 16px',
                marginBottom: 8,
                opacity: 0.55,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 14, color: theme.colors.text, fontWeight: 500 }}>{a.title}</span>
                <span style={{ background: 'rgba(127,160,156,0.12)', color: theme.colors.muted, fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20 }}>
                  resuelta
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="font-mono" style={{ fontSize: 11, color: theme.colors.muted }}>{a.timestamp}</span>
                <span style={{ color: theme.colors.border }}>·</span>
                <span style={{ fontSize: 12, color: theme.colors.muted }}>{a.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
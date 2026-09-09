import { useState } from 'react'
import EcgLine from '../components/charts/EcgLine'
import { mockResolvedAlerts } from '../lib/mock'
import { theme } from '../theme'
import { useDiagnostics } from '../lib/context/diagnosticsContext'

export default function Alertas() {
  const { diagnostics } = useDiagnostics()
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set())

  const activeDiagnostic = diagnostics.find((d) => !reviewedIds.has(d.id))
  const markReviewed = (id: string) => setReviewedIds((prev) => new Set(prev).add(id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.danger} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 32px' }}>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em', marginBottom: 6 }}>
          Alerta
        </h1>
        <p style={{ fontSize: 13, color: theme.colors.muted, marginBottom: 20 }}>
          {activeDiagnostic ? '' : 'Aun no hay una alerta'}
        </p>

        {activeDiagnostic && (
          <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, border: '1px solid rgba(255,107,107,0.4)', padding: '18px 16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="blink" style={{ background: 'rgba(255,107,107,0.15)', color: theme.colors.danger, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(255,107,107,0.25)' }}>
                riesgo alto
              </span>
              <span className="font-mono" style={{ fontSize: 11, color: theme.colors.muted }}>
                {activeDiagnostic.createdAt ? new Date(activeDiagnostic.createdAt).toLocaleTimeString() : ''}
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: 16, fontWeight: 600, color: theme.colors.text, marginBottom: 6 }}>
              Anomalía detectada
            </h3>

            <div style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                </svg>
                <span style={{ fontSize: 11, color: theme.colors.violet, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Nota de IA
                </span>
              </div>
              <p style={{ fontSize: 12, color: theme.colors.violetText, lineHeight: 1.65 }}>
                {activeDiagnostic.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ flex: 1, background: theme.colors.danger, border: 'none', borderRadius: 10, padding: '13px', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                Contactar médico
              </button>
              <button
                onClick={() => markReviewed(activeDiagnostic.id)}
                style={{ flex: 1, background: 'transparent', border: `1px solid ${theme.colors.border}`, borderRadius: 10, padding: '13px', color: theme.colors.muted, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 13, cursor: 'pointer' }}
              >
                Marcar revisada
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: activeDiagnostic ? 0 : 8 }}>
          {mockResolvedAlerts.map((a) => (
            <div key={a.id} style={{ background: theme.colors.surface, borderRadius: 12, border: `1px solid ${theme.colors.borderMuted}`, padding: '14px 16px', marginBottom: 8, opacity: 0.55 }}>
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
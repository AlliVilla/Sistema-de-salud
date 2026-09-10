import { useState } from 'react'
import EcgLine from '../components/charts/EcgLine'
import { theme } from '../theme'
import { useDiagnostics } from '../lib/context/diagnosticsContext'

export default function Alertas() {
  const { diagnostics, loading, error, refresh } = useDiagnostics()
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set())

  const activeDiagnostic = diagnostics.find((d) => !reviewedIds.has(d.id))
  const markReviewed = (id: string) => setReviewedIds((prev) => new Set(prev).add(id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.danger} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em' }}>
            Alerta
          </h1>
          <button
            onClick={() => void refresh()}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'transparent',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 10,
              padding: '8px 12px',
              color: theme.colors.muted,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? 'spin' : ''}>
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {loading ? 'Actualizando…' : 'Actualizar'}
          </button>
        </div>
        <p style={{ fontSize: 13, color: theme.colors.muted, marginBottom: 20 }}>
          {error ? error : activeDiagnostic ? '' : 'Aun no hay una alerta'}
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

      </div>
    </div>
  )
}
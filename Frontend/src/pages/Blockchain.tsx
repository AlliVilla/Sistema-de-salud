import EcgLine from '../components/charts/EcgLine'
import { theme } from '../theme'
import { useState, useEffect, useCallback } from 'react'
import {
  getDiagnostics,
  validateDiagnostics,
  type ApiDiagnostic,
  type ValidateDiagnosticResponse,
} from '@/lib/api/diagnostics'
import { ApiError } from '@/lib/api/client'

function buildShareText(diagnostics: ApiDiagnostic[]): string {
  const lines = diagnostics.map((d, i) => {
    const report = typeof d.report_id === 'string' ? null : d.report_id
    const vitals = report
      ? `FC ${report.heart_rate} bpm · Temp ${report.temperature}°C · SpO₂ ${report.oxygenation}%`
      : 'signos vitales no disponibles'
    return `${i + 1}. ${d.description}\n   ${vitals}\n   Hash: ${d.hash}`
  })

  return (
    'Registro de diagnósticos — VitaCore Monitor\n\n' +
    (lines.length > 0 ? lines.join('\n\n') : 'Sin diagnósticos registrados.')
  )
}

export default function Historial() {
  const [diagnostics, setDiagnostics] = useState<ApiDiagnostic[]>([])
  const [validation, setValidation] = useState<Record<string, ValidateDiagnosticResponse>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareFeedback, setShareFeedback] = useState<string | null>(null)

  const fetchDiagnostics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getDiagnostics()
      const list = response.diagnostics ?? []
      setDiagnostics(list)

      const results: Record<string, ValidateDiagnosticResponse> = {}
      for (const diagnostic of list) {
        try {
          results[diagnostic._id] = await validateDiagnostics(diagnostic._id)
        } catch (err) {
          console.error(`Error: ${err}`)
        }
      }
      setValidation(results)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setDiagnostics([])
        setValidation({})
      } else {
        setError(err instanceof Error ? err.message : 'No se pudo cargar el historial')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchDiagnostics()
  }, [fetchDiagnostics])

  const handleShare = async () => {
    const text = buildShareText(diagnostics)
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'Registro de diagnósticos — VitaCore Monitor',
          text,
        })
        return
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        setShareFeedback('Copiado al portapapeles')
      } else {
        setShareFeedback('No se pudo compartir en este dispositivo')
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      console.error(`Error: ${err}`)
      setShareFeedback('No se pudo compartir')
    }
  }

  useEffect(() => {
    if (!shareFeedback) return
    const timer = setTimeout(() => setShareFeedback(null), 2500)
    return () => clearTimeout(timer)
  }, [shareFeedback])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.violet} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em' }}>
            Registro de diagnosticos
          </h1>
          <button
            onClick={() => void fetchDiagnostics()}
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
        <p style={{ fontSize: 13, color: theme.colors.muted, marginBottom: 24 }}>
          {error ? error : `Ledger verificado · ${diagnostics.length} entradas`}
        </p>

        {diagnostics.length === 0 && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: theme.colors.muted, fontSize: 13 }}>
            Aún no hay diagnósticos registrados.
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 11, top: 10, bottom: 10, width: 1, background: 'rgba(167,139,250,0.15)' }} />
          {diagnostics.map((d) => {
            const v = validation[d._id]
            return (
            <div key={d._id} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flexShrink: 0, paddingTop: 2 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: theme.colors.violet,
                    boxShadow: '0 0 8px rgba(167,139,250,0.5)',
                    border: '2px solid #0A1618',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </div>
              <div style={{ flex: 1, background: theme.colors.surface, borderRadius: 12, border: `1px solid ${theme.colors.border}`, padding: '14px' }}>
                <span className="font-display" style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text, display: 'block', marginBottom: 4 }}>
                  {d.description}
                </span>
                <span className="font-mono" style={{ fontSize: 10, color: theme.colors.muted, display: 'block', marginBottom: 10 }}>
                  {typeof d.report_id === 'string'
                    ? `Reporte: ${d.report_id}`
                    : `Frec. cardíaca: ${d.report_id.heart_rate} · Temperatura corporal: ${d.report_id.temperature}°C · SpO₂: ${d.report_id.oxygenation}`}
                </span>
                <div
                  style={{
                    background: 'rgba(167,139,250,0.07)',
                    border: '1px solid rgba(167,139,250,0.18)',
                    borderRadius: 8,
                    padding: '9px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {v && (
                    <div>
                      <span className="font-mono" style={{ fontSize: 11, color: theme.colors.violetSoft }}>{v.message}</span>
                      {v.message === 'El diagnostico no ha sido alterado. Integridad confirmada.' && (
                        <span
                          style={{
                            background: 'rgba(45,212,191,0.1)',
                            color: theme.colors.teal,
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: 6,
                            border: '1px solid rgba(45,212,191,0.2)',
                            flexShrink: 0,
                            marginLeft: 8,
                          }}
                        >
                          validado
                        </span>
                      )}
                      {v.message === '¡Alerta! El diagnostico en la base de datos no coincide con la blockchain.' && v.data && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span
                            style={{
                              background: 'rgba(212, 45, 45, 0.1)',
                              color: theme.colors.danger,
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: 6,
                              border: '1px solid rgba(212, 45, 45, 0.2)',
                              flexShrink: 0,
                              marginLeft: 8,
                              marginTop: '10px',
                            }}
                          >
                            {`Hash actual: ${v.data.hashActual}`}
                          </span>
                          <span
                            style={{
                              background: 'rgba(212, 45, 45, 0.1)',
                              color: theme.colors.danger,
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: 6,
                              border: '1px solid rgba(212, 45, 45, 0.2)',
                              flexShrink: 0,
                              marginLeft: 8,
                              marginTop: '10px',
                            }}
                          >
                            {`Hash de la blockchain: ${v.data.hashBlockchain}`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            )
          })}
        </div>

        <button
          onClick={handleShare}
          disabled={diagnostics.length === 0}
          style={{
            width: '100%',
            background: 'transparent',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.button,
            padding: '15px',
            color: diagnostics.length === 0 ? theme.colors.borderMuted : theme.colors.muted,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            cursor: diagnostics.length === 0 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          {shareFeedback ?? 'Compartir con médico'}
        </button>
      </div>
    </div>
  )
}

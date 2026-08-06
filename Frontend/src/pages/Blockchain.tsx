import EcgLine from '../components/charts/EcgLine'
import { mockBlockchainEntries } from '../lib/mock'
import { theme } from '../theme'

export default function Historial() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.violet} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em' }}>
            Registro blockchain
          </h1>
          <div style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 8, padding: '5px 10px' }}>
            <span style={{ fontSize: 10, color: theme.colors.violet, fontWeight: 600 }}>INMUTABLE</span>
          </div>
        </div>
        <p style={{ fontSize: 13, color: theme.colors.muted, marginBottom: 24 }}>
          Ledger verificado · {mockBlockchainEntries.length} entradas
        </p>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 11, top: 10, bottom: 10, width: 1, background: 'rgba(167,139,250,0.15)' }} />
          {mockBlockchainEntries.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
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
                  {e.type}
                </span>
                <span className="font-mono" style={{ fontSize: 10, color: theme.colors.muted, display: 'block', marginBottom: 10 }}>
                  {e.timestamp} · bloque {e.block}
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
                  <span className="font-mono" style={{ fontSize: 11, color: theme.colors.violetSoft }}>{e.hash}</span>
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
                    verificado
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          style={{
            width: '100%',
            background: 'transparent',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.button,
            padding: '15px',
            color: theme.colors.muted,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            cursor: 'pointer',
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
          Compartir con médico
        </button>
      </div>
    </div>
  )
}
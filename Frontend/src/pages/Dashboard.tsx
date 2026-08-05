import EcgLine from '../components/charts/EcgLine'
import TempTrendChart from '../components/charts/TempTrendChart'
import { PATIENT } from '../constants/navigation'
import { mockVitals } from '../lib/mock'
import { theme } from '../theme'

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.teal} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 13, color: theme.colors.muted, marginBottom: 4 }}>Buenos días,</p>
            <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em' }}>
              {PATIENT.name}
            </h1>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: theme.colors.surface2,
              border: `1px solid ${theme.colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7FA09C" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, border: `1px solid ${theme.colors.border}`, padding: '18px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Frec. cardíaca</span>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: theme.colors.danger }} className="blink" />
            </div>
            <div className="font-mono heartbeat" style={{ fontSize: 36, fontWeight: 600, color: theme.colors.danger, lineHeight: 1, marginBottom: 4 }}>
              {mockVitals.heartRate}
            </div>
            <div style={{ fontSize: 11, color: theme.colors.muted }}>bpm</div>
          </div>

          <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, border: `1px solid ${theme.colors.border}`, padding: '18px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>SpO₂</span>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: theme.colors.teal }} />
            </div>
            <div className="font-mono" style={{ fontSize: 36, fontWeight: 600, color: theme.colors.teal, lineHeight: 1, marginBottom: 4 }}>
              {mockVitals.spo2}
            </div>
            <div style={{ fontSize: 11, color: theme.colors.muted }}>% saturación</div>
          </div>
        </div>

        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, border: `1px solid ${theme.colors.border}`, padding: '18px 16px', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 11, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                Temperatura corporal
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span className="font-mono" style={{ fontSize: 36, fontWeight: 600, color: theme.colors.amber, lineHeight: 1 }}>
                  {mockVitals.temperature}
                </span>
                <span style={{ fontSize: 13, color: theme.colors.muted }}>°C</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <span style={{ background: 'rgba(52,211,153,0.12)', color: theme.colors.green, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
                estable
              </span>
              <TempTrendChart />
            </div>
          </div>
        </div>

        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, border: `1px solid ${theme.colors.border}`, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, color: theme.colors.muted, marginBottom: 4 }}>Última sincronización</p>
              <p className="font-mono" style={{ fontSize: 13, color: theme.colors.text }}>{mockVitals.syncedAt}</p>
            </div>
            <span
              style={{
                background: 'rgba(45,212,191,0.1)',
                color: theme.colors.teal,
                fontSize: 11,
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: 20,
                border: '1px solid rgba(45,212,191,0.2)',
              }}
            >
              sin anomalías
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
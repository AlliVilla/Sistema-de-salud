import EcgLine from '../components/charts/EcgLine'
import TempTrendChart from '../components/charts/TempTrendChart'
import { PATIENT } from '../constants/navigation'
import { mockVitals } from '../lib/mock'
import { theme } from '../theme'
import type { BleReading } from '../lib/bluetooth'

const BLE_TABLE_ROWS = 15

interface DashboardProps {
  lectura: BleReading | null
  historial: BleReading[]
}

export default function Dashboard({ lectura, historial }: DashboardProps) {
  const heartRate = lectura?.hrValid ? lectura.hr : mockVitals.heartRate
  const spo2 = lectura?.spo2Valid ? lectura.spo2 : mockVitals.spo2
  const temperature = lectura?.temp != null ? lectura.temp : mockVitals.temperature
  const syncedAt = lectura ? new Date(lectura.timestamp).toLocaleTimeString() : mockVitals.syncedAt
  const hrLive = !!lectura?.hrValid
  const spo2Live = !!lectura?.spo2Valid
  const tempLive = lectura?.temp != null

  const tableData = [...historial].reverse().slice(0, BLE_TABLE_ROWS)

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
              <div className="blink" style={{ width: 7, height: 7, borderRadius: '50%', background: hrLive ? theme.colors.green : theme.colors.danger }} />
            </div>
            <div className="font-mono heartbeat" style={{ fontSize: 36, fontWeight: 600, color: theme.colors.danger, lineHeight: 1, marginBottom: 4 }}>
              {heartRate}
            </div>
            <div style={{ fontSize: 11, color: hrLive ? theme.colors.green : theme.colors.muted }}>
              {hrLive ? 'bpm · activo' : 'bpm'}
            </div>
          </div>

          <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, border: `1px solid ${theme.colors.border}`, padding: '18px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>SpO₂</span>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: spo2Live ? theme.colors.green : theme.colors.teal }} />
            </div>
            <div className="font-mono" style={{ fontSize: 36, fontWeight: 600, color: theme.colors.teal, lineHeight: 1, marginBottom: 4 }}>
              {spo2}
            </div>
            <div style={{ fontSize: 11, color: spo2Live ? theme.colors.green : theme.colors.muted }}>% saturación</div>
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
                  {tempLive ? temperature.toFixed(1) : temperature}
                </span>
                <span style={{ fontSize: 13, color: theme.colors.muted }}>°C</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <span style={{ background: 'rgba(52,211,153,0.12)', color: theme.colors.green, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
                {lectura ? 'activo' : 'estable'}
              </span>
              <TempTrendChart />
            </div>
          </div>
        </div>

        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, border: `1px solid ${theme.colors.border}`, padding: '16px', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, color: theme.colors.muted, marginBottom: 4 }}>Última sincronización</p>
              <p className="font-mono" style={{ fontSize: 13, color: theme.colors.text }}>{syncedAt}</p>
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

        {tableData.length > 0 && (
          <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, border: `1px solid ${theme.colors.border}`, padding: '12px 0 0', overflow: 'hidden' }}>
            <div style={{ padding: '0 16px 8px' }}>
              <span style={{ fontSize: 11, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Historial de lecturas</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '6px 16px', color: theme.colors.muted, fontWeight: 500, borderBottom: `1px solid ${theme.colors.border}`, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.06em' }}>Hora</th>
                  <th style={{ textAlign: 'left', padding: '6px 12px', color: theme.colors.muted, fontWeight: 500, borderBottom: `1px solid ${theme.colors.border}`, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.06em' }}>Temp (°C)</th>
                  <th style={{ textAlign: 'left', padding: '6px 12px', color: theme.colors.muted, fontWeight: 500, borderBottom: `1px solid ${theme.colors.border}`, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.06em' }}>FC (bpm)</th>
                  <th style={{ textAlign: 'left', padding: '6px 16px', color: theme.colors.muted, fontWeight: 500, borderBottom: `1px solid ${theme.colors.border}`, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.06em' }}>SpO₂ (%)</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((l, i) => (
                  <tr key={l.timestamp + i} style={{ borderBottom: `1px solid ${theme.colors.borderSubtle}` }}>
                    <td className="font-mono" style={{ padding: '7px 16px', color: theme.colors.muted, fontSize: 11 }}>
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '7px 12px', color: l.temp != null ? theme.colors.amber : theme.colors.borderMuted, fontSize: 13 }}>
                      {l.temp != null ? l.temp.toFixed(1) : '--'}
                    </td>
                    <td style={{ padding: '7px 12px', color: l.hrValid ? theme.colors.danger : theme.colors.borderMuted, fontSize: 13 }}>
                      {l.hrValid ? l.hr : '--'}
                    </td>
                    <td style={{ padding: '7px 16px', color: l.spo2Valid ? theme.colors.teal : theme.colors.borderMuted, fontSize: 13 }}>
                      {l.spo2Valid ? l.spo2 : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

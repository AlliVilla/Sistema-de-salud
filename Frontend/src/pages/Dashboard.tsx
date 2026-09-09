import { useState, useEffect, useRef } from 'react'
import EcgLine from '../components/charts/EcgLine'
import TempTrendChart from '../components/charts/TempTrendChart'
import { theme } from '../theme'
import { getMe } from '../lib/api/users'
import type { BleReading, BluetoothState, BleDevice } from '../lib/bluetooth'
import { registerReport } from '../lib/api/reports'
import { generateDiagnostics } from '../lib/api/diagnostics'
import { useDiagnostics } from '../lib/context/diagnosticsContext'

const BLE_TABLE_ROWS = 15

interface DashboardProps {
  lectura: BleReading | null
  historial: BleReading[]
  btState: BluetoothState
  connectedName: string | null
  knownDevices: BleDevice[]
  connectToDevice: (device: BleDevice) => Promise<boolean>
  scanNewDevice: () => Promise<BleDevice | null>
}

interface Report {
  id: string,
  user_id: string,
  heart_rate?: number,
  temperature?: number,
  oxygenation?: number
  createdAt: string
}

interface ReportResponse {
  message: string,
  report: Report
}

export default function Dashboard({ lectura, historial, btState, connectedName, knownDevices, connectToDevice, scanNewDevice }: DashboardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [connectingId, setConnectingId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const { addDiagnostic } = useDiagnostics()
  const [sendReport, setSendReport] = useState<ReportResponse | null>(null)
  const lastReportedTimestamp = useRef<number | null>(null)

  const heartRate = lectura?.hrValid ? lectura.hr : "--"
  const spo2 = lectura?.spo2Valid ? lectura.spo2 : "--"
  const tempDisplay = lectura?.temp != null ? lectura.temp.toFixed(1) : "--"
  const hrLive = !!lectura?.hrValid
  const spo2Live = !!lectura?.spo2Valid

  const tableData = [...historial].reverse().slice(0, BLE_TABLE_ROWS)

  const isConnected = btState === 'connected'
  const isConnecting = btState === 'connecting' || btState === 'scanning' || connectingId !== null
  const stateDotColor = isConnected ? theme.colors.green : btState === 'error' ? theme.colors.danger : isConnecting ? theme.colors.amber : '#3E5652'
  const stateLabel = isConnected && connectedName ? connectedName : 'Sin dispositivo'
  const stateSub = isConnected ? 'Conectado' : isConnecting ? 'Conectando…' : btState === 'error' ? 'Error' : 'Desconectado'

  const openModal = () => setModalOpen(true)
  const closeModal = () => { setModalOpen(false); setConnectingId(null) }

  useEffect(() => {
    let active = true
    getMe()
      .then((user) => { if (active) setUserName(user.name) })
      .catch(() => { if (active) setUserName(null) })
    return () => { active = false }
  }, [])

  const handleDevicePick = async (device: BleDevice) => {
    if (connectingId) return
    setConnectingId(device.id)
    const ok = await connectToDevice(device)
    setConnectingId(null)
    if (ok) closeModal()
  }

  const handleScanFromModal = async () => {
    setScanning(true)
    const found = await scanNewDevice()
    setScanning(false)
    if (found) {
      setConnectingId(found.id)
      const ok = await connectToDevice(found)
      setConnectingId(null)
      if (ok) closeModal()
    }
  }

  useEffect(() => {
    const handleDiagnostic = async () => {
      const report = sendReport?.report
      if (!report?.id) return
      if (!report.heart_rate || !report.temperature || !report.oxygenation) return

      try {
        const response = await generateDiagnostics(sendReport.report._id)
        if (!response.diagnostic) {
          addDiagnostic(response.diagnostic)
        }
      } catch (error) {
        console.error(`Error: ${error}`)
      }
    }
    handleDiagnostic()
  }, [sendReport,])

  useEffect(() => {
    if (!lectura) return;
    if (!lectura.hr || lectura.temp == null || !lectura.spo2) return;
    if (lastReportedTimestamp.current === Number(lectura.timestamp)) return;

    lastReportedTimestamp.current = Number(lectura.timestamp)

    const getVitals = async () => {
      try {
        const response = await registerReport({
          heart_rate: lectura.hr,
          temperature: lectura.temp,
          oxygenation: lectura.spo2,
        }).catch((error) => {
          console.log(`Ocurio un error: ${error}`)
          lastReportedTimestamp.current = null
        })
        setSendReport(response)
      } catch (error) {
        console.log(`Error: ${error}`)
        lastReportedTimestamp.current = null
      }
    }
    getVitals()
  }, [lectura])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.teal} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: theme.colors.muted, marginBottom: 4 }}>Buenos días,</p>
            <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em' }}>
              {userName ?? 'Paciente'}
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

        {/* Device status — tap to open picker modal */}
        <div
          onClick={openModal}
          style={{
            background: theme.colors.surface,
            borderRadius: theme.radius.card,
            border: `1px solid ${theme.colors.border}`,
            padding: '14px 16px',
            marginBottom: 10,
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: stateDotColor }} className={isConnecting && !connectingId ? 'blink' : ''} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="font-display" style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {stateLabel}
              </div>
              <div style={{ fontSize: 11, color: isConnected ? theme.colors.green : theme.colors.muted }}>
                {stateSub}
              </div>
            </div>
            {isConnected ? (
              <span style={{ background: 'rgba(52,211,153,0.1)', color: theme.colors.green, fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(52,211,153,0.2)', flexShrink: 0 }}>
                Conectado
              </span>
            ) : knownDevices.length > 0 ? (
              <span style={{ color: theme.colors.muted, fontSize: 11, flexShrink: 0 }}>Cambiar</span>
            ) : (
              <span style={{ color: theme.colors.teal, fontSize: 11, fontWeight: 500, flexShrink: 0 }}>Buscar</span>
            )}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.colors.muted} strokeWidth="2" style={{ flexShrink: 0 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* ── MODAL: device picker ─────────────────────────────── */}
        {modalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.6)',
              padding: 16,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 420,
                maxHeight: '85vh',
                background: '#0E1C1F',
                borderRadius: 18,
                border: `1px solid ${theme.colors.border}`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 10px' }}>
                <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, color: theme.colors.text }}>
                  Seleccionar dispositivo
                </h2>
                <button
                  onClick={closeModal}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: 'rgba(255,107,107,0.08)',
                    border: '1px solid rgba(255,107,107,0.15)',
                    color: theme.colors.muted,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Device list */}
              <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 16px' }}>
                {knownDevices.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: theme.colors.muted, fontSize: 13 }}>
                    No hay dispositivos guardados aún.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {knownDevices.map((device) => {
                      const isThisConnecting = connectingId === device.id
                      const isThisConnected = isConnected && connectedName === device.name

                      return (
                        <div
                          key={device.id}
                          onClick={() => !isThisConnected && handleDevicePick(device)}
                          style={{
                            borderRadius: 12,
                            background: isThisConnected ? 'rgba(52,211,153,0.06)' : '#122427',
                            border: `1px solid ${isThisConnected ? 'rgba(52,211,153,0.3)' : '#1C2E32'}`,
                            padding: '13px 14px',
                            cursor: isThisConnected ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                          }}
                        >
                          <div style={{ position: 'relative', width: 38, height: 38, flexShrink: 0 }}>
                            {isThisConnecting && (
                              <>
                                <div className="pulse-ring-2" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(45,212,191,0.3)' }} />
                                <div className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(45,212,191,0.5)' }} />
                              </>
                            )}
                            <div
                              style={{
                                position: 'absolute',
                                inset: 4,
                                borderRadius: '50%',
                                background: isThisConnected ? 'rgba(52,211,153,0.15)' : 'rgba(45,212,191,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isThisConnected ? '#34D399' : '#2DD4BF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6.5 6.5l11 11M6.5 17.5l5-5 5-5M12 12l3.5 3.5" />
                              </svg>
                            </div>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                              <span className="font-display" style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {device.name}
                              </span>
                              {!isThisConnected && !isThisConnecting && (
                                <span
                                  style={{
                                    flexShrink: 0,
                                    fontSize: 9,
                                    fontWeight: 600,
                                    padding: '1px 6px',
                                    borderRadius: 6,
                                    background: device.inRange ? 'rgba(52,211,153,0.12)' : 'rgba(127,160,156,0.08)',
                                    color: device.inRange ? theme.colors.green : '#3E5652',
                                    border: `1px solid ${device.inRange ? 'rgba(52,211,153,0.2)' : 'rgba(127,160,156,0.1)'}`,
                                  }}
                                >
                                  {device.inRange ? 'en rango' : 'no disponible'}
                                </span>
                              )}
                            </div>
                            <span className="font-mono" style={{ fontSize: 10, color: theme.colors.muted }}>
                              {device.id.slice(0, 17)}
                            </span>
                          </div>
                          {isThisConnecting ? (
                            <span style={{ fontSize: 11, color: theme.colors.amber, flexShrink: 0 }}>…</span>
                          ) : isThisConnected ? (
                            <span style={{ background: 'rgba(52,211,153,0.12)', color: theme.colors.green, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 16, flexShrink: 0 }}>
                              Activo
                            </span>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Scan button */}
              <div style={{ padding: '12px 20px 20px', borderTop: `1px solid ${theme.colors.borderSubtle}` }}>
                <button
                  onClick={handleScanFromModal}
                  disabled={scanning || connectingId !== null}
                  style={{
                    width: '100%',
                    background: scanning ? 'rgba(45,212,191,0.1)' : 'rgba(45,212,191,0.06)',
                    border: `1px solid ${scanning ? 'rgba(45,212,191,0.15)' : 'rgba(45,212,191,0.2)'}`,
                    borderRadius: 12,
                    padding: '14px',
                    color: theme.colors.teal,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: scanning ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                  </svg>
                  {scanning ? 'Buscando…' : 'Escanear nuevo dispositivo'}
                </button>
              </div>
            </div>
          </div>
        )}

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
                  {tempDisplay}
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
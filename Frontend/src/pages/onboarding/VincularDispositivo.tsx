import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EcgLine from '../../components/charts/EcgLine'
import { theme } from '../../theme'
import type { BluetoothState, BleDevice } from '../../lib/bluetooth'

interface VincularDispositivoProps {
  btState: BluetoothState
  knownDevices: BleDevice[]
  connectedName: string | null
  loadingKnown: boolean
  btSupported: boolean
  scanNewDevice: () => Promise<BleDevice | null>
  connectToDevice: (device: BleDevice) => Promise<boolean>
}

const stateLabel: Record<BluetoothState, string> = {
  disconnected: 'Desconectado',
  scanning: 'Buscando…',
  connecting: 'Conectando…',
  connected: 'Conectado',
  error: 'Error',
}

export default function VincularDispositivo({ btState, knownDevices, connectedName, loadingKnown, btSupported, scanNewDevice, connectToDevice }: VincularDispositivoProps) {
  const navigate = useNavigate()
  const [scanning, setScanning] = useState(false)
  const [connectingId, setConnectingId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleScan = async () => {
    setScanning(true)
    setErrorMsg(null)
    const found = await scanNewDevice()
    setScanning(false)
    if (!found) {
      setErrorMsg('No se encontraron dispositivos o se canceló la búsqueda.')
    }
  }

  const handleConnect = async (device: BleDevice) => {
    if (connectingId) return
    setConnectingId(device.id)
    setErrorMsg(null)
    const ok = await connectToDevice(device)
    setConnectingId(null)
    if (ok) {
      setTimeout(() => navigate('/dashboard'), 800)
    } else {
      setErrorMsg('No se pudo conectar al dispositivo. Intenta de nuevo.')
    }
  }

  const isConnected = btState === 'connected'
  const isConnecting = btState === 'connecting' || btState === 'scanning' || connectingId !== null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.teal} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 40px', overflow: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 28, marginBottom: 24 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: isConnected ? 'rgba(52,211,153,0.1)' : 'rgba(45,212,191,0.08)',
              border: `1px solid ${isConnected ? 'rgba(52,211,153,0.35)' : 'rgba(45,212,191,0.25)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M6 18 L12 10 L18 26 L24 10 L30 18" stroke={isConnected ? '#34D399' : '#2DD4BF'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="18" cy="18" r="16" stroke={isConnected ? '#34D399' : '#2DD4BF'} strokeWidth="1" strokeOpacity="0.3" />
            </svg>
          </div>
          <h1
            className="font-display"
            style={{ fontSize: 24, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em', marginBottom: 8, textAlign: 'center' }}
          >
            Vincular tu wearable
          </h1>
          <p style={{ fontSize: 14, color: theme.colors.muted, textAlign: 'center', lineHeight: 1.6, maxWidth: 280 }}>
            Activa el Bluetooth en tu dispositivo y selecciónalo de la lista.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isConnected ? theme.colors.green : btState === 'error' ? theme.colors.danger : isConnecting ? theme.colors.amber : '#3E5652',
            }}
            className={btState === 'scanning' || isConnecting ? 'blink' : ''}
          />
          <span style={{ fontSize: 12, color: theme.colors.muted }}>
            {isConnected && connectedName ? `${connectedName} · Conectado` : stateLabel[btState]}
          </span>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: theme.colors.danger }}>{errorMsg}</span>
          </div>
        )}

        {!btSupported && (
          <div style={{ background: 'rgba(255,175,0,0.08)', border: '1px solid rgba(255,175,0,0.25)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: theme.colors.amber, display: 'block', fontWeight: 600, marginBottom: 4 }}>
              Web Bluetooth no está disponible en este navegador.
            </span>
            <span style={{ fontSize: 11, color: theme.colors.muted, display: 'block', lineHeight: 1.5 }}>
              Abre la app por <span className="font-mono">localhost</span> o por <span className="font-mono">https://</span> (la IP por HTTP no es un contexto seguro).
            </span>
          </div>
        )}

        {knownDevices.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, marginBottom: 8 }}>
              Dispositivos encontrados
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {knownDevices.map((device) => {
                const isThisConnecting = connectingId === device.id
                const isThisConnected = isConnected && connectedName === device.name

                return (
                  <div
                    key={device.id}
                    onClick={() => !isThisConnected && handleConnect(device)}
                    style={{
                      borderRadius: 12,
                      background: isThisConnected ? 'rgba(52,211,153,0.06)' : '#101F22',
                      border: `1px solid ${isThisConnected ? 'rgba(52,211,153,0.3)' : '#1A2E32'}`,
                      padding: '14px 16px',
                      cursor: isThisConnected ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                    }}
                  >
                    <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isThisConnected ? '#34D399' : '#2DD4BF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6.5 6.5l11 11M6.5 17.5l5-5 5-5M12 12l3.5 3.5" />
                        </svg>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <div className="font-display" style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {device.name}
                        </div>
                        {!loadingKnown && !isThisConnected && !isThisConnecting && (
                          <span
                            style={{
                              flexShrink: 0,
                              fontSize: 9,
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: 8,
                              background: device.inRange ? 'rgba(52,211,153,0.12)' : 'rgba(127,160,156,0.08)',
                              color: device.inRange ? theme.colors.green : '#3E5652',
                              border: `1px solid ${device.inRange ? 'rgba(52,211,153,0.2)' : 'rgba(127,160,156,0.1)'}`,
                            }}
                          >
                            {device.inRange ? 'en rango' : 'no disponible'}
                          </span>
                        )}
                      </div>
                      <div className="font-mono" style={{ fontSize: 10, color: theme.colors.muted }}>
                        {device.id.slice(0, 17)}
                      </div>
                    </div>
                    {isThisConnecting ? (
                      <span style={{ fontSize: 11, color: theme.colors.amber, flexShrink: 0 }}>Conectando…</span>
                    ) : isThisConnected ? (
                      <span style={{ background: 'rgba(52,211,153,0.12)', color: theme.colors.green, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, flexShrink: 0 }}>
                        Conectado
                      </span>
                    ) : (
                      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexShrink: 0 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            style={{
                              width: 3,
                              height: 5 + i * 3,
                              borderRadius: 1.5,
                              background: i <= 3 || device.inRange ? theme.colors.teal : 'rgba(45,212,191,0.15)',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {knownDevices.length === 0 && !isConnecting && !loadingKnown && (
          <div style={{ border: '1.5px dashed rgba(45,212,191,0.25)', borderRadius: 14, background: '#101F22', padding: '28px 20px', textAlign: 'center', marginBottom: 16 }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto 12px' }}>
              <rect x="4" y="8" width="32" height="24" rx="4" stroke="#2DD4BF" strokeWidth="1.5" strokeOpacity="0.3" />
              <path d="M18 20 L22 20 M18 24 L26 24" stroke="#2DD4BF" strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="round" />
              <circle cx="20" cy="16" r="2" stroke="#2DD4BF" strokeWidth="1.5" strokeOpacity="0.4" />
            </svg>
            <p style={{ fontSize: 13, color: theme.colors.muted, marginBottom: 4 }}>No hay dispositivos guardados</p>
            <p style={{ fontSize: 11, color: '#3E5652' }}>Presiona "Escanear" para buscar dispositivos cercanos.</p>
          </div>
        )}

        {loadingKnown && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '32px 20px', color: theme.colors.muted, fontSize: 13 }}>
            <div className="blink" style={{ width: 6, height: 6, borderRadius: '50%', background: theme.colors.teal }} />
            Verificando dispositivos guardados…
          </div>
        )}

        <div style={{ flex: 1 }} />

        <button
          onClick={handleScan}
          disabled={scanning || isConnecting || !btSupported}
          style={{
            background: scanning ? 'rgba(45,212,191,0.15)' : theme.colors.teal,
            border: 'none',
            borderRadius: theme.radius.button,
            padding: '16px',
            color: scanning ? theme.colors.teal : '#0A1618',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: scanning ? 'default' : 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '-0.01em',
            opacity: scanning || !btSupported ? 0.7 : 1,
          }}
        >
          {!btSupported ? 'Bluetooth no disponible' : scanning ? 'Buscando dispositivos…' : isConnected ? 'Dispositivo vinculado' : 'Escanear nuevos dispositivos'}
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          disabled={scanning || isConnecting}
          style={{
            background: 'transparent',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.button,
            padding: '14px',
            color: theme.colors.muted,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '-0.01em',
            marginTop: 10,
            opacity: scanning || isConnecting ? 0.5 : 1,
          }}
        >
          Más tarde
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useBluetooth } from '../lib/bluetooth'
import { theme } from '../theme'
import EcgLine from '../components/charts/EcgLine'

export default function BtTest() {
  const {
    state,
    knownDevices,
    connectedName,
    scanNewDevice,
    connectToDevice,
    disconnect,
    loadingKnown,
    btSupported,
    ultimaLectura,
    historial,
  } = useBluetooth()

  const [scanning, setScanning] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const handleScan = async () => {
    setScanning(true)
    setMsg(null)
    if (!('bluetooth' in navigator)) {
      setScanning(false)
      setMsg('Web Bluetooth no está disponible (contexto no seguro o navegador sin soporte).')
      return
    }
    const found = await scanNewDevice()
    setScanning(false)
    if (!found) setMsg('Ningún dispositivo o se canceló la búsqueda.')
    else setMsg(`Dispositivo encontrado: ${found.name}`)
  }

  const handleConnect = async (id: string) => {
    const dev = knownDevices.find(d => d.id === id)
    if (!dev) return
    setMsg(`Conectando a ${dev.name}…`)
    const ok = await connectToDevice(dev)
    setMsg(ok ? `Conectado: ${dev.name}` : 'Error al conectar')
  }

  const origin = `${window.location.protocol}//${window.location.host}`
  const secure = window.isSecureContext

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px' }}>
      <EcgLine color={theme.colors.teal} />
      <h1 style={{ fontSize: 20, fontWeight: 700, color: theme.colors.text, marginBottom: 8 }}>Test Bluetooth (temporal)</h1>
      <div style={{ fontSize: 12, color: theme.colors.muted, marginBottom: 8 }}>
        Origen: <span className="font-mono">{origin}</span>
      </div>
      <div style={{ fontSize: 12, marginBottom: 16 }}>
        Contexto seguro (isSecureContext):{' '}
        <span style={{ color: secure ? theme.colors.green : theme.colors.danger, fontWeight: 600 }}>{secure ? 'SÍ' : 'NO'}</span>
        {' · '}web bluetooth:{' '}
        <span style={{ color: btSupported ? theme.colors.green : theme.colors.danger, fontWeight: 600 }}>{btSupported ? 'SÍ' : 'NO'}</span>
      </div>

      {!btSupported && (
        <div style={{ background: 'rgba(255,175,0,0.08)', border: '1px solid rgba(255,175,0,0.25)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: theme.colors.amber, display: 'block', fontWeight: 600, marginBottom: 4 }}>
            Web Bluetooth no está disponible.
          </span>
          <span style={{ fontSize: 11, color: theme.colors.muted, display: 'block', lineHeight: 1.5 }}>
            Abre por <span className="font-mono">localhost</span> o <span className="font-mono">https://</span> (la IP por HTTP no es contexto seguro).
          </span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <button
          onClick={handleScan}
          disabled={scanning}
          style={{ background: theme.colors.teal, color: '#0A1618', border: 'none', borderRadius: theme.radius.button, padding: '12px 18px', fontWeight: 600, cursor: 'pointer' }}
        >
          {scanning ? 'Buscando…' : 'Escanear'}
        </button>
        <button
          onClick={disconnect}
          style={{ background: 'transparent', color: theme.colors.danger, border: `1px solid ${theme.colors.danger}`, borderRadius: theme.radius.button, padding: '12px 18px', fontWeight: 600, cursor: 'pointer' }}
        >
          Desconectar
        </button>
      </div>

      {msg && <div style={{ fontSize: 13, color: theme.colors.teal, marginBottom: 12 }}>{msg}</div>}

      <div style={{ fontSize: 11, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Estado: {state} {connectedName ? `· ${connectedName}` : ''}</div>
      {loadingKnown && <div style={{ fontSize: 12, color: theme.colors.muted }}>Verificando dispositivos…</div>}

      {knownDevices.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {knownDevices.map(d => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#101F22', border: '1px solid #1A2E32', borderRadius: 12, padding: '12px 16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: theme.colors.text, fontWeight: 600 }}>{d.name}</div>
                <div className="font-mono" style={{ fontSize: 10, color: theme.colors.muted }}>{d.id.slice(0, 17)}</div>
              </div>
              <span style={{ fontSize: 10, color: theme.colors.muted }}>{d.inRange ? 'en rango' : 'no disponible'}</span>
              {connectedName === d.name ? (
                <span style={{ color: theme.colors.green, fontSize: 12, fontWeight: 600 }}>Conectado</span>
              ) : (
                <button onClick={() => handleConnect(d.id)} disabled={!d.inRange} style={{ background: 'rgba(45,212,191,0.12)', color: theme.colors.teal, border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, cursor: d.inRange ? 'pointer' : 'default' }}>
                  Conectar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {ultimaLectura && (
        <div style={{ marginTop: 16, background: '#101F22', border: '1px solid #1A2E32', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.colors.text, marginBottom: 8 }}>Última lectura</div>
          <div className="font-mono" style={{ fontSize: 12, color: theme.colors.muted }}>
            temp:{ultimaLectura.temp ?? '—'} · hr:{ultimaLectura.hr}{ultimaLectura.hrValid ? '' : ' (inválida)'} · spo2:{ultimaLectura.spo2}{ultimaLectura.spo2Valid ? '' : ' (inválida)'} · {new Date(ultimaLectura.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}

      {historial.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 11, color: theme.colors.muted }}>
          Lecturas: {historial.length} (últimas {Math.min(historial.length, 30)})
        </div>
      )}
    </div>
  )
}

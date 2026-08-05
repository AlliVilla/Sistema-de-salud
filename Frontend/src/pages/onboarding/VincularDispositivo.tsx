import { useState } from 'react'
import EcgLine from '../../components/charts/EcgLine'
import { PATIENT } from '../../constants/navigation'
import { theme } from '../../theme'

interface VincularDispositivoProps {
  onNext: () => void
}

export default function VincularDispositivo({ onNext }: VincularDispositivoProps) {
  const [connecting, setConnecting] = useState(false)

  const handleConnect = () => {
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      onNext()
    }, 1800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EcgLine color={theme.colors.teal} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 28, marginBottom: 36 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'rgba(45,212,191,0.08)',
              border: '1px solid rgba(45,212,191,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M6 18 L12 10 L18 26 L24 10 L30 18" stroke="#2DD4BF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="18" cy="18" r="16" stroke="#2DD4BF" strokeWidth="1" strokeOpacity="0.3" />
            </svg>
          </div>
          <h1
            className="font-display"
            style={{ fontSize: 24, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em', marginBottom: 8, textAlign: 'center' }}
          >
            Vincular tu wearable
          </h1>
          <p style={{ fontSize: 14, color: theme.colors.muted, textAlign: 'center', lineHeight: 1.6, maxWidth: 280 }}>
            Activa el Bluetooth en tu dispositivo y mantén presionado el botón lateral hasta que el LED parpadee.
          </p>
        </div>

        <div style={{ border: '1.5px dashed rgba(45,212,191,0.35)', borderRadius: 14, background: '#101F22', padding: '20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>
              Dispositivo encontrado
            </span>
            <span style={{ fontSize: 10, color: theme.colors.teal, fontWeight: 500 }}>{PATIENT.deviceBt}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
              <div className="pulse-ring-2" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(45,212,191,0.3)' }} />
              <div className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(45,212,191,0.5)' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 6,
                  borderRadius: '50%',
                  background: 'rgba(45,212,191,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6.5 6.5l11 11M6.5 17.5l5-5 5-5M12 12l3.5 3.5" />
                </svg>
              </div>
            </div>
            <div>
              <div className="font-display" style={{ fontSize: 16, fontWeight: 600, color: theme.colors.text, marginBottom: 3 }}>
                {PATIENT.device}
              </div>
              <div className="font-mono" style={{ fontSize: 11, color: theme.colors.muted }}>{PATIENT.deviceMac}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 3, alignItems: 'flex-end' }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 6 + i * 4,
                    borderRadius: 2,
                    background: i <= 3 ? theme.colors.teal : 'rgba(45,212,191,0.2)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: theme.colors.muted, textAlign: 'center', marginBottom: 28 }}>
          Batería del dispositivo: <span style={{ color: theme.colors.teal }}>{PATIENT.deviceBattery}%</span>
        </p>
        <div style={{ flex: 1 }} />
        <button
          onClick={handleConnect}
          style={{
            background: connecting ? 'rgba(45,212,191,0.15)' : theme.colors.teal,
            border: 'none',
            borderRadius: theme.radius.button,
            padding: '16px',
            color: connecting ? theme.colors.teal : '#0A1618',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '-0.01em',
          }}
        >
          {connecting ? 'Conectando…' : 'Conectar dispositivo'}
        </button>
      </div>
    </div>
  )
}
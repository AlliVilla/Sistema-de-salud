import { theme } from '../../theme'

export default function LandingHardware() {
  return (
    <section id="dispositivo" style={{ padding: '72px 24px', background: theme.colors.surface }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: theme.colors.teal, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>
            El wearable
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em' }}>
            Conecta tu dispositivo
          </h2>
          <p style={{ fontSize: 14, color: theme.colors.muted, marginTop: 10, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Vincula tu wearable por Bluetooth y VitaCore empieza a registrar tus signos vitales de forma continua.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { label: 'Señales', value: 'FC · SpO₂ · temperatura' },
            { label: 'Conexión', value: 'Bluetooth' },
            { label: 'Registro', value: 'Historial verificable' },
            { label: 'Privacidad', value: 'Datos del paciente' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: theme.colors.surface2,
                borderRadius: theme.radius.card,
                border: `1px solid ${theme.colors.border}`,
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: theme.colors.muted, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
                {item.label}
              </p>
              <p className="font-display" style={{ fontSize: 15, fontWeight: 600, color: theme.colors.text, wordBreak: 'break-word' }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
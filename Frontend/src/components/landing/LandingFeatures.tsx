import { theme } from '../../theme'
import { FEATURES } from './content'

export default function LandingFeatures() {
  return (
    <section id="caracteristicas" style={{ padding: '72px 24px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: theme.colors.teal, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>
            Características
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em' }}>
            Todo lo que necesitas para vigilar tu salud
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {FEATURES.map((feature) => (
            <div
              key={feature.key}
              style={{
                background: theme.colors.surface,
                borderRadius: theme.radius.card,
                border: `1px solid ${theme.colors.border}`,
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `${feature.accent}14`,
                  border: `1px solid ${feature.accent}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: feature.accent,
                }}
              >
                <Icon name={feature.key} size={20} />
              </span>
              <div>
                <h3 className="font-display" style={{ fontSize: 16, fontWeight: 600, color: theme.colors.text, marginBottom: 6 }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 13, color: theme.colors.muted, lineHeight: 1.6 }}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Icon({ name, size }: { name: string; size: number }) {
  const color = 'currentColor'
  switch (name) {
    case 'vitals':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h4l2-6 4 12 2-6h6" />
        </svg>
      )
    case 'ia':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a4 4 0 0 1 4 4 4.5 4.5 0 0 1 0 8v2" />
          <path d="M12 21v-2" />
          <circle cx="12" cy="12" r="9" opacity="0.3" />
        </svg>
      )
    case 'blockchain':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
          <path d="M20 16.5V7.5L12 3 4 7.5v9L12 21z" />
        </svg>
      )
    case 'perfil':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    default:
      return null
  }
}
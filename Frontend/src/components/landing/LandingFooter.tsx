import { theme } from '../../theme'
import { LANDING } from './content'

export default function LandingFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${theme.colors.borderSubtle}`, padding: '28px 24px', background: theme.colors.backdrop }}>
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 36 36" fill="none">
              <path d="M6 18 L12 10 L18 26 L24 10 L30 18" stroke={theme.colors.teal} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text }}>
            {LANDING.product} {LANDING.productSubline}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: theme.colors.muted }}>© 2026 {LANDING.product} · Monitoreo de salud</span>
        </div>
      </div>
    </footer>
  )
}
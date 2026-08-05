// Design tokens. Mirrors the CSS custom properties defined in `src/index.css`.
export const theme = {
  colors: {
    base: '#0A1618',
    backdrop: '#060E10',
    surface: '#101F22',
    surface2: '#17282C',
    border: '#283E42',
    borderSubtle: '#1A2E32',
    borderMuted: '#1E3337',
    text: '#EAF2F1',
    muted: '#7FA09C',
    teal: '#2DD4BF',
    danger: '#FF6B6B',
    amber: '#FFB454',
    violet: '#A78BFA',
    violetSoft: '#C4B5FD',
    violetText: '#B8A4E8',
    green: '#34D399',
  },
  radius: {
    card: 14,
    input: 10,
    button: 12,
  },
} as const
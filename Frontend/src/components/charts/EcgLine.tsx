interface EcgLineProps {
  color: string
}

// Animated green/colored ECG pulse line used as a header accent.
export default function EcgLine({ color }: EcgLineProps) {
  const path =
    'M0,20 L30,20 L35,20 L40,4 L45,36 L50,4 L55,20 L65,20 L70,20 L75,10 L80,30 L85,20 L115,20 L120,20 L125,4 L130,36 L135,4 L140,20 L150,20 L155,20 L160,10 L165,30 L170,20 L200,20 L205,20 L210,4 L215,36 L220,4 L225,20 L235,20 L240,20 L245,10 L250,30 L255,20 L285,20 L290,20 L295,4 L300,36 L305,4 L310,20 L320,20 L325,20 L330,10 L335,30 L340,20 L370,20 L375,20 L380,4 L385,36 L390,4 L395,20 L405,20'

  return (
    <div style={{ width: '100%', height: 40, overflow: 'hidden', flexShrink: 0 }}>
      <svg width="100%" height="40" viewBox="0 0 390 40" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`ecg-${color.replace('#', '')}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="15%" stopColor={color} stopOpacity="0.7" />
            <stop offset="85%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill="none"
          stroke={`url(#ecg-${color.replace('#', '')})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="800"
          strokeDashoffset="0"
          className="ecg-line"
        />
      </svg>
    </div>
  )
}
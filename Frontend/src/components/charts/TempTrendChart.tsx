const points = [36.4, 36.6, 36.5, 36.8, 36.7, 36.9, 36.8, 37.0, 36.9, 37.1]

// Small sparkline for temperature trend.
export default function TempTrendChart() {
  const min = 36.3
  const max = 37.2
  const w = 120
  const h = 36

  const pts = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - ((v - min) / (max - min)) * h
      return `${x},${y}`
    })
    .join(' ')

  const last = points.length - 1
  const lastY = h - ((points[last] - min) / (max - min)) * h

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={pts}
        fill="none"
        stroke="#FFB454"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={w} cy={lastY} r="3" fill="#FFB454" />
    </svg>
  )
}
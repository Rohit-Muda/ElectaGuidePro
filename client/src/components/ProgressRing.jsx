/* Animated SVG progress ring */
export default function ProgressRing({ value = 0, max = 100, size = 120, stroke = 8, color = 'var(--accent)', label }) {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(Math.max(value / max, 0), 1);
  const dash = circ * pct;

  return (
    <figure style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' }}>
      <svg
        width={size} height={size}
        role="img"
        aria-label={label || `${Math.round(pct*100)}% complete`}
        style={{ transform:'rotate(-90deg)' }}
      >
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        <text
          x="50%" y="50%" textAnchor="middle" dy=".35em"
          fill="var(--text)" fontSize={size * 0.22} fontWeight="700"
          fontFamily="Inter, sans-serif"
          style={{ transform:'rotate(90deg)', transformOrigin:'center' }}
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      {label && <figcaption style={{ fontSize:'0.8rem', color:'var(--text-muted)', textAlign:'center' }}>{label}</figcaption>}
    </figure>
  );
}

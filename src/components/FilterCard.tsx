import type { Filter } from '../data/stocks'

const statusColors = {
  pass: '#34d399',
  warn: '#fbbf24',
  fail: '#ef4444',
}

const statusBg = {
  pass: 'rgba(52, 211, 153, 0.06)',
  warn: 'rgba(251, 191, 36, 0.06)',
  fail: 'rgba(239, 68, 68, 0.06)',
}

const statusLabels = {
  pass: 'PASS',
  warn: 'WARN',
  fail: 'FAIL',
}

interface FilterCardProps {
  filter: Filter
}

export default function FilterCard({ filter }: FilterCardProps) {
  const color = statusColors[filter.status]
  const bg = statusBg[filter.status]

  return (
    <div style={{
      background: bg,
      border: `1px solid ${color}30`,
      borderLeft: `3px solid ${color}`,
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.4)', letterSpacing: '0.1em' }}>
          {filter.id}
        </span>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '9px',
          fontWeight: 500,
          color,
          letterSpacing: '0.1em',
          background: `${color}18`,
          padding: '2px 6px',
          border: `1px solid ${color}30`,
        }}>
          {statusLabels[filter.status]}
        </span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500, color: '#f0ece0', marginBottom: '2px' }}>
          {filter.name}
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.4)' }}>
          Seuil: {filter.threshold}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '20px', fontWeight: 300, color }}>
          {filter.value}
        </span>
      </div>
    </div>
  )
}

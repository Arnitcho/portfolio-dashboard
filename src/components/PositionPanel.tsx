import type { Position } from '../data/stocks'

interface PositionPanelProps {
  position: Position
}

const typeColors = {
  Core: { color: '#c9a84c', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.3)' },
  Satellite: { color: '#93c5fd', bg: 'rgba(147,197,253,0.08)', border: 'rgba(147,197,253,0.25)' },
  Watchlist: { color: '#a09880', bg: 'rgba(160,152,128,0.08)', border: 'rgba(160,152,128,0.2)' },
}

export default function PositionPanel({ position }: PositionPanelProps) {
  const col = typeColors[position.type] ?? typeColors.Watchlist

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Type badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          color: col.color,
          background: col.bg,
          border: `1px solid ${col.border}`,
          padding: '4px 12px',
        }}>
          {position.type.toUpperCase()}
        </span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.4)' }}>
          {position.horizon}
        </span>
      </div>

      {/* Fields */}
      {[
        { label: 'SIZING', value: position.sizing },
        { label: 'ENTRÉE', value: position.entryZone },
      ].map(row => (
        <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.1em' }}>
            {row.label}
          </span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#f0ece0' }}>
            {row.value}
          </span>
        </div>
      ))}

      {/* Analytical stop — red box */}
      <div style={{
        background: 'rgba(239,68,68,0.05)',
        border: '1px solid rgba(239,68,68,0.3)',
        padding: '12px 14px',
        marginTop: '4px',
      }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#f87171', letterSpacing: '0.1em', marginBottom: '6px' }}>
          ⚠ STOP ANALYTIQUE
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(248,113,113,0.8)', lineHeight: 1.6 }}>
          {position.analyticalStop}
        </p>
      </div>
    </div>
  )
}

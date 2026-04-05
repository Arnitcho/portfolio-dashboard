import type { Position } from '../data/stocks'

interface PositionPanelProps {
  position: Position
}

const typeColors = {
  Core:      { color: '#c9a84c',  bg: 'rgba(201,168,76,0.1)',    border: 'rgba(201,168,76,0.3)' },
  Satellite: { color: '#93c5fd',  bg: 'rgba(147,197,253,0.08)',  border: 'rgba(147,197,253,0.25)' },
  Watchlist: { color: '#a09880',  bg: 'rgba(160,152,128,0.08)',  border: 'rgba(160,152,128,0.2)' },
}

export default function PositionPanel({ position }: PositionPanelProps) {
  const col = typeColors[position.type] ?? typeColors.Watchlist

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Type + horizon badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: col.color,
          background: col.bg,
          border: `1px solid ${col.border}`,
          padding: '5px 14px',
          borderRadius: '999px',
        }}>
          {position.type.toUpperCase()}
        </span>
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: '10px',
          color: 'rgba(240,236,224,0.4)', letterSpacing: '0.06em',
        }}>
          {position.horizon}
        </span>
      </div>

      {/* Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { label: 'SIZING', value: position.sizing },
          { label: 'ZONE D\'ENTRÉE', value: position.entryZone },
        ].map(row => (
          <div key={row.label} style={{
            background: 'rgba(240,236,224,0.03)',
            border: '1px solid rgba(201,168,76,0.1)',
            borderRadius: '10px',
            padding: '14px 16px',
          }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.3)', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
              {row.label}
            </span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#f0ece0', fontWeight: 500 }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Analytical stop — red box */}
      <div style={{
        background: 'rgba(239,68,68,0.05)',
        border: '1px solid rgba(239,68,68,0.25)',
        borderLeft: '3px solid rgba(239,68,68,0.6)',
        borderRadius: '10px',
        padding: '16px 18px',
      }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#f87171', letterSpacing: '0.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>⚠</span> STOP ANALYTIQUE
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(248,113,113,0.75)', lineHeight: 1.7 }}>
          {position.analyticalStop}
        </p>
      </div>
    </div>
  )
}

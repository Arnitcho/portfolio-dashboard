import type { Position } from '../data/stocks'

interface PositionPanelProps {
  position: Position
}

const typeColors = {
  Core:      { color: '#f0b429',  bg: 'rgba(240,180,41,0.1)',   border: 'rgba(240,180,41,0.3)' },
  Satellite: { color: '#93c5fd',  bg: 'rgba(147,197,253,0.08)', border: 'rgba(147,197,253,0.2)' },
  Watchlist: { color: '#818cf8',  bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.2)' },
}

export default function PositionPanel({ position }: PositionPanelProps) {
  const col = typeColors[position.type] ?? typeColors.Watchlist

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Type + horizon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em',
          color: col.color, background: col.bg, border: `1px solid ${col.border}`,
          padding: '5px 14px', borderRadius: '999px',
        }}>
          {position.type.toUpperCase()}
        </span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#4a5568', letterSpacing: '0.06em' }}>
          {position.horizon}
        </span>
      </div>

      {/* Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[
          { label: 'SIZING', value: position.sizing },
          { label: 'ZONE D\'ENTRÉE', value: position.entryZone },
        ].map(row => (
          <div key={row.label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', padding: '14px 16px',
          }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#4a5568', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
              {row.label}
            </span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#e8eaf0', fontWeight: 500 }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Analytical stop */}
      <div style={{
        background: 'rgba(239,68,68,0.05)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderLeft: '3px solid rgba(239,68,68,0.5)',
        borderRadius: '10px', padding: '16px 18px',
      }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#f87171', letterSpacing: '0.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>⚠</span> STOP ANALYTIQUE
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(248,113,113,0.7)', lineHeight: 1.7 }}>
          {position.analyticalStop}
        </p>
      </div>
    </div>
  )
}

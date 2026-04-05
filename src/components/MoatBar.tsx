import type { MoatCriterion } from '../data/stocks'

interface MoatBarProps {
  moat: MoatCriterion[]
  score: number
  compact?: boolean
}

export default function MoatBar({ moat, score, compact = false }: MoatBarProps) {
  if (compact) {
    return (
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {moat.map((m, i) => (
          <div
            key={i}
            title={m.name}
            style={{
              width: '8px',
              height: '8px',
              background: m.score === 1 ? '#c9a84c' : 'rgba(201,168,76,0.15)',
              border: m.score === 0 ? '1px solid rgba(201,168,76,0.2)' : 'none',
            }}
          />
        ))}
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.45)', marginLeft: '4px' }}>
          {score}/6
        </span>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '13px', color: 'rgba(240,236,224,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Fossilité économique
        </span>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '16px',
          fontWeight: 300,
          color: score === 6 ? '#c9a84c' : score >= 4 ? '#fbbf24' : '#f87171',
        }}>
          {score}<span style={{ fontSize: '11px', color: 'rgba(240,236,224,0.3)', marginLeft: '1px' }}>/6</span>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {moat.map((criterion, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '6px',
                height: '6px',
                flexShrink: 0,
                background: criterion.score === 1 ? '#c9a84c' : 'transparent',
                border: criterion.score === 0 ? '1px solid rgba(201,168,76,0.3)' : 'none',
              }} />
              <span style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                color: criterion.score === 1 ? '#f0ece0' : 'rgba(240,236,224,0.35)',
              }}>
                {criterion.name}
              </span>
            </div>
            {/* Bar */}
            <div style={{ width: '80px', height: '2px', background: 'rgba(201,168,76,0.12)', flexShrink: 0 }}>
              <div style={{
                height: '100%',
                width: criterion.score === 1 ? '100%' : '0%',
                background: '#c9a84c',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Score bar */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '4px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '3px',
              background: i < score ? '#c9a84c' : 'rgba(201,168,76,0.15)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}

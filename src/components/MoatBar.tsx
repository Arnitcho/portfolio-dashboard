import type { MoatCriterion } from '../data/stocks'

interface MoatBarProps {
  moat: MoatCriterion[]
  score: number
  compact?: boolean
}

export default function MoatBar({ moat, score, compact = false }: MoatBarProps) {
  if (compact) {
    return (
      <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
        {moat.map((m, i) => (
          <div
            key={i}
            title={m.name}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '3px',
              background: m.score === 1 ? '#c9a84c' : 'rgba(201,168,76,0.12)',
              border: m.score === 0 ? '1px solid rgba(201,168,76,0.2)' : 'none',
              transition: 'background 0.2s',
            }}
          />
        ))}
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,236,224,0.4)', marginLeft: '6px' }}>
          {score}/6
        </span>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', color: 'rgba(240,236,224,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Fossé concurrentiel
        </span>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '20px',
          fontWeight: 500,
          color: score === 6 ? '#c9a84c' : score >= 4 ? '#fbbf24' : '#f87171',
        }}>
          {score}<span style={{ fontSize: '13px', color: 'rgba(240,236,224,0.25)', marginLeft: '2px' }}>/6</span>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {moat.map((criterion, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '2px', flexShrink: 0,
              background: criterion.score === 1 ? '#c9a84c' : 'transparent',
              border: criterion.score === 0 ? '1px solid rgba(201,168,76,0.25)' : 'none',
            }} />
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '13px', flex: 1,
              color: criterion.score === 1 ? '#f0ece0' : 'rgba(240,236,224,0.3)',
            }}>
              {criterion.name}
            </span>
            <div style={{ width: '96px', height: '3px', background: 'rgba(201,168,76,0.1)', borderRadius: '2px', flexShrink: 0 }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                width: criterion.score === 1 ? '100%' : '0%',
                background: 'linear-gradient(90deg, #c9a84c, rgba(201,168,76,0.6))',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Score segments */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '5px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i < score ? '#c9a84c' : 'rgba(201,168,76,0.12)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  )
}

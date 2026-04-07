import type { MoatCriterion } from '../data/stocks'

const GOLD = '#f0b429'

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
              width: '10px', height: '10px', borderRadius: '3px',
              background: m.score === 1 ? GOLD : 'rgba(240,180,41,0.1)',
              border: m.score === 0 ? '1px solid rgba(240,180,41,0.15)' : 'none',
              transition: 'background 0.2s',
            }}
          />
        ))}
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4a5568', marginLeft: '6px' }}>
          {score}/6
        </span>
      </div>
    )
  }

  const scoreColor = score === 6 ? GOLD : score >= 4 ? '#f59e0b' : '#f87171'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', color: '#4a5568', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Fossé concurrentiel
        </span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '20px', fontWeight: 500, color: scoreColor }}>
          {score}<span style={{ fontSize: '13px', color: '#4a5568', marginLeft: '2px' }}>/6</span>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {moat.map((criterion, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '2px', flexShrink: 0,
              background: criterion.score === 1 ? GOLD : 'transparent',
              border: criterion.score === 0 ? '1px solid rgba(240,180,41,0.2)' : 'none',
            }} />
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '13px', flex: 1,
              color: criterion.score === 1 ? '#e8eaf0' : '#4a5568',
            }}>
              {criterion.name}
            </span>
            <div style={{ width: '96px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', flexShrink: 0 }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                width: criterion.score === 1 ? '100%' : '0%',
                background: `linear-gradient(90deg, ${GOLD}, #ffd166)`,
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
            background: i < score ? GOLD : 'rgba(240,180,41,0.1)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  )
}

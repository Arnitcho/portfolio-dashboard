import type { DCFScenario } from '../data/stocks'

interface DCFScenariosProps {
  scenarios: DCFScenario[]
  fcfPerShare: number
  g: number
  currency?: string
}

const scenarioColors = {
  Bear: { accent: '#f87171', bg: 'rgba(248,113,113,0.05)', border: 'rgba(248,113,113,0.25)' },
  Base: { accent: '#c9a84c', bg: 'rgba(201,168,76,0.06)', border: 'rgba(201,168,76,0.3)' },
  Bull: { accent: '#34d399', bg: 'rgba(52,211,153,0.05)', border: 'rgba(52,211,153,0.25)' },
}

const fcfYears = [1, 2, 3, 5, 7, 10]

export default function DCFScenarios({ scenarios, fcfPerShare, g, currency = 'USD' }: DCFScenariosProps) {
  const curr = currency === 'JPY' ? '¥' : currency === 'GBP' ? '£' : currency === 'AUD' ? 'A$' : '$'

  function fcfAt(year: number) {
    return fcfPerShare * Math.pow(1 + g, year)
  }

  return (
    <div>
      {/* Scenario cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {scenarios.map(s => {
          const key = s.label as keyof typeof scenarioColors
          const col = scenarioColors[key] ?? scenarioColors.Base
          return (
            <div key={s.label} style={{
              background: col.bg,
              border: `1px solid ${col.border}`,
              padding: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.12em', color: col.accent }}>
                  {s.label.toUpperCase()}
                </span>
                <span style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  color: s.marginOfSafety >= 0 ? '#34d399' : '#f87171',
                }}>
                  {s.marginOfSafety >= 0 ? '+' : ''}{s.marginOfSafety}%
                </span>
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 300, color: col.accent, marginBottom: '8px' }}>
                {s.value}
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(240,236,224,0.45)', lineHeight: 1.5 }}>
                {s.hypothesis}
              </p>
            </div>
          )
        })}
      </div>

      {/* FCF projection table */}
      <div style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.4)', letterSpacing: '0.1em' }}>
            PROJECTION FCF/SHARE — g = {(g * 100).toFixed(0)}%/an
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${fcfYears.length + 1}, 1fr)` }}>
          <div style={{ padding: '8px 16px', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.3)' }}>
            Année
          </div>
          {fcfYears.map(y => (
            <div key={y} style={{ padding: '8px 12px', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.3)', textAlign: 'right' }}>
              N+{y}
            </div>
          ))}
          <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(201,168,76,0.1)', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.5)' }}>
            FCF/share
          </div>
          {fcfYears.map(y => (
            <div key={y} style={{ padding: '8px 12px', borderTop: '1px solid rgba(201,168,76,0.1)', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#c9a84c', textAlign: 'right' }}>
              {curr}{fcfAt(y).toFixed(currency === 'JPY' ? 0 : 2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

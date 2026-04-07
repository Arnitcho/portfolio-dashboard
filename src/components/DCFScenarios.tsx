import type { DCFScenario } from '../data/stocks'

interface DCFScenariosProps {
  scenarios: DCFScenario[]
  fcfPerShare: number
  g: number
  currency?: string
}

const scenarioColors = {
  Bear: { accent: '#f87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.18)' },
  Base: { accent: '#f0b429', bg: 'rgba(240,180,41,0.06)',  border: 'rgba(240,180,41,0.18)' },
  Bull: { accent: '#10b981', bg: 'rgba(16,185,129,0.06)',  border: 'rgba(16,185,129,0.18)' },
}

const fcfYears = [1, 2, 3, 5, 7, 10]

export default function DCFScenarios({ scenarios, fcfPerShare, g, currency = 'USD' }: DCFScenariosProps) {
  const curr = currency === 'JPY' ? '¥' : currency === 'GBP' ? '£' : currency === 'AUD' ? 'A$' : '$'

  function fcfAt(year: number) {
    return fcfPerShare * Math.pow(1 + g, year)
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {scenarios.map(s => {
          const key = s.label as keyof typeof scenarioColors
          const col = scenarioColors[key] ?? scenarioColors.Base
          return (
            <div key={s.label} style={{
              background: col.bg, border: `1px solid ${col.border}`, borderRadius: '12px', padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.12em', color: col.accent }}>
                  {s.label.toUpperCase()}
                </span>
                <span style={{
                  fontFamily: 'DM Mono, monospace', fontSize: '10px', fontWeight: 600,
                  color: s.marginOfSafety >= 0 ? '#10b981' : '#f87171',
                  background: s.marginOfSafety >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(248,113,113,0.1)',
                  padding: '2px 8px', borderRadius: '999px',
                }}>
                  {s.marginOfSafety >= 0 ? '+' : ''}{s.marginOfSafety}%
                </span>
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: col.accent, lineHeight: 1, marginBottom: '10px' }}>
                {s.value}
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#4a5568', lineHeight: 1.6 }}>
                {s.hypothesis}
              </p>
            </div>
          )
        })}
      </div>

      {/* FCF projection table */}
      <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(240,180,41,0.03)' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,180,41,0.5)', letterSpacing: '0.12em' }}>
            PROJECTION FCF/SHARE — g = {(g * 100).toFixed(0)}%/an
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${fcfYears.length + 1}, 1fr)` }}>
          <div style={{ padding: '10px 18px', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#4a5568' }}>
            Année
          </div>
          {fcfYears.map(y => (
            <div key={y} style={{ padding: '10px 12px', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#4a5568', textAlign: 'right' }}>
              N+{y}
            </div>
          ))}
          <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.04)', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#8892a4' }}>
            FCF/sh
          </div>
          {fcfYears.map(y => (
            <div key={y} style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.04)', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#f0b429', textAlign: 'right' }}>
              {curr}{fcfAt(y).toFixed(currency === 'JPY' ? 0 : 2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

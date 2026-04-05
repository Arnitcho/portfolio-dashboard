import { useState } from 'react'
import { calcFCFTarget, calcUpside, getUpsideColor, upsideColorMap, getStatusLabel } from '../utils/calculations'

interface FCFCalculatorProps {
  defaultPrice: number
  defaultFCF: number
  defaultG: number
  currency?: string
}

export default function FCFCalculator({ defaultPrice, defaultFCF, defaultG, currency = 'USD' }: FCFCalculatorProps) {
  const [price, setPrice] = useState(defaultPrice)
  const [fcf, setFcf] = useState(defaultFCF)
  const [g, setG] = useState(defaultG)

  const curr = currency === 'JPY' ? '¥' : currency === 'GBP' ? '£' : currency === 'AUD' ? 'A$' : '$'

  const target = calcFCFTarget(fcf, g)
  const upside = calcUpside(price, target)
  const color = upsideColorMap[getUpsideColor(upside)]
  const label = getStatusLabel(upside)

  const sliders = [
    {
      label: 'Prix actuel',
      value: price,
      min: currency === 'JPY' ? 10000 : 1,
      max: currency === 'JPY' ? 200000 : defaultPrice * 3,
      step: currency === 'JPY' ? 100 : 0.5,
      format: (v: number) => `${curr}${currency === 'JPY' ? v.toLocaleString() : v.toFixed(2)}`,
      onChange: setPrice,
    },
    {
      label: 'FCF/share',
      value: fcf,
      min: currency === 'JPY' ? 100 : 0.1,
      max: currency === 'JPY' ? defaultFCF * 4 : defaultFCF * 3,
      step: currency === 'JPY' ? 10 : 0.1,
      format: (v: number) => `${curr}${currency === 'JPY' ? v.toLocaleString() : v.toFixed(2)}`,
      onChange: setFcf,
    },
    {
      label: 'Croissance (g)',
      value: g,
      min: 0.02,
      max: 0.25,
      step: 0.005,
      format: (v: number) => `${(v * 100).toFixed(1)}%`,
      onChange: setG,
    },
  ]

  return (
    <div>
      {/* Result header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        padding: '20px 24px',
        background: 'rgba(201,168,76,0.04)',
        border: '1px solid rgba(201,168,76,0.15)',
        borderRadius: '12px',
        marginBottom: '24px',
      }}>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.4)', letterSpacing: '0.12em', marginBottom: '6px' }}>
            PRIX CIBLE FCF
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '40px', fontWeight: 300, color: '#c9a84c', lineHeight: 1 }}>
            {curr}{currency === 'JPY' ? Math.round(target).toLocaleString() : target.toFixed(2)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '24px', fontWeight: 300, color, marginBottom: '6px' }}>
            {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
          </div>
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em',
            color, background: `${color}15`, padding: '3px 10px',
            border: `1px solid ${color}30`, borderRadius: '999px',
          }}>
            {label}
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {sliders.map(s => (
          <div key={s.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(240,236,224,0.6)' }}>
                {s.label}
              </span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', fontWeight: 500, color: '#c9a84c' }}>
                {s.format(s.value)}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={e => s.onChange(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#c9a84c' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.2)' }}>
                {s.format(s.min)}
              </span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.2)' }}>
                {s.format(s.max)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Formula note */}
      <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: '8px' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.3)', letterSpacing: '0.05em' }}>
          TARGET = FCF × (1+g)³ / (0.15 − g)
        </span>
      </div>
    </div>
  )
}

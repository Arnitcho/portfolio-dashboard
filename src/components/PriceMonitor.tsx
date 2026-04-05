import { RefreshCw } from 'lucide-react'
import { usePrices } from '../hooks/usePrices'
import { stocks } from '../data/stocks'
import { calcFCFTarget, calcUpside, getUpsideColor, upsideColorMap, getStatusLabel } from '../utils/calculations'
import { useLocalStorage } from '../hooks/useLocalStorage'
import CompanyLogo from './CompanyLogo'

interface PriceMonitorProps {
  onSelectStock: (id: string) => void
}

function StatusDot({ status }: { status: string }) {
  const map = {
    live:   { color: '#34d399', label: 'LIVE',   glow: true },
    cached: { color: '#fbbf24', label: 'CACHED',  glow: false },
    error:  { color: '#ef4444', label: 'ERROR',   glow: false },
    idle:   { color: '#6b7280', label: 'IDLE',    glow: false },
  }
  const e = map[status as keyof typeof map] ?? map.idle
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: e.color,
        boxShadow: e.glow ? `0 0 8px ${e.color}` : 'none',
      }} />
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: e.color, letterSpacing: '0.1em' }}>
        {e.label}
      </span>
    </div>
  )
}

export default function PriceMonitor({ onSelectStock }: PriceMonitorProps) {
  const { prices, status, lastUpdated, fetchPrices } = usePrices()
  const [manualPrices, setManualPrices] = useLocalStorage<Record<string, string>>('pm_manual_prices', {})

  function handleInput(id: string, val: string) {
    setManualPrices({ ...manualPrices, [id]: val })
  }

  function getPrice(stock: typeof stocks[0]): number {
    const m = manualPrices[stock.id]
    if (m && m !== '') { const n = parseFloat(m); if (!isNaN(n) && n > 0) return n }
    return prices[stock.id] ?? stock.currentPrice
  }

  return (
    <div style={{ paddingTop: '56px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '56px', fontWeight: 300, color: '#f0ece0', lineHeight: 1, marginBottom: '10px' }}>
            Price Monitor
          </h1>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(201,168,76,0.55)', letterSpacing: '0.12em' }}>
            SAISIE MANUELLE · AUTO-FETCH 15 MIN · CIBLE = FCF × (1+g)³ / (0.15 − g)
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <StatusDot status={status} />
          {lastUpdated && (
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.25)' }}>
              Mis à jour {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={fetchPrices}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '8px',
              color: '#c9a84c',
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <RefreshCw size={13} /> REFRESH
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 2fr 1.5fr 1fr 2fr 2fr 2.5fr',
          padding: '14px 28px',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          background: 'rgba(201,168,76,0.04)',
        }}>
          {['TICKER', 'NOM', 'PRIX ACTUEL', 'FCF/SHARE', 'G%', 'CIBLE FCF', 'UPSIDE', 'STATUT'].map((h, i) => (
            <div key={h} style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              letterSpacing: '0.12em',
              color: 'rgba(201,168,76,0.55)',
              textAlign: i >= 2 ? 'right' : 'left',
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {stocks.map(stock => {
          const currentPrice = getPrice(stock)
          const target = calcFCFTarget(stock.fcfPerShare, stock.fcfGrowthRate)
          const upside = calcUpside(currentPrice, target)
          const color = upsideColorMap[getUpsideColor(upside)]
          const label = getStatusLabel(upside)
          const curr = stock.currency === 'JPY' ? '¥' : stock.currency === 'GBP' ? '£' : stock.currency === 'AUD' ? 'A$' : '$'

          return (
            <div
              key={stock.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 2fr 1.5fr 1fr 2fr 2fr 2.5fr',
                padding: '0 28px',
                borderBottom: '1px solid rgba(201,168,76,0.07)',
                alignItems: 'center',
                minHeight: '64px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Ticker + logo */}
              <div
                onClick={() => onSelectStock(stock.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              >
                <CompanyLogo ticker={stock.id} size={28} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', fontWeight: 600, color: '#c9a84c' }}>
                  {stock.id}
                </span>
              </div>

              {/* Name */}
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(240,236,224,0.65)' }}>
                {stock.name}
              </div>

              {/* Price input */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: 'rgba(201,168,76,0.07)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  minWidth: '90px',
                }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(201,168,76,0.55)' }}>{curr}</span>
                  <input
                    type="number"
                    value={manualPrices[stock.id] ?? ''}
                    placeholder={String(currentPrice)}
                    onChange={e => handleInput(stock.id, e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#f0ece0', width: '72px', textAlign: 'right' }}
                  />
                </div>
              </div>

              {/* FCF/share */}
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'rgba(240,236,224,0.55)', textAlign: 'right' }}>
                {curr}{stock.currency === 'JPY' ? stock.fcfPerShare.toLocaleString() : stock.fcfPerShare.toFixed(2)}
              </div>

              {/* g% */}
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'rgba(240,236,224,0.55)', textAlign: 'right' }}>
                {(stock.fcfGrowthRate * 100).toFixed(0)}%
              </div>

              {/* Target */}
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', fontWeight: 600, color: '#c9a84c', textAlign: 'right' }}>
                {curr}{stock.currency === 'JPY' ? Math.round(target).toLocaleString() : target.toFixed(2)}
              </div>

              {/* Upside */}
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '15px', fontWeight: 600, color, textAlign: 'right' }}>
                {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
              </div>

              {/* Status */}
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.07em',
                  color, background: `${color}14`, border: `1px solid ${color}30`,
                  padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
                }}>
                  {label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '32px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {[
          { color: '#34d399', label: '>40% — Forte décote' },
          { color: '#6ee7b7', label: '20–40% — Décote' },
          { color: '#a7f3d0', label: '5–20% — Légère décote' },
          { color: '#fbbf24', label: '±5% — Juste prix' },
          { color: '#f97316', label: '-5 à -20% — Prime' },
          { color: '#f87171', label: '-20 à -35% — Prime élevée' },
          { color: '#ef4444', label: '<-35% — Forte prime' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.35)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

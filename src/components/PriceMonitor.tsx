import { RefreshCw } from 'lucide-react'
import { usePrices } from '../hooks/usePrices'
import { stocks } from '../data/stocks'
import { calcFCFTarget, calcUpside, getUpsideColor, upsideColorMap, getStatusLabel } from '../utils/calculations'
import { useLocalStorage } from '../hooks/useLocalStorage'
import CompanyLogo from './CompanyLogo'

interface PriceMonitorProps {
  onSelectStock: (id: string) => void
}

const GOLD = '#f0b429'

function StatusDot({ status }: { status: string }) {
  const map = {
    live:   { color: '#10b981', label: 'LIVE',   glow: true },
    cached: { color: '#f59e0b', label: 'CACHED',  glow: false },
    error:  { color: '#ef4444', label: 'ERROR',   glow: false },
    idle:   { color: '#4a5568', label: 'IDLE',    glow: false },
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
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '56px', fontWeight: 300, color: '#e8eaf0', lineHeight: 1, marginBottom: '10px' }}>
            Price Monitor
          </h1>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,180,41,0.5)', letterSpacing: '0.12em' }}>
            SAISIE MANUELLE · AUTO-FETCH 15 MIN · CIBLE = FCF × (1+g)³ / (0.15 − g)
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <StatusDot status={status} />
          {lastUpdated && (
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#4a5568' }}>
              Mis à jour {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={fetchPrices}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              background: 'rgba(240,180,41,0.08)',
              border: '1px solid rgba(240,180,41,0.25)',
              borderRadius: '8px',
              color: GOLD,
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,180,41,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(240,180,41,0.08)')}
          >
            <RefreshCw size={13} /> REFRESH
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 2fr 1.5fr 1fr 2fr 2fr 2.5fr',
          padding: '14px 28px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(240,180,41,0.04)',
        }}>
          {['TICKER', 'NOM', 'PRIX ACTUEL', 'FCF/SHARE', 'G%', 'CIBLE FCF', 'UPSIDE', 'STATUT'].map((h, i) => (
            <div key={h} style={{
              fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.12em',
              color: 'rgba(240,180,41,0.5)', textAlign: i >= 2 ? 'right' : 'left',
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
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                alignItems: 'center',
                minHeight: '64px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,180,41,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Ticker + logo */}
              <div onClick={() => onSelectStock(stock.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <CompanyLogo ticker={stock.id} size={28} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', fontWeight: 600, color: GOLD }}>
                  {stock.id}
                </span>
              </div>

              {/* Name */}
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#8892a4' }}>
                {stock.name}
              </div>

              {/* Price input */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '6px 10px', minWidth: '90px',
                }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4a5568' }}>{curr}</span>
                  <input
                    type="number"
                    value={manualPrices[stock.id] ?? ''}
                    placeholder={String(currentPrice)}
                    onChange={e => handleInput(stock.id, e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#e8eaf0', width: '72px', textAlign: 'right' }}
                  />
                </div>
              </div>

              {/* FCF/share */}
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#8892a4', textAlign: 'right' }}>
                {curr}{stock.currency === 'JPY' ? stock.fcfPerShare.toLocaleString() : stock.fcfPerShare.toFixed(2)}
              </div>

              {/* g% */}
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#8892a4', textAlign: 'right' }}>
                {(stock.fcfGrowthRate * 100).toFixed(0)}%
              </div>

              {/* Target */}
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', fontWeight: 600, color: GOLD, textAlign: 'right' }}>
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
                  color, background: `${color}12`, border: `1px solid ${color}28`,
                  padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
                }}>
                  {label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

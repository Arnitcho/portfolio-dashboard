import { usePrices } from '../hooks/usePrices'
import { stocks } from '../data/stocks'
import { calcFCFTarget, calcUpside, getUpsideColor, upsideColorMap, getStatusLabel } from '../utils/calculations'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface PriceMonitorProps {
  onSelectStock: (id: string) => void
}

function StatusDot({ status }: { status: string }) {
  const colors = { live: '#34d399', cached: '#fbbf24', error: '#ef4444', idle: '#6b7280' }
  const labels = { live: 'LIVE', cached: 'CACHED', error: 'ERROR', idle: 'IDLE' }
  const color = colors[status as keyof typeof colors] ?? colors.idle
  const label = labels[status as keyof typeof labels] ?? 'IDLE'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: color,
        boxShadow: status === 'live' ? `0 0 6px ${color}` : 'none',
      }} />
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color, letterSpacing: '0.1em' }}>{label}</span>
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
    const manual = manualPrices[stock.id]
    if (manual && manual !== '') {
      const n = parseFloat(manual)
      if (!isNaN(n) && n > 0) return n
    }
    return prices[stock.id] ?? stock.currentPrice
  }

  const headers = [
    { label: 'TICKER', align: 'left' },
    { label: 'NOM', align: 'left' },
    { label: 'PRIX ACTUEL', align: 'right' },
    { label: 'FCF/SHARE', align: 'right' },
    { label: 'G%', align: 'right' },
    { label: 'CIBLE FCF', align: 'right' },
    { label: 'UPSIDE', align: 'right' },
    { label: 'STATUT', align: 'center' },
  ]

  return (
    <div style={{ paddingTop: '36px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300, color: '#f0ece0', marginBottom: '6px' }}>
            Price Monitor
          </h1>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.1em' }}>
            SAISIE MANUELLE · AUTO-FETCH 15 MIN · CIBLE = FCF × (1+g)³ / (0.15 − g)
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <StatusDot status={status} />
          {lastUpdated && (
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.3)' }}>
              {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={fetchPrices}
            style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.3)',
              color: '#c9a84c',
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              letterSpacing: '0.1em',
              padding: '5px 14px',
              cursor: 'pointer',
            }}
          >
            ↺ REFRESH
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid rgba(201,168,76,0.18)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(201,168,76,0.04)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
              {headers.map(h => (
                <th key={h.label} style={{
                  padding: '9px 16px',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  color: 'rgba(201,168,76,0.6)',
                  textAlign: h.align as 'left' | 'right' | 'center',
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                }}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => {
              const currentPrice = getPrice(stock)
              const target = calcFCFTarget(stock.fcfPerShare, stock.fcfGrowthRate)
              const upside = calcUpside(currentPrice, target)
              const color = upsideColorMap[getUpsideColor(upside)]
              const label = getStatusLabel(upside)
              const curr = stock.currency === 'JPY' ? '¥' : stock.currency === 'GBP' ? '£' : stock.currency === 'AUD' ? 'A$' : '$'

              return (
                <tr
                  key={stock.id}
                  style={{ borderBottom: '1px solid rgba(201,168,76,0.07)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Ticker */}
                  <td
                    onClick={() => onSelectStock(stock.id)}
                    style={{ padding: '10px 16px', fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 500, color: '#c9a84c', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    {stock.id}
                  </td>
                  {/* Name */}
                  <td style={{ padding: '10px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(240,236,224,0.7)', whiteSpace: 'nowrap' }}>
                    {stock.name}
                  </td>
                  {/* Current Price input */}
                  <td style={{ padding: '6px 16px', textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      background: 'rgba(201,168,76,0.06)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      padding: '4px 8px',
                      minWidth: '80px',
                    }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(201,168,76,0.6)' }}>{curr}</span>
                      <input
                        type="number"
                        value={manualPrices[stock.id] ?? ''}
                        placeholder={String(currentPrice)}
                        onChange={e => handleInput(stock.id, e.target.value)}
                        style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#f0ece0', width: '70px', textAlign: 'right' }}
                      />
                    </div>
                  </td>
                  {/* FCF/share */}
                  <td style={{ padding: '10px 16px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,236,224,0.6)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {curr}{stock.currency === 'JPY' ? stock.fcfPerShare.toLocaleString() : stock.fcfPerShare.toFixed(2)}
                  </td>
                  {/* g% */}
                  <td style={{ padding: '10px 16px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,236,224,0.6)', textAlign: 'right' }}>
                    {(stock.fcfGrowthRate * 100).toFixed(0)}%
                  </td>
                  {/* Target */}
                  <td style={{ padding: '10px 16px', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#c9a84c', textAlign: 'right', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {curr}{stock.currency === 'JPY' ? Math.round(target).toLocaleString() : target.toFixed(2)}
                  </td>
                  {/* Upside */}
                  <td style={{ padding: '10px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', fontWeight: 500, color }}>
                      {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
                    </span>
                  </td>
                  {/* Status badge */}
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <span style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '8px',
                      letterSpacing: '0.07em',
                      color,
                      background: `${color}12`,
                      border: `1px solid ${color}30`,
                      padding: '3px 7px',
                      whiteSpace: 'nowrap',
                    }}>
                      {label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {[
          { color: '#34d399', label: '>40% — Forte décote' },
          { color: '#6ee7b7', label: '20–40% — Décote' },
          { color: '#a7f3d0', label: '5–20% — Légère décote' },
          { color: '#fbbf24', label: '±5% — Juste prix' },
          { color: '#f97316', label: '-5 à -20% — Légère prime' },
          { color: '#f87171', label: '-20 à -35% — Prime' },
          { color: '#ef4444', label: '<-35% — Forte prime' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', background: l.color }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.4)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

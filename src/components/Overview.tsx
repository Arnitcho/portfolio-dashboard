import { stocks } from '../data/stocks'
import { calcFCFTarget, calcUpside, getUpsideColor, upsideColorMap, getStatusLabel } from '../utils/calculations'
import MoatBar from './MoatBar'
import type { Stock, FilterStatus } from '../data/stocks'

interface OverviewProps {
  onSelectStock: (id: string) => void
}

const GOLD = '#c9a84c'

function VerdictBadge({ verdict }: { verdict: string }) {
  const config = {
    buy: { label: 'ACHAT', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
    watch: { label: 'SURVEIL.', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
    watchlist: { label: 'WATCHLIST', color: '#a09880', bg: 'rgba(160,152,128,0.1)', border: 'rgba(160,152,128,0.3)' },
  }
  const c = config[verdict as keyof typeof config] ?? config.watchlist
  return (
    <span style={{
      fontFamily: 'DM Mono, monospace',
      fontSize: '8px',
      letterSpacing: '0.1em',
      color: c.color,
      background: c.bg,
      border: `1px solid ${c.border}`,
      padding: '2px 7px',
      whiteSpace: 'nowrap',
    }}>
      {c.label}
    </span>
  )
}

function FilterDots({ filters }: { filters: Stock['filters'] }) {
  const colors: Record<FilterStatus, string> = { pass: '#34d399', warn: '#fbbf24', fail: '#ef4444' }
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {filters.map(f => (
        <div
          key={f.id}
          title={`${f.name}: ${f.value} (${f.threshold})`}
          style={{ width: '7px', height: '7px', borderRadius: '50%', background: colors[f.status], flexShrink: 0 }}
        />
      ))}
    </div>
  )
}

function StockRow({ stock, onSelect }: { stock: Stock; onSelect: () => void }) {
  const target = calcFCFTarget(stock.fcfPerShare, stock.fcfGrowthRate)
  const upside = calcUpside(stock.currentPrice, target)
  const color = upsideColorMap[getUpsideColor(upside)]
  const curr = stock.currency === 'JPY' ? '¥' : stock.currency === 'GBP' ? '£' : stock.currency === 'AUD' ? 'A$' : '$'
  const label = getStatusLabel(upside)

  return (
    <tr
      onClick={onSelect}
      style={{ cursor: 'pointer', borderBottom: '1px solid rgba(201,168,76,0.08)', transition: 'background 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.04)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Ticker + Name */}
      <td style={{ padding: '11px 16px', whiteSpace: 'nowrap' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 500, color: GOLD }}>{stock.id}</div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(240,236,224,0.55)', marginTop: '1px' }}>{stock.name}</div>
      </td>
      {/* Verdict */}
      <td style={{ padding: '11px 12px' }}>
        <VerdictBadge verdict={stock.verdict} />
      </td>
      {/* Filter dots */}
      <td style={{ padding: '11px 12px' }}>
        <FilterDots filters={stock.filters} />
      </td>
      {/* Moat bar */}
      <td style={{ padding: '11px 12px' }}>
        <MoatBar moat={stock.moat} score={stock.moatScore} compact />
      </td>
      {/* FCF/share */}
      <td style={{ padding: '11px 12px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,236,224,0.65)', textAlign: 'right', whiteSpace: 'nowrap' }}>
        {curr}{stock.currency === 'JPY' ? stock.fcfPerShare.toLocaleString() : stock.fcfPerShare.toFixed(2)}
      </td>
      {/* Entry zone */}
      <td style={{ padding: '11px 12px', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.45)', whiteSpace: 'nowrap' }}>
        {stock.entryZone}
      </td>
      {/* FCF Target */}
      <td style={{ padding: '11px 12px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: GOLD, textAlign: 'right', whiteSpace: 'nowrap' }}>
        {curr}{stock.currency === 'JPY' ? Math.round(target).toLocaleString() : target.toFixed(2)}
      </td>
      {/* Upside */}
      <td style={{ padding: '11px 16px', textAlign: 'right' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 500, color, whiteSpace: 'nowrap' }}>
          {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', color, opacity: 0.7, letterSpacing: '0.05em', marginTop: '1px' }}>
          {label}
        </div>
      </td>
    </tr>
  )
}

function SectionTable({ title, stocks, onSelect }: { title: string; stocks: Stock[]; onSelect: (id: string) => void }) {
  if (stocks.length === 0) return null

  const headers = ['TICKER / NOM', 'VERDICT', 'L1–L5', 'MOAT', 'FCF/SH', 'ZONE ENTRÉE', 'CIBLE FCF', 'UPSIDE']

  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 300, color: '#f0ece0', letterSpacing: '0.05em' }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.4), transparent)' }} />
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(201,168,76,0.5)' }}>
          {stocks.length} position{stocks.length > 1 ? 's' : ''}
        </span>
      </div>
      <div style={{ border: '1px solid rgba(201,168,76,0.18)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(201,168,76,0.04)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
              {headers.map((h, i) => (
                <th key={h} style={{
                  padding: '8px ' + (i === 0 || i === headers.length - 1 ? '16px' : '12px'),
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  color: 'rgba(201,168,76,0.6)',
                  textAlign: i >= 4 ? 'right' : 'left',
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocks.map(s => (
              <StockRow key={s.id} stock={s} onSelect={() => onSelect(s.id)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div style={{
      background: '#100f0c',
      border: '1px solid rgba(201,168,76,0.2)',
      padding: '20px 24px',
      flex: 1,
    }}>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300, color: GOLD, marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(240,236,224,0.45)' }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.25)', marginTop: '2px' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

export default function Overview({ onSelectStock }: OverviewProps) {
  const buyStocks = stocks.filter(s => s.verdict === 'buy')
  const watchStocks = stocks.filter(s => s.verdict === 'watch')
  const watchlistStocks = stocks.filter(s => s.verdict === 'watchlist')
  const wideAll = stocks.filter(s => s.moatScore === 6)

  return (
    <div style={{ paddingTop: '36px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '42px', fontWeight: 300, color: '#f0ece0', letterSpacing: '0.03em', marginBottom: '6px' }}>
          Portfolio Intelligence
        </h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.1em' }}>
          FRAMEWORK 8 COUCHES · MISE À JOUR AVRIL 2026
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '48px' }}>
        <StatCard value={String(stocks.length)} label="POSITIONS TOTAL" sub={`${buyStocks.length} buy · ${watchStocks.length} watch · ${watchlistStocks.length} watchlist`} />
        <StatCard value={String(buyStocks.length)} label="ACHATS ACTIFS" sub="Conviction haute — entrée validée" />
        <StatCard value={`${wideAll.length}/6`} label="WIDE MOAT 6/6" sub="Score MOAT maximum" />
        <StatCard value="15%" label="TAUX DE RENDEMENT REQUIS" sub="r = 0.15 dans formule FCF" />
      </div>

      {/* Tables */}
      <SectionTable title="Achats actifs" stocks={buyStocks} onSelect={onSelectStock} />
      <SectionTable title="Surveillance" stocks={watchStocks} onSelect={onSelectStock} />
      <SectionTable title="Watchlist" stocks={watchlistStocks} onSelect={onSelectStock} />
    </div>
  )
}

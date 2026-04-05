import { Shield, BarChart2, Plane, Droplets, Cpu, Heart, TrendingUp, Briefcase, Eye, List } from 'lucide-react'
import { stocks } from '../data/stocks'
import { calcFCFTarget, calcUpside, getUpsideColor, upsideColorMap, getStatusLabel } from '../utils/calculations'
import MoatBar from './MoatBar'
import CompanyLogo from './CompanyLogo'
import type { Stock } from '../data/stocks'

interface OverviewProps {
  onSelectStock: (id: string) => void
}

const GOLD = '#c9a84c'

// Sector icon mapping
function SectorIcon({ ticker }: { ticker: string }) {
  const map: Record<string, { icon: React.ReactNode; color: string }> = {
    FTNT: { icon: <Shield size={14} />, color: '#60a5fa' },
    MSCI: { icon: <BarChart2 size={14} />, color: '#c9a84c' },
    ICE:  { icon: <BarChart2 size={14} />, color: '#c9a84c' },
    MA:   { icon: <BarChart2 size={14} />, color: '#c9a84c' },
    BN:   { icon: <BarChart2 size={14} />, color: '#c9a84c' },
    TDG:  { icon: <Plane size={14} />,     color: '#9ca3af' },
    BMI:  { icon: <Droplets size={14} />,  color: '#2dd4bf' },
    WTS:  { icon: <Droplets size={14} />,  color: '#2dd4bf' },
    SPX:  { icon: <Droplets size={14} />,  color: '#2dd4bf' },
    '6861':{ icon: <Cpu size={14} />,      color: '#a78bfa' },
    COH:  { icon: <Heart size={14} />,     color: '#f87171' },
  }
  const entry = map[ticker]
  if (!entry) return null
  return <span style={{ color: entry.color, display: 'flex', alignItems: 'center' }}>{entry.icon}</span>
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const cfg = {
    buy:       { label: 'ACHAT',     cls: 'badge-buy' },
    watch:     { label: 'SURVEIL.',  cls: 'badge-watch' },
    watchlist: { label: 'WATCHLIST', cls: 'badge-watchlist' },
  }
  const c = cfg[verdict as keyof typeof cfg] ?? cfg.watchlist
  return (
    <span className={c.cls} style={{
      fontFamily: 'DM Mono, monospace',
      fontSize: '10px',
      letterSpacing: '0.1em',
      padding: '4px 12px',
      borderRadius: '999px',
    }}>
      {c.label}
    </span>
  )
}

function StockCard({ stock, onSelect }: { stock: Stock; onSelect: () => void }) {
  const target = calcFCFTarget(stock.fcfPerShare, stock.fcfGrowthRate)
  const upside = calcUpside(stock.currentPrice, target)
  const upsideColor = upsideColorMap[getUpsideColor(upside)]
  const label = getStatusLabel(upside)
  const curr = stock.currency === 'JPY' ? '¥' : stock.currency === 'GBP' ? '£' : stock.currency === 'AUD' ? 'A$' : '$'

  return (
    <div className="stock-card" onClick={onSelect}>
      {/* Top row: logo + ticker + verdict */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <CompanyLogo ticker={stock.id} size={44} />
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 600, color: GOLD, lineHeight: 1 }}>
              {stock.id}
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(240,236,224,0.6)', marginTop: '2px' }}>
              {stock.name}
            </div>
          </div>
        </div>
        <VerdictBadge verdict={stock.verdict} />
      </div>

      {/* Sector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
        <SectorIcon ticker={stock.id} />
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(240,236,224,0.4)', letterSpacing: '0.02em' }}>
          {stock.sector}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.25), transparent)', marginBottom: '20px' }} />

      {/* Big upside number */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '52px', fontWeight: 500, color: upsideColor, lineHeight: 1, letterSpacing: '-0.02em' }}>
          {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: upsideColor, opacity: 0.75, letterSpacing: '0.08em', marginTop: '4px' }}>
          {label}
        </div>
      </div>

      {/* Moat bar */}
      <div style={{ marginBottom: '20px' }}>
        <MoatBar moat={stock.moat} score={stock.moatScore} compact />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(201,168,76,0.1)', marginBottom: '16px' }} />

      {/* Bottom metadata */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        {[
          { label: 'FCF/SH', value: `${curr}${stock.currency === 'JPY' ? stock.fcfPerShare.toLocaleString() : stock.fcfPerShare.toFixed(2)}` },
          { label: 'ENTRÉE', value: stock.entryZone },
          { label: 'CIBLE', value: `${curr}${stock.currency === 'JPY' ? Math.round(target).toLocaleString() : target.toFixed(2)}` },
        ].map(m => (
          <div key={m.label}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.3)', letterSpacing: '0.1em', marginBottom: '3px' }}>
              {m.label}
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'rgba(240,236,224,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter dots */}
      <div style={{ display: 'flex', gap: '5px', marginTop: '16px', alignItems: 'center' }}>
        {stock.filters.map(f => (
          <div
            key={f.id}
            title={`${f.name}: ${f.value} (${f.threshold})`}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: f.status === 'pass' ? '#34d399' : f.status === 'warn' ? '#fbbf24' : '#ef4444',
              flexShrink: 0,
            }}
          />
        ))}
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.25)', marginLeft: '4px' }}>
          L1–L5
        </span>
      </div>
    </div>
  )
}

function SectionHeader({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: GOLD, display: 'flex' }}>{icon}</span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 400, color: '#f0ece0', letterSpacing: '0.03em', lineHeight: 1 }}>
          {title}
        </h2>
      </div>
      <div className="section-rule" />
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(201,168,76,0.5)', whiteSpace: 'nowrap' }}>
        {count} position{count > 1 ? 's' : ''}
      </span>
    </div>
  )
}

function StatCard({ value, label, sub, icon }: { value: string; label: string; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: '28px 32px', flex: 1 }}>
      <div style={{ color: GOLD, marginBottom: '12px', display: 'flex' }}>{icon}</div>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 300, color: GOLD, lineHeight: 1, marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(240,236,224,0.5)', marginBottom: '4px' }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(240,236,224,0.3)', lineHeight: 1.5 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

export default function Overview({ onSelectStock }: OverviewProps) {
  const buyStocks       = stocks.filter(s => s.verdict === 'buy')
  const watchStocks     = stocks.filter(s => s.verdict === 'watch')
  const watchlistStocks = stocks.filter(s => s.verdict === 'watchlist')
  const wideAll         = stocks.filter(s => s.moatScore === 6)

  return (
    <div style={{ paddingTop: '56px', paddingBottom: '80px' }}>
      {/* Page title */}
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '64px', fontWeight: 300, color: '#f0ece0', letterSpacing: '0.02em', lineHeight: 1, marginBottom: '12px' }}>
          Portfolio
        </h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(201,168,76,0.55)', letterSpacing: '0.15em' }}>
          FRAMEWORK 8 COUCHES · {stocks.length} POSITIONS · AVRIL 2026
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '64px' }}>
        <StatCard
          icon={<Briefcase size={22} />}
          value={String(stocks.length)}
          label="POSITIONS TOTAL"
          sub={`${buyStocks.length} achats · ${watchStocks.length} surveillance · ${watchlistStocks.length} watchlist`}
        />
        <StatCard
          icon={<TrendingUp size={22} />}
          value={String(buyStocks.length)}
          label="ACHATS ACTIFS"
          sub="Conviction haute — entrée validée"
        />
        <StatCard
          icon={<Shield size={22} />}
          value={`${wideAll.length}/6`}
          label="WIDE MOAT 6/6"
          sub="Score de fossé concurrentiel maximum"
        />
        <StatCard
          icon={<BarChart2 size={22} />}
          value="15%"
          label="TAUX REQUIS"
          sub="r = 0.15 — formule FCF target"
        />
      </div>

      {/* Achats actifs */}
      {buyStocks.length > 0 && (
        <section style={{ marginBottom: '64px' }}>
          <SectionHeader title="Achats actifs" count={buyStocks.length} icon={<TrendingUp size={20} />} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {buyStocks.map(s => <StockCard key={s.id} stock={s} onSelect={() => onSelectStock(s.id)} />)}
          </div>
        </section>
      )}

      {/* Surveillance */}
      {watchStocks.length > 0 && (
        <section style={{ marginBottom: '64px' }}>
          <SectionHeader title="Surveillance" count={watchStocks.length} icon={<Eye size={20} />} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {watchStocks.map(s => <StockCard key={s.id} stock={s} onSelect={() => onSelectStock(s.id)} />)}
          </div>
        </section>
      )}

      {/* Watchlist */}
      {watchlistStocks.length > 0 && (
        <section>
          <SectionHeader title="Watchlist" count={watchlistStocks.length} icon={<List size={20} />} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {watchlistStocks.map(s => <StockCard key={s.id} stock={s} onSelect={() => onSelectStock(s.id)} />)}
          </div>
        </section>
      )}
    </div>
  )
}

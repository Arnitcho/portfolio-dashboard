import { Shield, BarChart2, Plane, Droplets, Cpu, Heart, TrendingUp, Briefcase, Eye, List } from 'lucide-react'
import { stocks } from '../data/stocks'
import { getValuation, getUpsideColorNew } from '../data/valuation'
import { formatPrice } from '../utils/calculations'
import { usePrices } from '../hooks/usePrices'
import MoatBar from './MoatBar'
import CompanyLogo from './CompanyLogo'
import type { Stock } from '../data/stocks'

interface OverviewProps {
  onSelectStock: (id: string) => void
}

const GOLD = '#f0b429'

function SectorIcon({ ticker }: { ticker: string }) {
  const map: Record<string, { icon: React.ReactNode; color: string }> = {
    FTNT:  { icon: <Shield size={14} />,    color: '#60a5fa' },
    MSCI:  { icon: <BarChart2 size={14} />, color: GOLD },
    ICE:   { icon: <BarChart2 size={14} />, color: GOLD },
    MA:    { icon: <BarChart2 size={14} />, color: GOLD },
    BN:    { icon: <BarChart2 size={14} />, color: GOLD },
    TDG:   { icon: <Plane size={14} />,     color: '#9ca3af' },
    BMI:   { icon: <Droplets size={14} />,  color: '#2dd4bf' },
    WTS:   { icon: <Droplets size={14} />,  color: '#2dd4bf' },
    SPX:   { icon: <Droplets size={14} />,  color: '#2dd4bf' },
    '6861':{ icon: <Cpu size={14} />,       color: '#a78bfa' },
    COH:   { icon: <Heart size={14} />,     color: '#f87171' },
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
      padding: '5px 14px',
      borderRadius: '20px',
    }}>
      {c.label}
    </span>
  )
}

function TargetPill({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <span style={{
        fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.1em',
        color, background: bg, padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 600, color }}>
        {value}
      </span>
    </div>
  )
}

function StockCard({ stock, livePrice, onSelect }: { stock: Stock; livePrice: number; onSelect: () => void }) {
  const val = getValuation(stock.id, livePrice)
  const upside = val.upside
  const upsideColor = getUpsideColorNew(upside)
  const curr = stock.currency === 'JPY' ? '¥' : stock.currency === 'GBP' ? '£' : stock.currency === 'AUD' ? 'A$' : '$'
  const fmt = (n: number) => formatPrice(n, stock.currency)

  const borderColor = upside > 10
    ? 'rgba(16,185,129,0.3)'
    : upside > -10
    ? 'rgba(240,180,41,0.25)'
    : 'rgba(239,68,68,0.25)'

  return (
    <div className="stock-card" onClick={onSelect} style={{ borderColor }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <CompanyLogo ticker={stock.id} size={44} />
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 600, color: GOLD, lineHeight: 1 }}>
              {stock.id}
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#8892a4', marginTop: '2px' }}>
              {stock.name}
            </div>
          </div>
        </div>
        <VerdictBadge verdict={stock.verdict} />
      </div>

      {/* Sector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '18px' }}>
        <SectorIcon ticker={stock.id} />
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#4a5568' }}>
          {stock.sector}
        </span>
      </div>

      <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(240,180,41,0.2), transparent)', marginBottom: '18px' }} />

      {/* 3 price targets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <TargetPill label="DCF"      value={fmt(val.dcf)}            color="#60a5fa" bg="rgba(96,165,250,0.1)" />
        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.06)', alignSelf: 'center' }} />
        <TargetPill label="MULTIPLE" value={fmt(val.multiple)}       color={GOLD}    bg="rgba(240,180,41,0.1)" />
        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.06)', alignSelf: 'center' }} />
        <TargetPill label="RI/EVA"   value={fmt(val.residualIncome)} color="#c084fc" bg="rgba(192,132,252,0.1)" />
      </div>

      {/* Fair value + upside */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${upsideColor}0d`,
        border: `1px solid ${upsideColor}25`,
        borderRadius: '10px',
        padding: '10px 14px',
        marginBottom: '18px',
      }}>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#4a5568', letterSpacing: '0.1em', marginBottom: '3px' }}>
            JUSTE VALEUR
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '16px', fontWeight: 600, color: '#e8eaf0' }}>
            {fmt(val.fairValue)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#4a5568', letterSpacing: '0.1em', marginBottom: '3px' }}>
            UPSIDE
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '36px', fontWeight: 700, color: upsideColor, lineHeight: 1, letterSpacing: '-0.02em' }}>
            {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Moat bar */}
      <div style={{ marginBottom: '16px' }}>
        <MoatBar moat={stock.moat} score={stock.moatScore} compact />
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '14px' }} />

      {/* Bottom row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { label: 'PRIX', value: `${curr}${stock.currency === 'JPY' ? livePrice.toLocaleString() : livePrice.toFixed(2)}` },
            { label: 'ENTRÉE', value: stock.entryZone },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#4a5568', letterSpacing: '0.1em', marginBottom: '2px' }}>
                {m.label}
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#8892a4' }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {stock.filters.map(f => (
            <div
              key={f.id}
              title={`${f.name}: ${f.value} (${f.threshold})`}
              style={{
                width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                background: f.status === 'pass' ? '#10b981' : f.status === 'warn' ? '#f59e0b' : '#ef4444',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: GOLD, display: 'flex' }}>{icon}</span>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '32px', fontWeight: 400, letterSpacing: '0.03em', lineHeight: 1,
          background: `linear-gradient(90deg, ${GOLD}, #ffd166)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          {title}
        </h2>
      </div>
      <div className="section-rule" />
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,180,41,0.5)', whiteSpace: 'nowrap' }}>
        {count} position{count > 1 ? 's' : ''}
      </span>
    </div>
  )
}

function StatCard({ value, label, sub, icon }: { value: string; label: string; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="card" style={{
      padding: '28px 32px', flex: 1,
      borderLeft: `3px solid rgba(240,180,41,0.4)`,
    }}>
      <div style={{ color: GOLD, marginBottom: '12px', display: 'flex' }}>{icon}</div>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '48px', fontWeight: 300, lineHeight: 1, marginBottom: '8px',
        background: `linear-gradient(90deg, ${GOLD}, #ffd166)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        {value}
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', color: '#8892a4', marginBottom: '4px' }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#4a5568', lineHeight: 1.5 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

export default function Overview({ onSelectStock }: OverviewProps) {
  const { prices } = usePrices()
  const buyStocks       = stocks.filter(s => s.verdict === 'buy')
  const watchStocks     = stocks.filter(s => s.verdict === 'watch')
  const watchlistStocks = stocks.filter(s => s.verdict === 'watchlist')
  const wideAll         = stocks.filter(s => s.moatScore === 6)

  return (
    <div style={{ paddingTop: '56px', paddingBottom: '80px' }}>
      {/* Page title */}
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '64px', fontWeight: 300, letterSpacing: '0.02em', lineHeight: 1, marginBottom: '12px',
          color: '#e8eaf0',
        }}>
          Portfolio
        </h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,180,41,0.5)', letterSpacing: '0.15em' }}>
          FRAMEWORK 8 COUCHES · {stocks.length} POSITIONS · VALUATION 3 MÉTHODES · AVRIL 2026
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '64px' }}>
        <StatCard icon={<Briefcase size={22} />} value={String(stocks.length)} label="POSITIONS TOTAL"
          sub={`${buyStocks.length} achats · ${watchStocks.length} surveillance · ${watchlistStocks.length} watchlist`} />
        <StatCard icon={<TrendingUp size={22} />} value={String(buyStocks.length)} label="ACHATS ACTIFS"
          sub="Conviction haute — entrée validée" />
        <StatCard icon={<Shield size={22} />} value={`${wideAll.length}/6`} label="WIDE MOAT 6/6"
          sub="Score de fossé concurrentiel maximum" />
        <StatCard icon={<BarChart2 size={22} />} value="3" label="MÉTHODES VALUATION"
          sub="DCF · EV/Multiple · Residual Income" />
      </div>

      {buyStocks.length > 0 && (
        <section style={{ marginBottom: '64px' }}>
          <SectionHeader title="Achats actifs" count={buyStocks.length} icon={<TrendingUp size={20} />} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {buyStocks.map(s => (
              <StockCard key={s.id} stock={s} livePrice={prices[s.id] ?? s.currentPrice} onSelect={() => onSelectStock(s.id)} />
            ))}
          </div>
        </section>
      )}

      {watchStocks.length > 0 && (
        <section style={{ marginBottom: '64px' }}>
          <SectionHeader title="Surveillance" count={watchStocks.length} icon={<Eye size={20} />} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {watchStocks.map(s => (
              <StockCard key={s.id} stock={s} livePrice={prices[s.id] ?? s.currentPrice} onSelect={() => onSelectStock(s.id)} />
            ))}
          </div>
        </section>
      )}

      {watchlistStocks.length > 0 && (
        <section>
          <SectionHeader title="Watchlist" count={watchlistStocks.length} icon={<List size={20} />} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {watchlistStocks.map(s => (
              <StockCard key={s.id} stock={s} livePrice={prices[s.id] ?? s.currentPrice} onSelect={() => onSelectStock(s.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

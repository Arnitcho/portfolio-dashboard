import { Shield, BarChart2, Plane, Droplets, Cpu, Heart, TrendingUp, Eye, List, ArrowUpRight } from 'lucide-react'
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

// ── Sector icons ──────────────────────────────────────────────
function SectorIcon({ ticker }: { ticker: string }) {
  const map: Record<string, { icon: React.ReactNode; color: string }> = {
    FTNT:  { icon: <Shield size={13} />,    color: '#60a5fa' },
    MSCI:  { icon: <BarChart2 size={13} />, color: GOLD },
    ICE:   { icon: <BarChart2 size={13} />, color: GOLD },
    MA:    { icon: <BarChart2 size={13} />, color: GOLD },
    BN:    { icon: <BarChart2 size={13} />, color: GOLD },
    TDG:   { icon: <Plane size={13} />,     color: '#9ca3af' },
    BMI:   { icon: <Droplets size={13} />,  color: '#2dd4bf' },
    WTS:   { icon: <Droplets size={13} />,  color: '#2dd4bf' },
    SPX:   { icon: <Droplets size={13} />,  color: '#2dd4bf' },
    '6861':{ icon: <Cpu size={13} />,       color: '#a78bfa' },
    COH:   { icon: <Heart size={13} />,     color: '#f87171' },
  }
  const entry = map[ticker]
  if (!entry) return null
  return <span style={{ color: entry.color, display: 'flex', alignItems: 'center' }}>{entry.icon}</span>
}

// ── Verdict badge ─────────────────────────────────────────────
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
      fontSize: '0.5625rem',
      letterSpacing: '0.12em',
      padding: '0.3rem 0.75rem',
      borderRadius: '999px',
    }}>
      {c.label}
    </span>
  )
}

// ── 3 price target pills ──────────────────────────────────────
function TargetPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
      <span style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', letterSpacing: '0.12em',
        color, opacity: 0.8, whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', fontWeight: 600, color }}>
        {value}
      </span>
    </div>
  )
}

// ── Stock card ────────────────────────────────────────────────
function StockCard({ stock, livePrice, onSelect }: { stock: Stock; livePrice: number; onSelect: () => void }) {
  const val = getValuation(stock.id, livePrice)
  const upside = val.upside
  const upsideColor = getUpsideColorNew(upside)
  const curr = stock.currency === 'JPY' ? '¥' : stock.currency === 'GBP' ? '£' : stock.currency === 'AUD' ? 'A$' : '$'
  const fmt = (n: number) => formatPrice(n, stock.currency)

  const borderColor = upside > 10
    ? 'rgba(16,185,129,0.28)'
    : upside > -10
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(239,68,68,0.22)'

  return (
    <div className="stock-card" onClick={onSelect} style={{ borderColor }}>

      {/* Identity row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <CompanyLogo ticker={stock.id} size={42} />
          <div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: '1.625rem', fontWeight: 600,
              color: GOLD, lineHeight: 1,
            }}>
              {stock.id}
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8125rem', color: '#8892a4', marginTop: '0.125rem' }}>
              {stock.name}
            </div>
          </div>
        </div>
        <VerdictBadge verdict={stock.verdict} />
      </div>

      {/* Sector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.5rem' }}>
        <SectorIcon ticker={stock.id} />
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: '#4a5568', lineHeight: 1 }}>
          {stock.sector}
        </span>
      </div>

      {/* 3 price targets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <TargetPill label="DCF"      value={fmt(val.dcf)}            color="#60a5fa" />
        <div style={{ width: '1px', height: '2rem', background: 'rgba(255,255,255,0.06)' }} />
        <TargetPill label="MULTIPLE" value={fmt(val.multiple)}       color={GOLD} />
        <div style={{ width: '1px', height: '2rem', background: 'rgba(255,255,255,0.06)' }} />
        <TargetPill label="RI / EVA" value={fmt(val.residualIncome)} color="#c084fc" />
      </div>

      {/* Fair value + upside */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${upsideColor}09`,
        border: `1px solid ${upsideColor}22`,
        borderRadius: '0.75rem',
        padding: '0.875rem 1rem',
        marginBottom: '1.25rem',
      }}>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: '#4a5568', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>
            JUSTE VALEUR
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1rem', fontWeight: 600, color: '#e8eaf0' }}>
            {fmt(val.fairValue)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '2.25rem', fontWeight: 700, color: upsideColor, lineHeight: 1, letterSpacing: '-0.02em' }}>
            {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: upsideColor, opacity: 0.7, marginTop: '0.25rem', letterSpacing: '0.1em' }}>
            vs prix actuel
          </div>
        </div>
      </div>

      {/* Moat */}
      <div style={{ marginBottom: '1.25rem' }}>
        <MoatBar moat={stock.moat} score={stock.moatScore} compact />
      </div>

      {/* Bottom row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: '#4a5568', letterSpacing: '0.1em', marginBottom: '0.125rem' }}>PRIX</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6875rem', color: '#8892a4' }}>
              {curr}{stock.currency === 'JPY' ? livePrice.toLocaleString() : livePrice.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: '#4a5568', letterSpacing: '0.1em', marginBottom: '0.125rem' }}>ENTRÉE</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6875rem', color: '#8892a4' }}>{stock.entryZone}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {stock.filters.map(f => (
            <div
              key={f.id}
              title={`${f.name}: ${f.value} (seuil ${f.threshold})`}
              style={{
                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                background: f.status === 'pass' ? '#10b981' : f.status === 'warn' ? '#f59e0b' : '#ef4444',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section header ────────────────────────────────────────────
function SectionHeader({ title, count, icon, intro }: {
  title: string; count: number; icon: React.ReactNode; intro: string
}) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        <span style={{ color: GOLD, display: 'flex', opacity: 0.8 }}>{icon}</span>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '2rem', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1,
          background: `linear-gradient(90deg, ${GOLD}, #ffd166)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          {title}
        </h2>
        <div className="section-rule" />
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.6875rem',
          color: 'rgba(240,180,41,0.45)', whiteSpace: 'nowrap',
        }}>
          {count} / {stocks.length}
        </span>
      </div>
      <p style={{
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem',
        color: '#4a5568', lineHeight: 1.6, maxWidth: '56ch',
      }}>
        {intro}
      </p>
    </div>
  )
}

// ── Portfolio health metric ───────────────────────────────────
function HealthMetric({ label, value, sub, color }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: '#4a5568', letterSpacing: '0.14em', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'DM Mono, monospace', fontSize: '2rem', fontWeight: 600,
        color: color ?? '#e8eaf0', lineHeight: 1, letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: '#4a5568', marginTop: '0.25rem' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function Overview({ onSelectStock }: OverviewProps) {
  const { prices } = usePrices()

  const buyStocks       = stocks.filter(s => s.verdict === 'buy')
  const watchStocks     = stocks.filter(s => s.verdict === 'watch')
  const watchlistStocks = stocks.filter(s => s.verdict === 'watchlist')

  // Live portfolio health
  const avgUpside = stocks.reduce((sum, s) => {
    return sum + getValuation(s.id, prices[s.id] ?? s.currentPrice).upside
  }, 0) / stocks.length

  const avgUpsideColor = getUpsideColorNew(avgUpside)
  const wideCount  = stocks.filter(s => s.moatScore === 6).length
  const passAll    = stocks.filter(s => s.filters.every(f => f.status === 'pass')).length

  return (
    <div className="page-content">

      {/* ── Hero ── */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
            fontWeight: 300,
            color: '#e8eaf0',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            marginBottom: '0.25rem',
          }}>
            Portfolio
          </h1>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            background: `linear-gradient(90deg, ${GOLD} 0%, #ffd166 60%, ${GOLD} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Intelligence.
          </h1>
        </div>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '1.0625rem',
          color: '#8892a4',
          lineHeight: 1.7,
          maxWidth: '52ch',
        }}>
          Onze entreprises sélectionnées. Trois méthodes de valorisation.
          Un cadre analytique en huit couches — de la qualité du moat au sizing de position.
        </p>
      </div>

      {/* ── Portfolio health strip ── */}
      <div className="card" style={{
        padding: '1.75rem 2.25rem',
        marginBottom: '5rem',
        display: 'flex',
        alignItems: 'stretch',
        gap: 0,
        background: 'linear-gradient(135deg, #161b27, #1a1f32)',
      }}>
        <HealthMetric
          label="UPSIDE MOYEN — PORTEFEUILLE"
          value={`${avgUpside >= 0 ? '+' : ''}${avgUpside.toFixed(1)}%`}
          sub="Moyenne des 3 méthodes · 11 positions"
          color={avgUpsideColor}
        />
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 2rem', flexShrink: 0 }} />
        <HealthMetric
          label="CONVICTION HAUTE"
          value={`${buyStocks.length} / ${stocks.length}`}
          sub="Positions en achat actif"
          color={GOLD}
        />
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 2rem', flexShrink: 0 }} />
        <HealthMetric
          label="WIDE MOAT MAXIMAL"
          value={`${wideCount} / ${stocks.length}`}
          sub="Score 6/6 sur les 6 critères"
        />
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 2rem', flexShrink: 0 }} />
        <HealthMetric
          label="FILTRES L1–L5 VALIDÉS"
          value={`${passAll} / ${stocks.length}`}
          sub="Tous les critères fondamentaux passés"
        />
      </div>

      {/* ── Achats actifs ── */}
      {buyStocks.length > 0 && (
        <section style={{ marginBottom: '5rem' }}>
          <SectionHeader
            title="Achats actifs"
            count={buyStocks.length}
            icon={<TrendingUp size={18} />}
            intro="Prix d'entrée atteint ou proche. Conviction validée sur les huit niveaux du framework. Ces positions méritent d'être initiées ou renforcées."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {buyStocks.map(s => (
              <StockCard key={s.id} stock={s} livePrice={prices[s.id] ?? s.currentPrice} onSelect={() => onSelectStock(s.id)} />
            ))}
          </div>
        </section>
      )}

      {/* ── Surveillance ── */}
      {watchStocks.length > 0 && (
        <section style={{ marginBottom: '5rem' }}>
          <SectionHeader
            title="Surveillance"
            count={watchStocks.length}
            icon={<Eye size={18} />}
            intro="Les fondamentaux sont solides, le prix pas encore optimal. En attente d'un point d'entrée ou d'un catalyseur de confirmation avant de passer à l'achat."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {watchStocks.map(s => (
              <StockCard key={s.id} stock={s} livePrice={prices[s.id] ?? s.currentPrice} onSelect={() => onSelectStock(s.id)} />
            ))}
          </div>
        </section>
      )}

      {/* ── Watchlist ── */}
      {watchlistStocks.length > 0 && (
        <section>
          <SectionHeader
            title="Watchlist"
            count={watchlistStocks.length}
            icon={<List size={18} />}
            intro="Dossiers en cours de qualification. Suivi actif jusqu'à validation complète des huit couches d'analyse. Aucune décision d'investissement avant signal clair."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {watchlistStocks.map(s => (
              <StockCard key={s.id} stock={s} livePrice={prices[s.id] ?? s.currentPrice} onSelect={() => onSelectStock(s.id)} />
            ))}
          </div>
        </section>
      )}

      {/* ── Footer note ── */}
      <div style={{
        marginTop: '5rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.625rem', color: '#4a5568', letterSpacing: '0.08em' }}>
          VALORISATION — DCF · EV/EBITDA · EV/FCF · RESIDUAL INCOME / EVA
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowUpRight size={12} style={{ color: '#4a5568' }} />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.625rem', color: '#4a5568', letterSpacing: '0.08em' }}>
            CLIQUEZ SUR UNE POSITION POUR L'ANALYSE COMPLÈTE
          </span>
        </div>
      </div>

    </div>
  )
}

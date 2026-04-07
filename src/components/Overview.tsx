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

const GOLD = '#e8a020'

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
      <span style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', letterSpacing: '0.14em',
        color, opacity: 0.7, whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.375rem', fontWeight: 600, color, lineHeight: 1 }}>
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
    ? 'rgba(34,197,94,0.25)'
    : upside > -10
    ? 'rgba(240,220,160,0.08)'
    : 'rgba(239,68,68,0.20)'

  return (
    <div className="stock-card" onClick={onSelect} style={{ borderColor }}>

      {/* Identity row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CompanyLogo ticker={stock.id} size={44} />
          <div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700,
              color: GOLD, lineHeight: 1,
            }}>
              {stock.id}
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: '#b0a88a', marginTop: '0.2rem' }}>
              {stock.name}
            </div>
          </div>
        </div>
        <VerdictBadge verdict={stock.verdict} />
      </div>

      {/* Sector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.75rem' }}>
        <SectorIcon ticker={stock.id} />
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8125rem', color: '#6b6352', lineHeight: 1 }}>
          {stock.sector}
        </span>
      </div>

      {/* 3 valuation methods */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.25rem 1rem',
        background: 'rgba(240,220,160,0.04)',
        border: '1px solid rgba(240,220,160,0.07)',
        borderRadius: '0.75rem',
        marginBottom: '1.75rem',
      }}>
        <TargetPill label="DCF"      value={fmt(val.dcf)}            color="#60a5fa" />
        <div style={{ width: '1px', height: '2.5rem', background: 'rgba(240,220,160,0.08)' }} />
        <TargetPill label="MULTIPLE" value={fmt(val.multiple)}       color={GOLD} />
        <div style={{ width: '1px', height: '2.5rem', background: 'rgba(240,220,160,0.08)' }} />
        <TargetPill label="RI / EVA" value={fmt(val.residualIncome)} color="#c084fc" />
      </div>

      {/* UPSIDE — hero element */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '1.75rem 1rem 1.5rem',
        background: `${upsideColor}07`,
        border: `1px solid ${upsideColor}20`,
        borderRadius: '0.875rem',
        marginBottom: '1.75rem',
      }}>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: '4.5rem', fontWeight: 700,
          color: upsideColor, lineHeight: 1, letterSpacing: '-0.03em',
        }}>
          {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
        </div>
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '2.25rem', fontWeight: 600, color: '#f0ead6', lineHeight: 1 }}>
            {fmt(val.fairValue)}
          </span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: '#6b6352', letterSpacing: '0.12em' }}>
            JUSTE VALEUR
          </span>
        </div>
      </div>

      {/* Moat */}
      <div style={{ marginBottom: '1.5rem' }}>
        <MoatBar moat={stock.moat} score={stock.moatScore} compact />
      </div>

      {/* Bottom row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '1.25rem',
        borderTop: '1px solid rgba(240,220,160,0.06)',
      }}>
        <div style={{ display: 'flex', gap: '1.75rem' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: '#6b6352', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>PRIX</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1rem', color: '#b0a88a' }}>
              {curr}{stock.currency === 'JPY' ? livePrice.toLocaleString() : livePrice.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: '#6b6352', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>ENTRÉE</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1rem', color: '#b0a88a' }}>{stock.entryZone}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {stock.filters.map(f => (
            <div
              key={f.id}
              title={`${f.name}: ${f.value} (seuil ${f.threshold})`}
              style={{
                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                background: f.status === 'pass' ? '#22c55e' : f.status === 'warn' ? '#f59e0b' : '#ef4444',
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
    <div style={{ marginBottom: '2.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.875rem' }}>
        <span style={{ color: GOLD, display: 'flex', opacity: 0.8 }}>{icon}</span>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '2rem', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1,
          background: `linear-gradient(90deg, ${GOLD}, #f5c842)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          {title}
        </h2>
        <div className="section-rule" />
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.6875rem',
          color: 'rgba(232,160,32,0.40)', whiteSpace: 'nowrap',
        }}>
          {count} / {stocks.length}
        </span>
      </div>
      <p style={{
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem',
        color: '#6b6352', lineHeight: 1.6, maxWidth: '56ch',
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
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.5rem', color: '#6b6352', letterSpacing: '0.14em', marginBottom: '0.625rem' }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Cormorant Garamond, serif', fontSize: '4rem', fontWeight: 300,
        color: color ?? '#f0ead6', lineHeight: 1, letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: '#6b6352', marginTop: '0.375rem' }}>
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
            color: '#f0ead6',
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
            background: `linear-gradient(90deg, ${GOLD} 0%, #f5c842 60%, ${GOLD} 100%)`,
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
          color: '#b0a88a',
          lineHeight: 1.7,
          maxWidth: '52ch',
        }}>
          Onze entreprises sélectionnées. Trois méthodes de valorisation.
          Un cadre analytique en huit couches — de la qualité du moat au sizing de position.
        </p>
      </div>

      {/* ── Portfolio health strip ── */}
      <div className="card" style={{
        padding: '2rem 2.5rem',
        marginBottom: '5rem',
        display: 'flex',
        alignItems: 'stretch',
        gap: 0,
        background: 'linear-gradient(135deg, #272420, #2a2720)',
      }}>
        <HealthMetric
          label="UPSIDE MOYEN — PORTEFEUILLE"
          value={`${avgUpside >= 0 ? '+' : ''}${avgUpside.toFixed(1)}%`}
          sub="Moyenne des 3 méthodes · 11 positions"
          color={avgUpsideColor}
        />
        <div style={{ width: '1px', background: 'rgba(240,220,160,0.08)', margin: '0 2.25rem', flexShrink: 0 }} />
        <HealthMetric
          label="CONVICTION HAUTE"
          value={`${buyStocks.length} / ${stocks.length}`}
          sub="Positions en achat actif"
          color={GOLD}
        />
        <div style={{ width: '1px', background: 'rgba(240,220,160,0.08)', margin: '0 2.25rem', flexShrink: 0 }} />
        <HealthMetric
          label="WIDE MOAT MAXIMAL"
          value={`${wideCount} / ${stocks.length}`}
          sub="Score 6/6 sur les 6 critères"
        />
        <div style={{ width: '1px', background: 'rgba(240,220,160,0.08)', margin: '0 2.25rem', flexShrink: 0 }} />
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
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
        borderTop: '1px solid rgba(240,220,160,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.625rem', color: '#6b6352', letterSpacing: '0.08em' }}>
          VALORISATION — DCF · EV/EBITDA · EV/FCF · RESIDUAL INCOME / EVA
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowUpRight size={12} style={{ color: '#6b6352' }} />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.625rem', color: '#6b6352', letterSpacing: '0.08em' }}>
            CLIQUEZ SUR UNE POSITION POUR L'ANALYSE COMPLÈTE
          </span>
        </div>
      </div>

    </div>
  )
}

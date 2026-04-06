import { getStockById } from '../data/stocks'
import FilterCard from './FilterCard'
import MoatBar from './MoatBar'
import DCFScenarios from './DCFScenarios'
import FCFCalculator from './FCFCalculator'
import CatalystCard from './CatalystCard'
import PositionPanel from './PositionPanel'
import CyclePanel from './CyclePanel'
import CompanyLogo from './CompanyLogo'
import { getValuation, getUpsideColorNew } from '../data/valuation'
import { formatPrice, getStatusLabel } from '../utils/calculations'
import { usePrices } from '../hooks/usePrices'

interface StockDetailProps {
  stockId: string
  onBack: () => void
}

const GOLD = '#c9a84c'

function Panel({ title, children, fullWidth = false }: { title: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className="card" style={{ padding: '28px 32px', gridColumn: fullWidth ? '1 / -1' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: '#f0ece0', letterSpacing: '0.03em', lineHeight: 1 }}>
          {title}
        </h3>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)' }} />
      </div>
      {children}
    </div>
  )
}

const verdictConfig = {
  buy:       { label: 'ACHAT',        color: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.3)' },
  watch:     { label: 'SURVEILLANCE', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.3)' },
  watchlist: { label: 'WATCHLIST',    color: '#a09880', bg: 'rgba(160,152,128,0.08)', border: 'rgba(160,152,128,0.2)' },
}

// ── Valuation panel ──────────────────────────────────────────
interface ValuationMethodCardProps {
  label: string
  price: string
  color: string
  bg: string
  border: string
  note: string
}

function ValuationMethodCard({ label, price, color, bg, border, note }: ValuationMethodCardProps) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.12em', color, marginBottom: '10px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '28px', fontWeight: 600, color, lineHeight: 1, marginBottom: '10px' }}>
        {price}
      </div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(240,236,224,0.45)', lineHeight: 1.6 }}>
        {note}
      </p>
    </div>
  )
}

function ValuationPanel({ stockId, currentPrice, currency }: { stockId: string; currentPrice: number; currency: string }) {
  const val = getValuation(stockId, currentPrice)
  const upside = val.upside
  const upsideColor = getUpsideColorNew(upside)
  const label = getStatusLabel(upside)
  const fmt = (n: number) => formatPrice(n, currency)

  // Visual bar: price vs fair value
  const minV = Math.min(currentPrice, val.fairValue) * 0.85
  const maxV = Math.max(currentPrice, val.fairValue) * 1.15
  const range = maxV - minV
  const pricePct  = range > 0 ? ((currentPrice  - minV) / range) * 100 : 50
  const targetPct = range > 0 ? ((val.fairValue  - minV) / range) * 100 : 50

  return (
    <div>
      {/* 3 method cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <ValuationMethodCard
          label="MÉTHODE 1 — DCF"
          price={fmt(val.dcf)}
          color="#60a5fa"
          bg="rgba(96,165,250,0.06)"
          border="rgba(96,165,250,0.2)"
          note={`Projection FCF ${val.input.years ?? 5}ans + TV. WACC ${((val.input.wacc ?? 0.09) * 100).toFixed(1)}% · TGR ${((val.input.tgr ?? 0.035) * 100).toFixed(1)}%`}
        />
        <ValuationMethodCard
          label="MÉTHODE 2 — EV/MULTIPLE"
          price={fmt(val.multiple)}
          color={GOLD}
          bg="rgba(201,168,76,0.06)"
          border="rgba(201,168,76,0.2)"
          note={`Moyenne EV/EBITDA ${val.input.evEbitdaSector ?? '—'}× et EV/FCF ${val.input.evFcfSector ?? '—'}× secteur`}
        />
        <ValuationMethodCard
          label="MÉTHODE 3 — RI / EVA"
          price={fmt(val.residualIncome)}
          color="#c084fc"
          bg="rgba(192,132,252,0.06)"
          border="rgba(192,132,252,0.2)"
          note={`Book value/sh + Σ EVA actualisé + terminal RI. WACC ${((val.input.wacc ?? 0.09) * 100).toFixed(1)}%`}
        />
      </div>

      {/* Fair value summary */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${upsideColor}08`, border: `1px solid ${upsideColor}25`,
        borderRadius: '12px', padding: '20px 24px', marginBottom: '24px',
      }}>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.4)', letterSpacing: '0.12em', marginBottom: '6px' }}>
            JUSTE VALEUR (MOYENNE 3 MÉTHODES)
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '40px', fontWeight: 600, color: '#f0ece0', lineHeight: 1 }}>
            {fmt(val.fairValue)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.4)', letterSpacing: '0.12em', marginBottom: '6px' }}>
            UPSIDE vs PRIX ACTUEL
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '48px', fontWeight: 700, color: upsideColor, lineHeight: 1, letterSpacing: '-0.02em' }}>
            {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: upsideColor, opacity: 0.75, marginTop: '4px', letterSpacing: '0.1em' }}>
            {label}
          </div>
        </div>
      </div>

      {/* Visual price vs fair value bar */}
      <div style={{ marginBottom: '4px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.3)', letterSpacing: '0.1em', marginBottom: '10px' }}>
          PRIX ACTUEL vs JUSTE VALEUR
        </div>
        <div style={{ position: 'relative', height: '6px', background: 'rgba(240,236,224,0.08)', borderRadius: '3px' }}>
          {/* Range fill between price and fair value */}
          <div style={{
            position: 'absolute',
            left: `${Math.min(pricePct, targetPct)}%`,
            width: `${Math.abs(targetPct - pricePct)}%`,
            height: '100%',
            background: `${upsideColor}30`,
            borderRadius: '3px',
          }} />
          {/* Current price marker */}
          <div style={{
            position: 'absolute', left: `${pricePct}%`, top: '-3px',
            width: '12px', height: '12px', borderRadius: '50%',
            background: '#f0ece0', border: '2px solid rgba(240,236,224,0.5)',
            transform: 'translateX(-50%)',
          }} />
          {/* Fair value marker */}
          <div style={{
            position: 'absolute', left: `${targetPct}%`, top: '-3px',
            width: '12px', height: '12px', borderRadius: '50%',
            background: upsideColor, border: `2px solid ${upsideColor}`,
            transform: 'translateX(-50%)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.5)' }}>
            ● Actuel: {fmt(currentPrice)}
          </span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: upsideColor }}>
            ● Juste valeur: {fmt(val.fairValue)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────
export default function StockDetail({ stockId, onBack }: StockDetailProps) {
  const stock = getStockById(stockId)
  const { prices } = usePrices()

  if (!stock) return (
    <div style={{ padding: '80px', textAlign: 'center', color: 'rgba(240,236,224,0.4)', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
      Stock non trouvé: {stockId}
    </div>
  )

  const livePrice = prices[stock.id] ?? stock.currentPrice
  const val = getValuation(stock.id, livePrice)
  const upside = val.upside
  const upsideColor = getUpsideColorNew(upside)
  const curr = stock.currency === 'JPY' ? '¥' : stock.currency === 'GBP' ? '£' : stock.currency === 'AUD' ? 'A$' : '$'
  const vc = verdictConfig[stock.verdict] ?? verdictConfig.watchlist

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: 'none', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px',
          color: 'rgba(201,168,76,0.6)', fontFamily: 'DM Mono, monospace', fontSize: '10px',
          letterSpacing: '0.1em', padding: '8px 18px', cursor: 'pointer', marginBottom: '36px',
          display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(201,168,76,0.6)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)' }}
      >
        ← PORTFOLIO OVERVIEW
      </button>

      {/* ── Hero ── */}
      <div className="card" style={{ padding: '40px 48px', marginBottom: '28px' }}>
        {/* Identity row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <CompanyLogo ticker={stock.id} size={80} />
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '52px', fontWeight: 600, color: GOLD, lineHeight: 1 }}>
                {stock.id}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: 'rgba(240,236,224,0.65)', marginTop: '4px' }}>
                {stock.name}
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.08em' }}>
                  {stock.sector}
                </span>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(201,168,76,0.35)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(201,168,76,0.5)', letterSpacing: '0.08em' }}>
                  {stock.currency}
                </span>
              </div>
            </div>
          </div>
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em',
            color: vc.color, background: vc.bg, border: `1px solid ${vc.border}`, padding: '8px 20px', borderRadius: '999px',
          }}>
            {vc.label}
          </span>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)', marginBottom: '32px' }} />

        {/* Price row */}
        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.12em', marginBottom: '6px' }}>
              PRIX RÉFÉRENCE
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '64px', fontWeight: 300, color: GOLD, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {curr}{stock.currency === 'JPY' ? livePrice.toLocaleString() : livePrice.toFixed(2)}
            </div>
          </div>
          <div style={{ width: '1px', height: '64px', background: 'rgba(201,168,76,0.15)' }} />
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.12em', marginBottom: '6px' }}>
              JUSTE VALEUR
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '40px', fontWeight: 300, color: 'rgba(240,236,224,0.75)', lineHeight: 1 }}>
              {curr}{stock.currency === 'JPY' ? Math.round(val.fairValue).toLocaleString() : val.fairValue.toFixed(2)}
            </div>
          </div>
          <div style={{ width: '1px', height: '64px', background: 'rgba(201,168,76,0.15)' }} />
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.12em', marginBottom: '8px' }}>
              UPSIDE
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: `${upsideColor}12`, border: `1px solid ${upsideColor}35`,
              borderRadius: '999px', padding: '10px 24px',
            }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '32px', fontWeight: 600, color: upsideColor, lineHeight: 1, letterSpacing: '-0.01em' }}>
                {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
              </span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: upsideColor, opacity: 0.75, letterSpacing: '0.08em' }}>
                {getStatusLabel(upside)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sector note */}
      {stock.sectorAdaptation && (
        <div style={{
          background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)',
          borderLeft: '3px solid rgba(201,168,76,0.45)', borderRadius: '0 10px 10px 0',
          padding: '12px 18px', marginBottom: '28px',
        }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(201,168,76,0.65)', letterSpacing: '0.08em' }}>
            NOTE SECTORIELLE — {stock.sectorAdaptation}
          </span>
        </div>
      )}

      {/* 9-panel grid (valuation + 8 original) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Panel 0 — Valuation (full width) */}
        <Panel title="Valorisation — 3 Méthodes" fullWidth>
          <ValuationPanel stockId={stock.id} currentPrice={livePrice} currency={stock.currency} />
        </Panel>

        {/* Panel 1 — Filters L1-L5 */}
        <Panel title="Filtres Fondamentaux L1–L5">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {stock.filters.map(f => (
              <FilterCard key={f.id} filter={f} />
            ))}
          </div>
        </Panel>

        {/* Panel 2 — Moat */}
        <Panel title="Moat — Fossé Concurrentiel">
          <MoatBar moat={stock.moat} score={stock.moatScore} />
        </Panel>

        {/* Panel 3 — Thesis */}
        <Panel title="Thèse d'Investissement">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stock.thesis.map((point, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '22px', height: '22px', border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px',
                }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(201,168,76,0.6)' }}>{i + 1}</span>
                </div>
                <p
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(240,236,224,0.75)', lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: point }}
                />
              </div>
            ))}
          </div>
        </Panel>

        {/* Panel 4 — DCF Scenarios */}
        <Panel title="Scénarios DCF">
          <DCFScenarios
            scenarios={stock.dcf}
            fcfPerShare={stock.fcfPerShare}
            g={stock.fcfGrowthRate}
            currency={stock.currency}
          />
        </Panel>

        {/* Panel 5 — FCF Calculator */}
        <Panel title="Calculateur FCF — Sensibilité">
          <FCFCalculator
            defaultPrice={livePrice}
            defaultFCF={stock.fcfPerShare}
            defaultG={stock.fcfGrowthRate}
            currency={stock.currency}
          />
        </Panel>

        {/* Panel 6 — Catalysts */}
        <Panel title="Catalyseurs">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stock.catalysts.map((c, i) => (
              <CatalystCard key={i} catalyst={c} index={i} />
            ))}
          </div>
        </Panel>

        {/* Panel 7 — Position L8 */}
        <Panel title="Position — Couche 8">
          <PositionPanel position={stock.position} />
        </Panel>

        {/* Panel 8 — Market Regime L7 */}
        <Panel title="Régime de Marché — Couche 7">
          <CyclePanel cycle={stock.cycle} />
        </Panel>

      </div>
    </div>
  )
}

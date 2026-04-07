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
}

const GOLD = '#f0b429'

function Panel({ title, children, fullWidth = false }: { title: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className="card" style={{ padding: '28px 32px', gridColumn: fullWidth ? '1 / -1' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, letterSpacing: '0.03em', lineHeight: 1,
          background: `linear-gradient(90deg, #e8eaf0, #8892a4)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          {title}
        </h3>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(240,180,41,0.2), transparent)' }} />
      </div>
      {children}
    </div>
  )
}

const verdictConfig = {
  buy:       { label: 'ACHAT',        color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)' },
  watch:     { label: 'SURVEILLANCE', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)' },
  watchlist: { label: 'WATCHLIST',    color: '#818cf8', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.3)' },
}

function ValuationMethodCard({ label, price, color, bg, border, note }: {
  label: string; price: string; color: string; bg: string; border: string; note: string
}) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.12em', color, marginBottom: '10px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '28px', fontWeight: 600, color, lineHeight: 1, marginBottom: '10px' }}>
        {price}
      </div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#4a5568', lineHeight: 1.6 }}>
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

  const minV = Math.min(currentPrice, val.fairValue) * 0.85
  const maxV = Math.max(currentPrice, val.fairValue) * 1.15
  const range = maxV - minV
  const pricePct  = range > 0 ? ((currentPrice  - minV) / range) * 100 : 50
  const targetPct = range > 0 ? ((val.fairValue  - minV) / range) * 100 : 50

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <ValuationMethodCard
          label="MÉTHODE 1 — DCF"
          price={fmt(val.dcf)}
          color="#60a5fa"
          bg="rgba(96,165,250,0.06)"
          border="rgba(96,165,250,0.18)"
          note={`Projection FCF ${val.input.years ?? 5}ans + TV. WACC ${((val.input.wacc ?? 0.09) * 100).toFixed(1)}% · TGR ${((val.input.tgr ?? 0.035) * 100).toFixed(1)}%`}
        />
        <ValuationMethodCard
          label="MÉTHODE 2 — EV/MULTIPLE"
          price={fmt(val.multiple)}
          color={GOLD}
          bg="rgba(240,180,41,0.06)"
          border="rgba(240,180,41,0.18)"
          note={`Moyenne EV/EBITDA ${val.input.evEbitdaSector ?? '—'}× et EV/FCF ${val.input.evFcfSector ?? '—'}× secteur`}
        />
        <ValuationMethodCard
          label="MÉTHODE 3 — RI / EVA"
          price={fmt(val.residualIncome)}
          color="#c084fc"
          bg="rgba(192,132,252,0.06)"
          border="rgba(192,132,252,0.18)"
          note={`Book value/sh + Σ EVA actualisé + terminal RI. WACC ${((val.input.wacc ?? 0.09) * 100).toFixed(1)}%`}
        />
      </div>

      {/* Fair value summary */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${upsideColor}0a`, border: `1px solid ${upsideColor}25`,
        borderRadius: '12px', padding: '20px 28px', marginBottom: '24px',
      }}>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#4a5568', letterSpacing: '0.12em', marginBottom: '6px' }}>
            JUSTE VALEUR (MOYENNE 3 MÉTHODES)
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '40px', fontWeight: 600, color: '#e8eaf0', lineHeight: 1 }}>
            {fmt(val.fairValue)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#4a5568', letterSpacing: '0.12em', marginBottom: '6px' }}>
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

      {/* Visual bar */}
      <div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#4a5568', letterSpacing: '0.1em', marginBottom: '10px' }}>
          PRIX ACTUEL vs JUSTE VALEUR
        </div>
        <div style={{ position: 'relative', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
          <div style={{
            position: 'absolute',
            left: `${Math.min(pricePct, targetPct)}%`,
            width: `${Math.abs(targetPct - pricePct)}%`,
            height: '100%', background: `${upsideColor}30`, borderRadius: '3px',
          }} />
          <div style={{
            position: 'absolute', left: `${pricePct}%`, top: '-3px',
            width: '12px', height: '12px', borderRadius: '50%',
            background: '#e8eaf0', border: '2px solid rgba(232,234,240,0.4)',
            transform: 'translateX(-50%)',
          }} />
          <div style={{
            position: 'absolute', left: `${targetPct}%`, top: '-3px',
            width: '12px', height: '12px', borderRadius: '50%',
            background: upsideColor, border: `2px solid ${upsideColor}`,
            transform: 'translateX(-50%)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#8892a4' }}>
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

export default function StockDetail({ stockId }: StockDetailProps) {
  const stock = getStockById(stockId)
  const { prices } = usePrices()

  if (!stock) return (
    <div style={{ padding: '80px', textAlign: 'center', color: '#4a5568', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
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
    <div className="page-content">

      {/* ── Hero ── */}
      <div className="card" style={{
        padding: '40px 48px', marginBottom: '28px',
        background: 'linear-gradient(135deg, #161b27 0%, #1a1f30 50%, #161b27 100%)',
      }}>
        {/* Identity row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <CompanyLogo ticker={stock.id} size={80} />
            <div>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: '52px', fontWeight: 600, lineHeight: 1,
                background: `linear-gradient(90deg, ${GOLD}, #ffd166)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {stock.id}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', color: '#8892a4', marginTop: '4px' }}>
                {stock.name}
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#4a5568', letterSpacing: '0.08em' }}>
                  {stock.sector}
                </span>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(240,180,41,0.3)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,180,41,0.5)', letterSpacing: '0.08em' }}>
                  {stock.currency}
                </span>
              </div>
            </div>
          </div>
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em',
            color: vc.color, background: vc.bg, border: `1px solid ${vc.border}`, padding: '8px 20px', borderRadius: '20px',
          }}>
            {vc.label}
          </span>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(240,180,41,0.2), transparent)', marginBottom: '32px' }} />

        {/* Price row */}
        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#4a5568', letterSpacing: '0.12em', marginBottom: '6px' }}>
              PRIX RÉFÉRENCE
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '64px', fontWeight: 300, color: GOLD, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {curr}{stock.currency === 'JPY' ? livePrice.toLocaleString() : livePrice.toFixed(2)}
            </div>
          </div>
          <div style={{ width: '1px', height: '64px', background: 'rgba(255,255,255,0.06)' }} />
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#4a5568', letterSpacing: '0.12em', marginBottom: '6px' }}>
              JUSTE VALEUR
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '40px', fontWeight: 300, color: '#8892a4', lineHeight: 1 }}>
              {curr}{stock.currency === 'JPY' ? Math.round(val.fairValue).toLocaleString() : val.fairValue.toFixed(2)}
            </div>
          </div>
          <div style={{ width: '1px', height: '64px', background: 'rgba(255,255,255,0.06)' }} />
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#4a5568', letterSpacing: '0.12em', marginBottom: '8px' }}>
              UPSIDE
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: `${upsideColor}12`, border: `1px solid ${upsideColor}35`,
              borderRadius: '999px', padding: '10px 24px',
            }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '32px', fontWeight: 700, color: upsideColor, lineHeight: 1, letterSpacing: '-0.01em' }}>
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
          background: 'rgba(240,180,41,0.05)', border: '1px solid rgba(240,180,41,0.12)',
          borderLeft: '3px solid rgba(240,180,41,0.4)', borderRadius: '0 10px 10px 0',
          padding: '12px 18px', marginBottom: '28px',
        }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,180,41,0.6)', letterSpacing: '0.08em' }}>
            NOTE SECTORIELLE — {stock.sectorAdaptation}
          </span>
        </div>
      )}

      {/* 9-panel grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        <Panel title="Valorisation — 3 Méthodes" fullWidth>
          <ValuationPanel stockId={stock.id} currentPrice={livePrice} currency={stock.currency} />
        </Panel>

        <Panel title="Filtres Fondamentaux L1–L5">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {stock.filters.map(f => <FilterCard key={f.id} filter={f} />)}
          </div>
        </Panel>

        <Panel title="Moat — Fossé Concurrentiel">
          <MoatBar moat={stock.moat} score={stock.moatScore} />
        </Panel>

        <Panel title="Thèse d'Investissement">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stock.thesis.map((point, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '22px', height: '22px', border: '1px solid rgba(240,180,41,0.2)',
                  borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px', background: 'rgba(240,180,41,0.05)',
                }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,180,41,0.6)' }}>{i + 1}</span>
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#8892a4', lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: point }} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Scénarios DCF">
          <DCFScenarios scenarios={stock.dcf} fcfPerShare={stock.fcfPerShare} g={stock.fcfGrowthRate} currency={stock.currency} />
        </Panel>

        <Panel title="Calculateur FCF — Sensibilité">
          <FCFCalculator defaultPrice={livePrice} defaultFCF={stock.fcfPerShare} defaultG={stock.fcfGrowthRate} currency={stock.currency} />
        </Panel>

        <Panel title="Catalyseurs">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stock.catalysts.map((c, i) => <CatalystCard key={i} catalyst={c} index={i} />)}
          </div>
        </Panel>

        <Panel title="Position — Couche 8">
          <PositionPanel position={stock.position} />
        </Panel>

        <Panel title="Régime de Marché — Couche 7">
          <CyclePanel cycle={stock.cycle} />
        </Panel>

      </div>
    </div>
  )
}

import { getStockById } from '../data/stocks'
import FilterCard from './FilterCard'
import MoatBar from './MoatBar'
import DCFScenarios from './DCFScenarios'
import FCFCalculator from './FCFCalculator'
import CatalystCard from './CatalystCard'
import PositionPanel from './PositionPanel'
import CyclePanel from './CyclePanel'
import { calcFCFTarget, calcUpside, getUpsideColor, upsideColorMap, getStatusLabel } from '../utils/calculations'
import { usePrices } from '../hooks/usePrices'

interface StockDetailProps {
  stockId: string
  onBack: () => void
}

const GOLD = '#c9a84c'
const SURFACE = '#100f0c'
const BORDER = 'rgba(201,168,76,0.18)'

function Panel({ title, children, fullWidth = false }: { title: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      padding: '24px',
      gridColumn: fullWidth ? '1 / -1' : undefined,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', fontWeight: 400, color: '#f0ece0', letterSpacing: '0.04em' }}>
          {title}
        </h3>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.25), transparent)' }} />
      </div>
      {children}
    </div>
  )
}

export default function StockDetail({ stockId, onBack }: StockDetailProps) {
  const stock = getStockById(stockId)
  const { prices } = usePrices()

  if (!stock) return (
    <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(240,236,224,0.4)', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
      Stock non trouvé: {stockId}
    </div>
  )

  const livePrice = prices[stock.id] ?? stock.currentPrice
  const target = calcFCFTarget(stock.fcfPerShare, stock.fcfGrowthRate)
  const upside = calcUpside(livePrice, target)
  const color = upsideColorMap[getUpsideColor(upside)]
  const label = getStatusLabel(upside)
  const curr = stock.currency === 'JPY' ? '¥' : stock.currency === 'GBP' ? '£' : stock.currency === 'AUD' ? 'A$' : '$'

  const verdictConfig = {
    buy: { label: 'ACHAT', color: '#34d399' },
    watch: { label: 'SURVEILLANCE', color: '#fbbf24' },
    watchlist: { label: 'WATCHLIST', color: '#a09880' },
  }
  const vc = verdictConfig[stock.verdict] ?? verdictConfig.watchlist

  return (
    <div style={{ paddingTop: '32px', paddingBottom: '80px' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: '1px solid rgba(201,168,76,0.25)',
          color: 'rgba(201,168,76,0.7)',
          fontFamily: 'DM Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          padding: '6px 16px',
          cursor: 'pointer',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        ← PORTFOLIO OVERVIEW
      </button>

      {/* Stock header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '6px' }}>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '52px', fontWeight: 300, color: GOLD, lineHeight: 1 }}>
              {stock.id}
            </h1>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, color: 'rgba(240,236,224,0.65)' }}>
              {stock.name}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.4)', letterSpacing: '0.08em' }}>
              {stock.sector}
            </span>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(201,168,76,0.4)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(201,168,76,0.55)', letterSpacing: '0.08em' }}>
              {stock.currency}
            </span>
          </div>
        </div>

        {/* Price summary */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
          {/* Verdict */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.1em', marginBottom: '6px' }}>
              VERDICT
            </div>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: vc.color,
              background: `${vc.color}12`,
              border: `1px solid ${vc.color}30`,
              padding: '5px 14px',
            }}>
              {vc.label}
            </span>
          </div>

          {/* Current price */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.1em', marginBottom: '4px' }}>
              PRIX RÉFÉRENCE
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, color: '#f0ece0' }}>
              {curr}{stock.currency === 'JPY' ? livePrice.toLocaleString() : livePrice.toFixed(2)}
            </div>
          </div>

          {/* Target + upside */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.1em', marginBottom: '4px' }}>
              CIBLE FCF
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, color: GOLD }}>
              {curr}{stock.currency === 'JPY' ? Math.round(target).toLocaleString() : target.toFixed(2)}
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color, marginTop: '2px' }}>
              {upside >= 0 ? '+' : ''}{upside.toFixed(1)}% · {label}
            </div>
          </div>
        </div>
      </div>

      {/* Sector adaptation note */}
      {stock.sectorAdaptation && (
        <div style={{
          background: 'rgba(201,168,76,0.04)',
          border: '1px solid rgba(201,168,76,0.18)',
          borderLeft: '3px solid rgba(201,168,76,0.5)',
          padding: '10px 16px',
          marginBottom: '28px',
        }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(201,168,76,0.7)', letterSpacing: '0.08em' }}>
            NOTE SECTORIELLE — {stock.sectorAdaptation}
          </span>
        </div>
      )}

      {/* 8-panel grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Panel 1 — Filters L1-L5 */}
        <Panel title="Filtres Fondamentaux L1–L5">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stock.thesis.map((point, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(201,168,76,0.6)' }}>{i + 1}</span>
                </div>
                <p
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(240,236,224,0.75)', lineHeight: 1.7 }}
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

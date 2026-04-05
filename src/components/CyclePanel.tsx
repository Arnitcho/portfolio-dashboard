import type { CycleRegime } from '../data/stocks'

interface CyclePanelProps {
  cycle: CycleRegime
}

const natureConfig = {
  secular: { label: 'SÉCULAIRE', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)' },
  cyclical: { label: 'CYCLIQUE', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)' },
  structural: { label: 'STRUCTUREL', color: '#93c5fd', bg: 'rgba(147,197,253,0.08)', border: 'rgba(147,197,253,0.25)' },
}

export default function CyclePanel({ cycle }: CyclePanelProps) {
  const nat = natureConfig[cycle.nature] ?? natureConfig.secular

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Nature badge */}
      <div>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          color: nat.color,
          background: nat.bg,
          border: `1px solid ${nat.border}`,
          padding: '4px 12px',
        }}>
          {nat.label}
        </span>
      </div>

      {/* Assessment */}
      <div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.1em', marginBottom: '4px' }}>
          ÉVALUATION
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#f0ece0', lineHeight: 1.6 }}>
          {cycle.assessment}
        </p>
      </div>

      {/* FX Exposure */}
      <div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.1em', marginBottom: '4px' }}>
          EXPOSITION FX
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(240,236,224,0.75)', lineHeight: 1.5 }}>
          {cycle.fxExposure}
        </p>
      </div>

      {/* Cycle position */}
      <div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.1em', marginBottom: '4px' }}>
          POSITION DANS LE CYCLE
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(240,236,224,0.75)', lineHeight: 1.5 }}>
          {cycle.cyclePosition}
        </p>
      </div>

      {/* Macro risks */}
      <div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.1em', marginBottom: '8px' }}>
          RISQUES MACRO
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {cycle.macroRisks.map((risk, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '4px', height: '4px', background: '#f87171', flexShrink: 0, marginTop: '5px' }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(240,236,224,0.6)', lineHeight: 1.5 }}>
                {risk}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

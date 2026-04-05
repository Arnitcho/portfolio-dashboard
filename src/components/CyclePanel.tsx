import type { CycleRegime } from '../data/stocks'

interface CyclePanelProps {
  cycle: CycleRegime
}

const natureConfig = {
  secular:    { label: 'SÉCULAIRE',  color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)' },
  cyclical:   { label: 'CYCLIQUE',   color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.25)' },
  structural: { label: 'STRUCTUREL', color: '#93c5fd', bg: 'rgba(147,197,253,0.08)', border: 'rgba(147,197,253,0.25)' },
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'rgba(240,236,224,0.35)', letterSpacing: '0.12em', marginBottom: '6px' }}>
        {label}
      </div>
      {children}
    </div>
  )
}

export default function CyclePanel({ cycle }: CyclePanelProps) {
  const nat = natureConfig[cycle.nature] ?? natureConfig.secular

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Nature badge */}
      <div>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: nat.color,
          background: nat.bg,
          border: `1px solid ${nat.border}`,
          padding: '5px 14px',
          borderRadius: '999px',
        }}>
          {nat.label}
        </span>
      </div>

      <Field label="ÉVALUATION">
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#f0ece0', lineHeight: 1.7 }}>
          {cycle.assessment}
        </p>
      </Field>

      <Field label="EXPOSITION FX">
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(240,236,224,0.7)', lineHeight: 1.6 }}>
          {cycle.fxExposure}
        </p>
      </Field>

      <Field label="POSITION DANS LE CYCLE">
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(240,236,224,0.7)', lineHeight: 1.6 }}>
          {cycle.cyclePosition}
        </p>
      </Field>

      <Field label="RISQUES MACRO">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '2px' }}>
          {cycle.macroRisks.map((risk, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: '#f87171', flexShrink: 0, marginTop: '6px',
              }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(240,236,224,0.55)', lineHeight: 1.6 }}>
                {risk}
              </span>
            </div>
          ))}
        </div>
      </Field>
    </div>
  )
}

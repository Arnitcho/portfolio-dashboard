import type { Catalyst } from '../data/stocks'

interface CatalystCardProps {
  catalyst: Catalyst
  index: number
}

export default function CatalystCard({ catalyst, index }: CatalystCardProps) {
  return (
    <div style={{
      border: '1px solid rgba(201,168,76,0.18)',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Index watermark */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '12px',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '48px',
        fontWeight: 300,
        color: 'rgba(201,168,76,0.05)',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        {index + 1}
      </div>

      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.15em', marginBottom: '8px' }}>
        CATALYST {String(index + 1).padStart(2, '0')}
      </div>

      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#f0ece0', marginBottom: '8px' }}>
        {catalyst.title}
      </div>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(240,236,224,0.55)', lineHeight: 1.6 }}>
        {catalyst.description}
      </p>
    </div>
  )
}

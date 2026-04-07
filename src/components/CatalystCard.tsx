import type { Catalyst } from '../data/stocks'

interface CatalystCardProps {
  catalyst: Catalyst
  index: number
}

export default function CatalystCard({ catalyst, index }: CatalystCardProps) {
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '18px 20px',
      position: 'relative',
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.02)',
    }}>
      {/* Index watermark */}
      <div style={{
        position: 'absolute', top: '4px', right: '14px',
        fontFamily: 'Cormorant Garamond, serif', fontSize: '56px', fontWeight: 300,
        color: 'rgba(240,180,41,0.04)', lineHeight: 1, userSelect: 'none',
      }}>
        {index + 1}
      </div>

      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '8px', color: 'rgba(240,180,41,0.45)', letterSpacing: '0.15em', marginBottom: '10px' }}>
        CATALYST {String(index + 1).padStart(2, '0')}
      </div>

      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#e8eaf0', marginBottom: '8px', lineHeight: 1.4 }}>
        {catalyst.title}
      </div>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#4a5568', lineHeight: 1.7 }}>
        {catalyst.description}
      </p>
    </div>
  )
}

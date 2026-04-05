interface NavProps {
  view: string
  onNavigate: (view: string) => void
}

const GOLD = '#c9a84c'
const BG = '#0a0906'

export default function Nav({ view, onNavigate }: NavProps) {
  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'prices',   label: 'PRICE MONITOR' },
  ]

  return (
    <header style={{
      backgroundColor: BG,
      borderBottom: '1px solid rgba(201,168,76,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '70px', gap: '48px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexShrink: 0 }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '26px',
              fontWeight: 600,
              color: GOLD,
              letterSpacing: '0.06em',
              lineHeight: 1,
            }}>
              PORTFOLIO
            </span>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              color: 'rgba(201,168,76,0.45)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              INTELLIGENCE
            </span>
          </div>

          {/* Tabs */}
          <nav style={{ display: 'flex', height: '100%' }}>
            {tabs.map(tab => {
              const active = view === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent',
                    color: active ? GOLD : 'rgba(240,236,224,0.4)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    fontWeight: active ? 500 : 400,
                    letterSpacing: '0.13em',
                    cursor: 'pointer',
                    padding: '0 24px',
                    height: '100%',
                    transition: 'color 0.2s, border-color 0.2s',
                    textShadow: active ? `0 0 20px rgba(201,168,76,0.4)` : 'none',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>

          {/* Date */}
          <div style={{ marginLeft: 'auto', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(240,236,224,0.25)', letterSpacing: '0.05em' }}>
            {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>
    </header>
  )
}

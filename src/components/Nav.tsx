interface NavProps {
  view: string
  onNavigate: (view: string) => void
}

const GOLD = '#c9a84c'
const BG = '#0a0906'

export default function Nav({ view, onNavigate }: NavProps) {
  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'prices', label: 'PRICE MONITOR' },
  ]

  return (
    <header style={{
      backgroundColor: BG,
      borderBottom: '1px solid rgba(201,168,76,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '56px', gap: '48px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexShrink: 0 }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '20px',
              fontWeight: 600,
              color: GOLD,
              letterSpacing: '0.05em',
            }}>
              PORTFOLIO
            </span>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              fontWeight: 400,
              color: 'rgba(201,168,76,0.5)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              INTELLIGENCE
            </span>
          </div>

          {/* Nav tabs */}
          <nav style={{ display: 'flex', gap: '0', height: '100%' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: view === tab.id ? `2px solid ${GOLD}` : '2px solid transparent',
                  color: view === tab.id ? GOLD : 'rgba(240,236,224,0.45)',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  padding: '0 20px',
                  height: '100%',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right: timestamp */}
          <div style={{ marginLeft: 'auto', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(240,236,224,0.3)' }}>
            {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>
    </header>
  )
}

interface NavProps {
  view: string
  onNavigate: (view: string) => void
}

const GOLD = '#f0b429'

export default function Nav({ view, onNavigate }: NavProps) {
  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'prices',   label: 'PRICE MONITOR' },
  ]

  return (
    <header style={{
      backgroundColor: '#0d1120',
      borderBottom: `1px solid ${GOLD}22`,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(16px)',
      boxShadow: '0 1px 0 rgba(240,180,41,0.12)',
    }}>
      {/* thin gold accent line at very bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${GOLD}30, transparent)` }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '70px', gap: '48px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexShrink: 0 }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '26px',
              fontWeight: 600,
              background: `linear-gradient(90deg, ${GOLD}, #ffd166)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.06em',
              lineHeight: 1,
            }}>
              PORTFOLIO
            </span>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              color: 'rgba(240,180,41,0.4)',
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
                    color: active ? GOLD : '#8892a4',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    fontWeight: active ? 600 : 400,
                    letterSpacing: '0.13em',
                    cursor: 'pointer',
                    padding: '0 24px',
                    height: '100%',
                    transition: 'color 0.2s, border-color 0.2s',
                    textShadow: active ? `0 0 20px rgba(240,180,41,0.5)` : 'none',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>

          {/* Date */}
          <div style={{ marginLeft: 'auto', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4a5568', letterSpacing: '0.05em' }}>
            {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>
    </header>
  )
}

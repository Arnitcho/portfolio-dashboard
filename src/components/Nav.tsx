interface NavProps {
  view: string
  onNavigate: (view: string) => void
  stockId?: string | null
  onBack?: () => void
}

const GOLD = '#e8a020'

export default function Nav({ view, onNavigate, stockId, onBack }: NavProps) {
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'prices',   label: 'Prix & Upside' },
  ]

  return (
    <header style={{
      backgroundColor: '#161410',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(240,220,160,0.08)',
    }}>
      {/* Thin gold accent at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent, ${GOLD}28, transparent)`,
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '4.375rem', gap: '3rem' }}>

          {/* Logo */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0, cursor: 'pointer' }}
            onClick={() => onNavigate('overview')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onNavigate('overview')}
          >
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.4375rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              lineHeight: 1,
              background: `linear-gradient(90deg, ${GOLD}, #f5c842)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              PORTFOLIO
            </span>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.5rem',
              color: 'rgba(232,160,32,0.35)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}>
              Framework 8 couches
            </span>
          </div>

          {/* Navigation — tabs or breadcrumb */}
          {view === 'detail' && stockId ? (
            /* Breadcrumb in detail mode */
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => onNavigate('overview')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Mono, monospace', fontSize: '0.6875rem',
                  color: '#6b6352', letterSpacing: '0.08em',
                  transition: 'color 0.2s', padding: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#b0a88a')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b6352')}
              >
                Vue d'ensemble
              </button>
              <span style={{ color: '#6b6352', fontSize: '0.75rem' }}>›</span>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '0.6875rem',
                fontWeight: 600, color: GOLD, letterSpacing: '0.1em',
              }}>
                {stockId}
              </span>
            </nav>
          ) : (
            /* Standard tabs */
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
                      color: active ? GOLD : '#6b6352',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '0.8125rem',
                      fontWeight: active ? 600 : 400,
                      letterSpacing: '0.02em',
                      cursor: 'pointer',
                      padding: '0 1.25rem',
                      height: '100%',
                      transition: 'color 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#b0a88a' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#6b6352' }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          )}

          {/* Right: date + back button in detail */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {view === 'detail' && onBack && (
              <button
                onClick={onBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  background: 'rgba(240,220,160,0.04)',
                  border: '1px solid rgba(240,220,160,0.08)',
                  borderRadius: '0.5rem',
                  color: '#b0a88a', fontFamily: 'DM Mono, monospace',
                  fontSize: '0.625rem', letterSpacing: '0.1em',
                  padding: '0.4rem 0.875rem', cursor: 'pointer',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.borderColor = 'rgba(232,160,32,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#b0a88a'; e.currentTarget.style.borderColor = 'rgba(240,220,160,0.08)' }}
              >
                ← RETOUR
              </button>
            )}
            <time
              dateTime={new Date().toISOString().slice(0, 10)}
              style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.625rem', color: '#6b6352', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
            >
              {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </time>
          </div>

        </div>
      </div>
    </header>
  )
}

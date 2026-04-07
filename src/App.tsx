import { useState } from 'react'
import Nav from './components/Nav'
import Overview from './components/Overview'
import PriceMonitor from './components/PriceMonitor'
import StockDetail from './components/StockDetail'

export type View = 'overview' | 'prices' | 'detail'

function App() {
  const [view, setView] = useState<View>('overview')
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null)

  function handleSelectStock(id: string) {
    setSelectedStockId(id)
    setView('detail')
  }

  function handleBack() {
    setView('overview')
    setSelectedStockId(null)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
      <Nav
        view={view}
        onNavigate={v => setView(v as View)}
        stockId={view === 'detail' ? selectedStockId : null}
        onBack={handleBack}
      />
      <div className="page-container">
        {view === 'overview' && <Overview onSelectStock={handleSelectStock} />}
        {view === 'prices'   && <PriceMonitor onSelectStock={handleSelectStock} />}
        {view === 'detail'   && selectedStockId && (
          <StockDetail stockId={selectedStockId} />
        )}
      </div>
    </div>
  )
}

export default App

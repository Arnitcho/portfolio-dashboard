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
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0906', color: '#f0ece0' }}>
      {view !== 'detail' && (
        <Nav view={view} onNavigate={(v) => setView(v as 'overview' | 'prices')} />
      )}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        {view === 'overview' && (
          <Overview onSelectStock={handleSelectStock} />
        )}
        {view === 'prices' && (
          <PriceMonitor onSelectStock={handleSelectStock} />
        )}
        {view === 'detail' && selectedStockId && (
          <StockDetail stockId={selectedStockId} onBack={handleBack} />
        )}
      </div>
    </div>
  )
}

export default App

import { useState, useEffect, useCallback } from 'react'
import { stocks } from '../data/stocks'

const TWELVE_DATA_API_KEY = 'API_KEY_PLACEHOLDER'
const CACHE_KEY = 'portfolio_prices_cache'
const CACHE_TS_KEY = 'portfolio_prices_ts'
const REFRESH_INTERVAL = 15 * 60 * 1000 // 15 minutes

export type PriceStatus = 'live' | 'cached' | 'error' | 'idle'

export interface PriceData {
  [symbol: string]: number
}

interface PriceState {
  prices: PriceData
  status: PriceStatus
  lastUpdated: Date | null
  error: string | null
}

function loadCache(): { prices: PriceData; ts: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const ts = localStorage.getItem(CACHE_TS_KEY)
    if (raw && ts) {
      return { prices: JSON.parse(raw) as PriceData, ts: parseInt(ts) }
    }
  } catch { /* empty */ }
  return null
}

function saveCache(prices: PriceData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(prices))
    localStorage.setItem(CACHE_TS_KEY, Date.now().toString())
  } catch { /* empty */ }
}

// Map stock id → twelvedata symbol
const symbolMap: Record<string, string> = Object.fromEntries(
  stocks.map(s => [s.twelveDataSymbol, s.id])
)

export function usePrices() {
  const [state, setState] = useState<PriceState>(() => {
    const cached = loadCache()
    const defaultPrices: PriceData = Object.fromEntries(stocks.map(s => [s.id, s.currentPrice]))
    if (cached && Date.now() - cached.ts < REFRESH_INTERVAL) {
      return {
        prices: { ...defaultPrices, ...cached.prices },
        status: 'cached',
        lastUpdated: new Date(cached.ts),
        error: null,
      }
    }
    return {
      prices: defaultPrices,
      status: 'idle',
      lastUpdated: null,
      error: null,
    }
  })

  const fetchPrices = useCallback(async () => {
    if (TWELVE_DATA_API_KEY === 'API_KEY_PLACEHOLDER') {
      setState(prev => ({ ...prev, status: 'error', error: 'API key not configured' }))
      return
    }

    const symbols = stocks.map(s => s.twelveDataSymbol).join(',')
    const url = `https://api.twelvedata.com/price?symbol=${encodeURIComponent(symbols)}&apikey=${TWELVE_DATA_API_KEY}`

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as Record<string, { price?: string } | string>

      const newPrices: PriceData = {}

      for (const [sym, val] of Object.entries(data)) {
        const stockId = symbolMap[sym]
        if (!stockId) continue
        const price = typeof val === 'object' && val.price
          ? parseFloat(val.price)
          : typeof val === 'string'
          ? parseFloat(val)
          : NaN
        if (!isNaN(price)) newPrices[stockId] = price
      }

      saveCache(newPrices)
      setState(prev => ({
        prices: { ...prev.prices, ...newPrices },
        status: 'live',
        lastUpdated: new Date(),
        error: null,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      }))
    }
  }, [])

  // Auto-fetch on mount and every 15 min
  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchPrices])

  function setManualPrice(stockId: string, price: number) {
    setState(prev => ({
      ...prev,
      prices: { ...prev.prices, [stockId]: price },
    }))
  }

  return { ...state, fetchPrices, setManualPrice }
}

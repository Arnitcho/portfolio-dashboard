// ============================================================
// PORTFOLIO INTELLIGENCE — valuation.ts
// 3-method valuation engine: DCF · EV/Multiple · Residual Income
// ============================================================

export interface ValuationInput {
  id: string
  currency: string
  shares: number          // millions
  fcfPerShare: number
  g: number               // FCF growth rate
  wacc: number
  tgr: number             // terminal growth rate
  years: number           // projection horizon
  ebitda: number          // millions
  fcfTotal: number        // millions
  netDebt: number         // millions (negative = net cash)
  evEbitdaSector: number  // sector median multiple
  evFcfSector: number     // sector median multiple
  bookValuePerShare: number
  nopat: number           // millions
  investedCapital: number // millions
}

export interface ValuationResult {
  dcf: number
  multiple: number
  residualIncome: number
  fairValue: number
  upside: number          // % vs current price
}

// ──────────────────────────────────────────────────────────────
// Raw data for all 11 stocks
// ──────────────────────────────────────────────────────────────
export const valuationData: ValuationInput[] = [
  {
    id: 'FTNT', currency: 'USD', shares: 743,
    fcfPerShare: 3.20, g: 0.15, wacc: 0.09, tgr: 0.035, years: 5,
    ebitda: 2200, fcfTotal: 2376, netDebt: -2003,
    evEbitdaSector: 28, evFcfSector: 32,
    bookValuePerShare: 1.80, nopat: 1900, investedCapital: 3570,
  },
  {
    id: 'MSCI', currency: 'USD', shares: 77.6,
    fcfPerShare: 22.50, g: 0.12, wacc: 0.09, tgr: 0.04, years: 5,
    ebitda: 1750, fcfTotal: 1746, netDebt: 3300,
    evEbitdaSector: 32, evFcfSector: 38,
    bookValuePerShare: 12.50, nopat: 1450, investedCapital: 2640,
  },
  {
    id: 'ICE', currency: 'USD', shares: 570,
    fcfPerShare: 9.50, g: 0.10, wacc: 0.085, tgr: 0.035, years: 5,
    ebitda: 6489, fcfTotal: 4200, netDebt: 18763,
    evEbitdaSector: 19, evFcfSector: 25,
    bookValuePerShare: 52.80, nopat: 4000, investedCapital: 64260,
  },
  {
    id: 'BN', currency: 'USD', shares: 1580,
    fcfPerShare: 2.27, g: 0.18, wacc: 0.10, tgr: 0.04, years: 5,
    ebitda: 8500, fcfTotal: 5400, netDebt: 0,
    evEbitdaSector: 18, evFcfSector: 22,
    bookValuePerShare: 28.50, nopat: 4800, investedCapital: 48000,
  },
  {
    id: 'MA', currency: 'USD', shares: 885,
    fcfPerShare: 15.80, g: 0.13, wacc: 0.09, tgr: 0.04, years: 5,
    ebitda: 20440, fcfTotal: 16430, netDebt: 11610,
    evEbitdaSector: 28, evFcfSector: 30,
    bookValuePerShare: 8.62, nopat: 15500, investedCapital: 35280,
  },
  {
    id: 'TDG', currency: 'USD', shares: 56.5,
    fcfPerShare: 35.00, g: 0.12, wacc: 0.095, tgr: 0.03, years: 5,
    ebitda: 4569, fcfTotal: 1977, netDebt: 20800,
    evEbitdaSector: 22, evFcfSector: 28,
    bookValuePerShare: -85.00, nopat: 2800, investedCapital: 29540,
  },
  {
    id: 'BMI', currency: 'USD', shares: 29.2,
    fcfPerShare: 4.10, g: 0.13, wacc: 0.09, tgr: 0.035, years: 5,
    ebitda: 245, fcfTotal: 170, netDebt: -213,
    evEbitdaSector: 22, evFcfSector: 28,
    bookValuePerShare: 19.80, nopat: 165, investedCapital: 852,
  },
  {
    id: 'WTS', currency: 'USD', shares: 33.5,
    fcfPerShare: 10.60, g: 0.10, wacc: 0.095, tgr: 0.03, years: 5,
    ebitda: 535, fcfTotal: 356, netDebt: -207,
    evEbitdaSector: 18, evFcfSector: 22,
    bookValuePerShare: 42.50, nopat: 380, investedCapital: 2000,
  },
  {
    id: '6861', currency: 'JPY', shares: 242.5,
    fcfPerShare: 4460, g: 0.09, wacc: 0.085, tgr: 0.03, years: 5,
    ebitda: 600000, fcfTotal: 385000, netDebt: -583000,
    evEbitdaSector: 28, evFcfSector: 38,
    bookValuePerShare: 8200, nopat: 520000, investedCapital: 4600000,
  },
  {
    id: 'COH', currency: 'AUD', shares: 65.5,
    fcfPerShare: 2.67, g: 0.11, wacc: 0.09, tgr: 0.04, years: 5,
    ebitda: 610, fcfTotal: 175, netDebt: -173,
    evEbitdaSector: 35, evFcfSector: 55,
    bookValuePerShare: 14.20, nopat: 420, investedCapital: 2740,
  },
  {
    id: 'SPX', currency: 'GBP', shares: 74.8,
    fcfPerShare: 1.30, g: 0.09, wacc: 0.095, tgr: 0.03, years: 5,
    ebitda: 408, fcfTotal: 199, netDebt: 565,
    evEbitdaSector: 18, evFcfSector: 22,
    bookValuePerShare: 22.40, nopat: 295, investedCapital: 3110,
  },
]

// ──────────────────────────────────────────────────────────────
// METHOD 1 — DCF (Discounted Cash Flow)
// ──────────────────────────────────────────────────────────────
export function calcDCF(d: ValuationInput): number {
  const { fcfPerShare, g, wacc, tgr, years } = d
  if (wacc <= tgr) return 0

  let pv = 0
  for (let n = 1; n <= years; n++) {
    const fcfN = fcfPerShare * Math.pow(1 + g, n)
    pv += fcfN / Math.pow(1 + wacc, n)
  }

  const fcfFinal = fcfPerShare * Math.pow(1 + g, years)
  const terminalValue = (fcfFinal * (1 + tgr)) / (wacc - tgr)
  const terminalPV = terminalValue / Math.pow(1 + wacc, years)

  return pv + terminalPV
}

// ──────────────────────────────────────────────────────────────
// METHOD 2 — EV/Multiple (average of EV/EBITDA and EV/FCF)
// ──────────────────────────────────────────────────────────────
export function calcMultiple(d: ValuationInput): number {
  const { ebitda, fcfTotal, netDebt, evEbitdaSector, evFcfSector, shares } = d

  const evFromEbitda = ebitda * evEbitdaSector
  const evFromFcf = fcfTotal * evFcfSector
  const avgEV = (evFromEbitda + evFromFcf) / 2
  const equityValue = avgEV - netDebt
  return equityValue / shares  // per share (same currency units)
}

// ──────────────────────────────────────────────────────────────
// METHOD 3 — Residual Income / EVA
// ──────────────────────────────────────────────────────────────
export function calcResidualIncome(d: ValuationInput): number {
  const { bookValuePerShare, nopat, investedCapital, shares, wacc, tgr, years } = d

  // Fallback for negative book value (e.g. TDG buybacks)
  if (bookValuePerShare <= 0) {
    return d.fcfPerShare * 15
  }

  const nopatPerShare = nopat / shares
  const icPerShare = investedCapital / shares
  const evaPerShare = nopatPerShare - icPerShare * wacc

  let pvRI = 0
  for (let n = 1; n <= years; n++) {
    pvRI += evaPerShare / Math.pow(1 + wacc, n)
  }

  // Terminal RI: perpetuity with growth
  const terminalRI = wacc > tgr
    ? (evaPerShare / (wacc - tgr)) / Math.pow(1 + wacc, years)
    : 0

  return bookValuePerShare + pvRI + terminalRI
}

// ──────────────────────────────────────────────────────────────
// FAIR VALUE = average of 3 methods
// ──────────────────────────────────────────────────────────────
export function calcFairValue(d: ValuationInput): ValuationResult {
  const dcf = calcDCF(d)
  const multiple = calcMultiple(d)
  const residualIncome = calcResidualIncome(d)
  const fairValue = (dcf + multiple + residualIncome) / 3

  return { dcf, multiple, residualIncome, fairValue, upside: 0 }
}

// ──────────────────────────────────────────────────────────────
// Lookup helper
// ──────────────────────────────────────────────────────────────
const _cache = new Map<string, ValuationResult & { input: ValuationInput }>()

export function getValuation(id: string, currentPrice: number): ValuationResult & { input: ValuationInput } {
  const cacheKey = `${id}:${currentPrice}`
  if (_cache.has(cacheKey)) return _cache.get(cacheKey)!

  const input = valuationData.find(d => d.id === id)
  if (!input) {
    const fallback = { dcf: 0, multiple: 0, residualIncome: 0, fairValue: 0, upside: 0, input: {} as ValuationInput }
    return fallback
  }

  const result = calcFairValue(input)
  result.upside = currentPrice > 0 ? ((result.fairValue - currentPrice) / currentPrice) * 100 : 0

  const out = { ...result, input }
  _cache.set(cacheKey, out)
  return out
}

// ──────────────────────────────────────────────────────────────
// Upside color scale (per spec)
// ──────────────────────────────────────────────────────────────
export function getUpsideColorNew(pct: number): string {
  if (pct > 30)  return '#22c55e'
  if (pct > 10)  return '#86efac'
  if (pct > -10) return '#fbbf24'
  if (pct > -25) return '#f97316'
  return '#ef4444'
}

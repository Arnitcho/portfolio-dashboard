export function calcFCFTarget(fcfPerShare: number, g: number, r = 0.15): number {
  if (r <= g) return 0
  return (fcfPerShare * Math.pow(1 + g, 3)) / (r - g)
}

export function calcUpside(currentPrice: number, targetPrice: number): number {
  if (!currentPrice || currentPrice === 0) return 0
  return ((targetPrice - currentPrice) / currentPrice) * 100
}

export type UpsideColor = 'deep-green' | 'green' | 'light-green' | 'amber' | 'orange' | 'red' | 'deep-red'

export function getUpsideColor(pct: number): UpsideColor {
  if (pct > 40) return 'deep-green'
  if (pct > 20) return 'green'
  if (pct > 5) return 'light-green'
  if (pct > -5) return 'amber'
  if (pct > -20) return 'orange'
  if (pct > -35) return 'red'
  return 'deep-red'
}

export const upsideColorMap: Record<UpsideColor, string> = {
  'deep-green': '#34d399',
  'green': '#6ee7b7',
  'light-green': '#a7f3d0',
  'amber': '#fbbf24',
  'orange': '#f97316',
  'red': '#f87171',
  'deep-red': '#ef4444',
}

export type StatusLabel =
  | 'FORTE DÉCOTE'
  | 'DÉCOTE'
  | 'LÉGÈRE DÉCOTE'
  | 'JUSTE PRIX'
  | 'LÉGÈRE PRIME'
  | 'PRIME'
  | 'FORTE PRIME'

export function getStatusLabel(pct: number): StatusLabel {
  if (pct > 40) return 'FORTE DÉCOTE'
  if (pct > 20) return 'DÉCOTE'
  if (pct > 5) return 'LÉGÈRE DÉCOTE'
  if (pct > -5) return 'JUSTE PRIX'
  if (pct > -20) return 'LÉGÈRE PRIME'
  if (pct > -35) return 'PRIME'
  return 'FORTE PRIME'
}

export function formatUpside(pct: number): string {
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}

export function formatPrice(price: number, currency = 'USD'): string {
  if (currency === 'JPY') return `¥${price.toLocaleString()}`
  if (currency === 'GBP') return `£${price.toFixed(2)}`
  if (currency === 'AUD') return `A$${price.toFixed(2)}`
  return `$${price.toFixed(2)}`
}

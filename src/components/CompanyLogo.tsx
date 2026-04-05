import { useState } from 'react'

const DOMAIN_MAP: Record<string, string> = {
  FTNT:  'fortinet.com',
  MSCI:  'msci.com',
  ICE:   'theice.com',
  BN:    'brookfield.com',
  MA:    'mastercard.com',
  TDG:   'transdigm.com',
  BMI:   'badgermeter.com',
  WTS:   'watts.com',
  '6861':'keyence.com',
  COH:   'cochlear.com',
  SPX:   'spiraxsarco.com',
}

interface CompanyLogoProps {
  ticker: string
  size?: number
}

export default function CompanyLogo({ ticker, size = 40 }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false)
  const domain = DOMAIN_MAP[ticker]
  const radius = Math.round(size * 0.25)

  if (!domain || failed) {
    // Fallback: ticker initials in gold circle
    const initials = ticker.replace(/[0-9]/g, '').slice(0, 2) || ticker.slice(0, 2)
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(201,168,76,0.15)',
        border: '1px solid rgba(201,168,76,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: Math.round(size * 0.3),
          fontWeight: 600,
          color: '#c9a84c',
          letterSpacing: '-0.02em',
        }}>
          {initials}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: radius,
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={ticker}
        onError={() => setFailed(true)}
        style={{ width: size * 0.75, height: size * 0.75, objectFit: 'contain' }}
      />
    </div>
  )
}

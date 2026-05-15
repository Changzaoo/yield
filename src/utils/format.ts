export const formatUSD = (value: number, compact = false): string => {
  if (compact) {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
    return `$${value.toFixed(2)}`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export const formatBRL = (value: number, compact = false): string => {
  if (compact) {
    if (value >= 1e9) return `R$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `R$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `R$${(value / 1e3).toFixed(1)}K`
    return `R$${value.toFixed(2)}`
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export const formatAPY = (value: number | null): string => {
  if (value === null || value === undefined) return '—'
  if (value > 10000) return '>10,000%'
  return `${value.toFixed(2)}%`
}

export const formatTVL = (value: number, currency: 'USD' | 'BRL' = 'USD', usdBrl = 1): string => {
  const v = currency === 'BRL' ? value * usdBrl : value
  const prefix = currency === 'BRL' ? 'R$' : '$'
  if (v >= 1e9) return `${prefix}${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `${prefix}${(v / 1e6).toFixed(2)}M`
  if (v >= 1e3) return `${prefix}${(v / 1e3).toFixed(1)}K`
  return `${prefix}${v.toFixed(0)}`
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

export const formatAddress = (address: string, chars = 6): string => {
  if (!address) return ''
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor(Date.now() / 1000 - timestamp)
  if (seconds < 60) return `${seconds}s atrás`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  const days = Math.floor(hours / 24)
  return `${days}d atrás`
}

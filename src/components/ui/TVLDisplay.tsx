import { formatTVL } from '@/utils/format'

interface TVLDisplayProps {
  value: number
  currency?: 'USD' | 'BRL'
  usdBrl?: number
  size?: 'sm' | 'md'
}

export const TVLDisplay = ({ value, currency = 'USD', usdBrl = 1, size = 'sm' }: TVLDisplayProps) => {
  return (
    <span className={`tabular-nums font-semibold text-[#e8eaf0] ${size === 'md' ? 'text-sm' : 'text-xs'}`}>
      {formatTVL(value, currency, usdBrl)}
    </span>
  )
}

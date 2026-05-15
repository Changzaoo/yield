import { getChainConfig } from '@/config/chains'
import { cn } from './cn'

interface ChainBadgeProps {
  chain: string
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export const ChainBadge = ({ chain, showLabel = true, size = 'sm', className }: ChainBadgeProps) => {
  const cfg = getChainConfig(chain)
  const color = cfg?.color ?? '#8b93a8'
  const label = cfg?.label ?? chain

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
      style={{
        backgroundColor: `${color}15`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      <span className="font-mono text-[10px]">{cfg?.logo ?? '●'}</span>
      {showLabel && label}
    </span>
  )
}

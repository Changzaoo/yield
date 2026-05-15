import { formatAPY } from '@/utils/format'
import { cn } from './cn'

interface APYBadgeProps {
  apy: number | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const getApyColor = (apy: number | null): string => {
  if (apy === null) return 'text-[#5a6278]'
  if (apy >= 100) return 'text-red-400'
  if (apy >= 30) return 'text-amber-400'
  if (apy >= 5) return 'text-emerald-400'
  return 'text-sky-400'
}

const sizeClasses: Record<string, string> = {
  sm: 'text-xs font-semibold',
  md: 'text-sm font-bold',
  lg: 'text-lg font-bold',
}

export const APYBadge = ({ apy, size = 'md', className }: APYBadgeProps) => {
  return (
    <span className={cn(getApyColor(apy), sizeClasses[size], 'tabular-nums', className)}>
      {formatAPY(apy)}
    </span>
  )
}

export const APYBreakdown = ({
  apyBase,
  apyReward,
  total,
}: {
  apyBase: number | null
  apyReward: number | null
  total: number
}) => {
  const hasReward = apyReward != null && apyReward > 0
  return (
    <div className="flex flex-col gap-0.5">
      <APYBadge apy={total} size="sm" />
      {hasReward && (
        <div className="flex gap-2 text-xs text-[#5a6278]">
          <span>Base: {formatAPY(apyBase)}</span>
          <span>Reward: {formatAPY(apyReward)}</span>
        </div>
      )}
    </div>
  )
}

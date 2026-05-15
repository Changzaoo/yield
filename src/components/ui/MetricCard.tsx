import { type ReactNode } from 'react'
import { cn } from './cn'
import { Skeleton } from './Skeleton'

interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: ReactNode
  trend?: { value: number; positive: boolean }
  highlight?: boolean
  loading?: boolean
  className?: string
}

export const MetricCard = ({
  label,
  value,
  sub,
  icon,
  trend,
  highlight,
  loading,
  className,
}: MetricCardProps) => {
  if (loading) {
    return (
      <div className={cn('rounded-xl border border-[#2a3040] bg-[#111318] p-4 space-y-2', className)}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-xl border bg-[#111318] p-4 space-y-1 transition-all duration-200',
        highlight
          ? 'border-teal-500/40 shadow-lg shadow-teal-900/20'
          : 'border-[#2a3040] hover:border-[#3d4560]',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#5a6278] font-medium uppercase tracking-wide">{label}</span>
        {icon && <span className="text-[#5a6278]">{icon}</span>}
      </div>
      <div className={cn('text-xl font-bold', highlight ? 'gradient-text' : 'text-[#e8eaf0]')}>
        {value}
      </div>
      <div className="flex items-center gap-2">
        {sub && <span className="text-xs text-[#5a6278]">{sub}</span>}
        {trend && (
          <span className={cn('text-xs font-medium', trend.positive ? 'text-emerald-400' : 'text-red-400')}>
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  )
}

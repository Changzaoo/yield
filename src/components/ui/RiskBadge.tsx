import { type RiskLabel } from '@/types/defi'
import { cn } from './cn'

interface RiskBadgeProps {
  label: RiskLabel
  score?: number
  showScore?: boolean
  size?: 'sm' | 'md'
}

const config: Record<RiskLabel, { bg: string; text: string; dot: string }> = {
  'Baixo':    { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'Moderado': { bg: 'bg-amber-500/10',   text: 'text-amber-400',   dot: 'bg-amber-400' },
  'Alto':     { bg: 'bg-orange-500/10',  text: 'text-orange-400',  dot: 'bg-orange-400' },
  'Crítico':  { bg: 'bg-red-500/10',     text: 'text-red-400',     dot: 'bg-red-400' },
}

export const RiskBadge = ({ label, score, showScore, size = 'sm' }: RiskBadgeProps) => {
  const c = config[label]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium border',
        c.bg,
        c.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        `border-${c.text.replace('text-', '')}/20`
      )}
    >
      <span className={cn('rounded-full flex-shrink-0', c.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {label}
      {showScore && score !== undefined && (
        <span className="opacity-70 font-normal">({score})</span>
      )}
    </span>
  )
}

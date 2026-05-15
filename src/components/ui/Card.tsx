import { type ReactNode } from 'react'
import { cn } from './cn'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  neon?: boolean
  highlight?: boolean
}

export const Card = ({ children, className, hover, glass, neon, highlight }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-xl border bg-[#111318] p-4',
        highlight ? 'border-teal-500/40 shadow-lg shadow-teal-900/20' : 'border-[#2a3040]',
        hover && 'hover:border-teal-500/30 hover:bg-[#141820] transition-all duration-200 cursor-pointer',
        glass && 'glass',
        neon && 'neon-glow',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

export const CardHeader = ({ title, description, action, icon, className }: CardHeaderProps) => (
  <div className={cn('flex items-start justify-between mb-4', className)}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-semibold text-[#e8eaf0] text-sm">{title}</h3>
        {description && <p className="text-xs text-[#5a6278] mt-0.5">{description}</p>}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
)

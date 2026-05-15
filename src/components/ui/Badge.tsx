import { type ReactNode } from 'react'
import { cn } from './cn'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

const variantClasses: Record<string, string> = {
  default: 'bg-[#1f2330] text-[#8b93a8] border border-[#2a3040]',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
  info: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  outline: 'bg-transparent text-[#8b93a8] border border-[#2a3040]',
}

export const Badge = ({ children, variant = 'default', size = 'sm', className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

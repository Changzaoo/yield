import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react'
import { cn } from './cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses: Record<string, string> = {
  primary: 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/30',
  secondary: 'bg-[#1f2330] hover:bg-[#252b38] text-[#e8eaf0] border border-[#2a3040]',
  ghost: 'bg-transparent hover:bg-[#1f2330] text-[#8b93a8] hover:text-[#e8eaf0]',
  danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30',
  outline: 'bg-transparent border border-teal-600/50 text-teal-400 hover:bg-teal-600/10',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500/50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)
Button.displayName = 'Button'

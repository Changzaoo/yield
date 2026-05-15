import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode
  rightElement?: ReactNode
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, rightElement, error, className, ...props }, ref) => {
    return (
      <div className="relative flex flex-col gap-1">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#5a6278] pointer-events-none">{leftIcon}</div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-[#1f2330] border border-[#2a3040] text-[#e8eaf0] placeholder-[#5a6278] rounded-lg py-2 px-3 text-sm',
              'focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-colors',
              leftIcon && 'pl-9',
              rightElement && 'pr-10',
              error && 'border-red-500/50 focus:border-red-500',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 text-[#5a6278]">{rightElement}</div>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full bg-[#1f2330] border border-[#2a3040] text-[#e8eaf0] rounded-lg py-2 px-3 text-sm',
          'focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-colors',
          'appearance-none cursor-pointer',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    )
  }
)
Select.displayName = 'Select'

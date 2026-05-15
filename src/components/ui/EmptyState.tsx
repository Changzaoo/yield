import { type ReactNode } from 'react'
import { SearchX } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="w-14 h-14 rounded-2xl bg-[#1f2330] flex items-center justify-center text-[#5a6278] mb-4">
      {icon ?? <SearchX size={24} />}
    </div>
    <h3 className="text-[#e8eaf0] font-semibold text-base mb-1">{title}</h3>
    {description && <p className="text-[#5a6278] text-sm max-w-xs">{description}</p>}
    {action && (
      <Button variant="secondary" size="sm" className="mt-4" onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
)

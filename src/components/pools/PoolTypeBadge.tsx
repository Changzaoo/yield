import type { PoolType } from '@/types/defi'
import { Badge } from '@/components/ui/Badge'

const CONFIG: Record<PoolType, { label: string; variant: 'info' | 'success' | 'purple' | 'warning' | 'default' | 'danger' | 'outline' }> = {
  Stable:   { label: 'Stable',   variant: 'success' },
  Single:   { label: 'Single',   variant: 'info' },
  LP:       { label: 'LP',       variant: 'purple' },
  Lending:  { label: 'Lending',  variant: 'info' },
  Staking:  { label: 'Staking',  variant: 'success' },
  RWA:      { label: 'RWA',      variant: 'warning' },
  Farm:     { label: 'Farm',     variant: 'warning' },
  Outro:    { label: 'Outro',    variant: 'default' },
}

interface PoolTypeBadgeProps {
  type: PoolType
  size?: 'sm' | 'md'
}

export const PoolTypeBadge = ({ type, size = 'sm' }: PoolTypeBadgeProps) => {
  const cfg = CONFIG[type] ?? CONFIG.Outro
  return (
    <Badge variant={cfg.variant} size={size}>
      {cfg.label}
    </Badge>
  )
}

import { DollarSign, Layers, FileText, GitMerge } from 'lucide-react'
import type { RichPool } from '@/types/defi'
import type { PoolFilters } from '@/types/defi'
import { usePoolRankings } from '@/hooks/usePoolRankings'
import { RankingCard } from './RankingCard'

interface PoolRankingCardsProps {
  pools: RichPool[] | undefined
  onApplyFilter: (partial: Partial<PoolFilters>) => void
}

export const PoolRankingCards = ({ pools, onApplyFilter }: PoolRankingCardsProps) => {
  const { bestStable, bestSingle, bestRwa, bestLp } = usePoolRankings(pools)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <RankingCard
        title="Melhor Stablecoin"
        icon={<DollarSign size={13} />}
        pool={bestStable}
        accentColor="#10b981"
        onSelect={() => onApplyFilter({ poolType: 'Stablecoin', stablecoinOnly: true, search: '' })}
      />
      <RankingCard
        title="Melhor Single"
        icon={<Layers size={13} />}
        pool={bestSingle}
        accentColor="#0ea5e9"
        onSelect={() => onApplyFilter({ poolType: 'Single', singleExposureOnly: true, search: '' })}
      />
      <RankingCard
        title="Melhor RWA"
        icon={<FileText size={13} />}
        pool={bestRwa}
        accentColor="#f59e0b"
        onSelect={() => onApplyFilter({ poolType: 'RWA', search: '' })}
      />
      <RankingCard
        title="Melhor LP"
        icon={<GitMerge size={13} />}
        pool={bestLp}
        accentColor="#8b5cf6"
        onSelect={() => onApplyFilter({ poolType: 'LP', search: '' })}
      />
    </div>
  )
}

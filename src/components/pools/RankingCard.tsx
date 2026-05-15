import type { ReactNode } from 'react'
import type { RichPool } from '@/types/defi'
import { ChainBadge } from '@/components/ui/ChainBadge'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { formatAPY, formatTVL } from '@/utils/format'

interface RankingCardProps {
  title: string
  icon: ReactNode
  pool: RichPool | null
  accentColor: string
  onSelect: () => void
}

export const RankingCard = ({ title, icon, pool, accentColor, onSelect }: RankingCardProps) => {
  if (!pool) {
    return (
      <div className="rounded-xl border border-[#2a3040] bg-[#111318] p-4 space-y-2 opacity-50">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5a6278]">
          {icon}
          {title}
        </div>
        <div className="text-xs text-[#3d4560]">Sem dados disponíveis</div>
      </div>
    )
  }

  return (
    <button
      onClick={onSelect}
      className="w-full text-left rounded-xl border border-[#2a3040] bg-[#111318] p-4 space-y-3 hover:border-[#3d4560] hover:bg-[#141820] transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: accentColor }}>
          {icon}
          {title}
        </div>
        <ChainBadge chain={pool.chain} size="sm" />
      </div>

      <div>
        <div className="font-semibold text-[#e8eaf0] text-sm leading-tight truncate" title={pool.symbol}>
          {pool.symbol?.slice(0, 22) || '—'}
        </div>
        <div className="text-xs text-[#5a6278] mt-0.5">{pool.project}</div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] text-[#5a6278]">TVL</div>
          <div className="text-xs text-[#8b93a8]">{formatTVL(pool.tvlUsd)}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[#5a6278]">APY</div>
          <div className="text-base font-bold" style={{ color: accentColor }}>
            {formatAPY(pool.apy)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-0.5 border-t border-[#1e2433]">
        <RiskBadge label={pool.riskLabel} score={pool.riskScore} showScore />
        <span className="text-[10px] text-[#3d4560] group-hover:text-teal-500 transition-colors">
          Aplicar filtro →
        </span>
      </div>
    </button>
  )
}

import { useState } from 'react'
import { Star, ChevronDown, ChevronUp, AlertTriangle, ExternalLink } from 'lucide-react'
import type { RichPool } from '@/types/defi'
import { ChainBadge } from '@/components/ui/ChainBadge'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { TVLDisplay } from '@/components/ui/TVLDisplay'
import { Button } from '@/components/ui/Button'
import { PoolTypeBadge } from './PoolTypeBadge'
import { RatioBar } from './RatioBar'
import { PoolExpandedDetails } from './PoolExpandedDetails'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/components/ui/cn'
import { formatAPY, formatTVL } from '@/utils/format'

interface PoolTableProps {
  pools: RichPool[]
  tvlTotal: number
  currency?: 'USD' | 'BRL'
  usdBrl?: number
  page: number
  pageSize?: number
  onPageChange: (p: number) => void
}

export const PoolTable = ({
  pools,
  tvlTotal,
  currency = 'USD',
  usdBrl = 1,
  page,
  pageSize = 50,
  onPageChange,
}: PoolTableProps) => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const totalPages = Math.ceil(pools.length / pageSize)
  const pageData = pools.slice((page - 1) * pageSize, page * pageSize)

  const toggleFavorite = (poolId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(
      favorites.includes(poolId)
        ? favorites.filter((f) => f !== poolId)
        : [...favorites, poolId]
    )
  }

  const isHighAPY = (apy: number) => apy > 100
  const isRewardHeavy = (p: RichPool) =>
    p.apyReward != null && p.apyBase != null && p.apy > 0 && p.apyReward / p.apy > 0.8

  const apyColor = (apy: number) => {
    if (apy > 100) return 'text-red-400'
    if (apy > 30) return 'text-amber-400'
    if (apy > 0) return 'text-emerald-400'
    return 'text-[#5a6278]'
  }

  return (
    <div className="space-y-3">
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-[#2a3040]">
        <table className="w-full text-xs" style={{ minWidth: 960 }}>
          <thead>
            <tr className="border-b border-[#2a3040] bg-[#0d1018]">
              <th className="px-3 py-3 w-8" />
              <th className="text-left px-3 py-3 text-[#5a6278] font-medium">Pool</th>
              <th className="text-left px-3 py-3 text-[#5a6278] font-medium">Protocolo</th>
              <th className="text-left px-3 py-3 text-[#5a6278] font-medium">Chain</th>
              <th className="text-right px-3 py-3 text-[#5a6278] font-medium">TVL</th>
              <th className="text-right px-3 py-3 text-[#5a6278] font-medium">Vol 24h</th>
              <th className="text-right px-3 py-3 text-[#5a6278] font-medium">APY</th>
              <th className="text-right px-3 py-3 text-[#5a6278] font-medium">Base</th>
              <th className="text-right px-3 py-3 text-[#5a6278] font-medium">Reward</th>
              <th className="text-left px-3 py-3 text-[#5a6278] font-medium">Tipo</th>
              <th className="text-left px-3 py-3 text-[#5a6278] font-medium">Risco</th>
              <th className="text-center px-3 py-3 text-[#5a6278] font-medium">Stable</th>
              <th className="px-3 py-3 w-12" />
            </tr>
          </thead>
          <tbody>
            {pageData.map((pool) => (
              <>
                <tr
                  key={pool.pool}
                  className={cn(
                    'border-b border-[#1a2030] hover:bg-[#141820] transition-colors cursor-pointer',
                    expandedRow === pool.pool && 'bg-[#141820]',
                    favorites.includes(pool.pool) && 'bg-amber-500/3'
                  )}
                  onClick={() => setExpandedRow(expandedRow === pool.pool ? null : pool.pool)}
                >
                  {/* Favorite */}
                  <td className="px-3 py-2.5">
                    <button
                      onClick={(e) => toggleFavorite(pool.pool, e)}
                      className={cn(
                        'transition-colors',
                        favorites.includes(pool.pool) ? 'text-amber-400' : 'text-[#2e3546] hover:text-[#5a6278]'
                      )}
                    >
                      <Star size={13} fill={favorites.includes(pool.pool) ? 'currentColor' : 'none'} />
                    </button>
                  </td>

                  {/* Pool / Symbol */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5 font-medium text-[#e8eaf0]">
                      <span className="truncate max-w-[130px]" title={pool.symbol}>
                        {pool.symbol?.slice(0, 20) || '—'}
                      </span>
                      {isHighAPY(pool.apy) && (
                        <span title="APY extremo" className="shrink-0">
                          <AlertTriangle size={11} className="text-amber-400" />
                        </span>
                      )}
                      {isRewardHeavy(pool) && (
                        <span className="text-[10px] text-amber-400/60 font-normal shrink-0">RW</span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#3d4560] font-mono mt-0.5">
                      {pool.pool.slice(0, 8)}…
                    </div>
                  </td>

                  {/* Protocol */}
                  <td className="px-3 py-2.5">
                    <span className="text-[#8b93a8]">{pool.project}</span>
                    {pool.isTrustedProtocol && (
                      <span className="ml-1 text-teal-500 text-[10px]" title="Protocolo verificado">✓</span>
                    )}
                  </td>

                  {/* Chain */}
                  <td className="px-3 py-2.5">
                    <ChainBadge chain={pool.chain} size="sm" />
                  </td>

                  {/* TVL */}
                  <td className="px-3 py-2.5 text-right">
                    <TVLDisplay value={pool.tvlUsd} currency={currency} usdBrl={usdBrl} size="sm" />
                    <div className="mt-1 flex justify-end">
                      <RatioBar value={pool.tvlUsd} total={tvlTotal} />
                    </div>
                  </td>

                  {/* Volume 24h */}
                  <td className="px-3 py-2.5 text-right text-[#8b93a8]">
                    {pool.volumeUsd1d != null && pool.volumeUsd1d > 0
                      ? formatTVL(pool.volumeUsd1d)
                      : <span className="text-[#3d4560]">N/A</span>}
                  </td>

                  {/* APY Total */}
                  <td className="px-3 py-2.5 text-right">
                    <div className="space-y-0.5">
                      <span className={`font-bold ${apyColor(pool.apy)}`}>
                        {formatAPY(pool.apy)}
                      </span>
                      {isHighAPY(pool.apy) && (
                        <div>
                          <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/20 rounded px-1 py-0.5">
                            EXTREMO
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* APY Base */}
                  <td className="px-3 py-2.5 text-right text-[#8b93a8]">
                    {pool.apyBase != null ? formatAPY(pool.apyBase) : <span className="text-[#3d4560]">—</span>}
                  </td>

                  {/* APY Reward */}
                  <td className="px-3 py-2.5 text-right">
                    {pool.apyReward != null && pool.apyReward > 0
                      ? <span className="text-amber-400">{formatAPY(pool.apyReward)}</span>
                      : <span className="text-[#3d4560]">—</span>}
                  </td>

                  {/* Type */}
                  <td className="px-3 py-2.5">
                    <PoolTypeBadge type={pool.poolType} />
                  </td>

                  {/* Risk */}
                  <td className="px-3 py-2.5">
                    <RiskBadge label={pool.riskLabel} score={pool.riskScore} showScore />
                  </td>

                  {/* Stable */}
                  <td className="px-3 py-2.5 text-center">
                    {pool.stablecoin
                      ? <span className="text-emerald-400 text-[11px]">✓</span>
                      : <span className="text-[#3d4560] text-[11px]">—</span>}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {pool.url && (
                        <a
                          href={pool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#3d4560] hover:text-teal-400 transition-colors"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                      <button className="text-[#3d4560] hover:text-[#8b93a8] transition-colors">
                        {expandedRow === pool.pool
                          ? <ChevronUp size={13} />
                          : <ChevronDown size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded details */}
                {expandedRow === pool.pool && (
                  <tr key={`${pool.pool}-detail`} className="bg-[#0a0e16]">
                    <td colSpan={13} className="px-6 py-4">
                      <PoolExpandedDetails pool={pool} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-2">
        {pageData.map((pool) => (
          <div
            key={pool.pool}
            className="rounded-xl border border-[#2a3040] bg-[#111318] p-4 space-y-2.5 cursor-pointer"
            onClick={() => setExpandedRow(expandedRow === pool.pool ? null : pool.pool)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#e8eaf0] text-sm flex items-center gap-1.5 truncate">
                  {pool.symbol?.slice(0, 18) || '—'}
                  {isHighAPY(pool.apy) && <AlertTriangle size={11} className="text-amber-400 shrink-0" />}
                </div>
                <div className="text-xs text-[#5a6278] flex items-center gap-1 mt-0.5">
                  {pool.project}
                  {pool.isTrustedProtocol && <span className="text-teal-500 text-[10px]">✓</span>}
                </div>
              </div>
              <button
                onClick={(e) => toggleFavorite(pool.pool, e)}
                className="shrink-0"
              >
                <Star
                  size={14}
                  className={favorites.includes(pool.pool) ? 'text-amber-400' : 'text-[#2e3546]'}
                  fill={favorites.includes(pool.pool) ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <ChainBadge chain={pool.chain} size="sm" />
              <PoolTypeBadge type={pool.poolType} />
              <RiskBadge label={pool.riskLabel} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-[10px] text-[#5a6278]">TVL</div>
                <TVLDisplay value={pool.tvlUsd} currency={currency} usdBrl={usdBrl} size="sm" />
              </div>
              <div>
                <div className="text-[10px] text-[#5a6278]">APY</div>
                <span className={`text-xs font-bold ${apyColor(pool.apy)}`}>{formatAPY(pool.apy)}</span>
              </div>
              <div>
                <div className="text-[10px] text-[#5a6278]">APY Base</div>
                <span className="text-xs text-[#8b93a8]">
                  {pool.apyBase != null ? formatAPY(pool.apyBase) : '—'}
                </span>
              </div>
            </div>

            {expandedRow === pool.pool && (
              <div className="pt-2 border-t border-[#1e2433]">
                <PoolExpandedDetails pool={pool} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
          <span className="text-xs text-[#5a6278]">
            {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, pools.length)} de {pools.length.toLocaleString('pt-BR')} pools
          </span>
          <div className="flex gap-1 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={page === 1}
            >
              «
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              ‹ Ant.
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
              return (
                <Button
                  key={p}
                  variant={p === page ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onPageChange(p)}
                  className="w-8"
                >
                  {p}
                </Button>
              )
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Próx. ›
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages}
            >
              »
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

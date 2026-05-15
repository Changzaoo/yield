import { useState } from 'react'
import { Star, ExternalLink, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { type RichPool } from '@/types/defi'
import { ChainBadge } from '@/components/ui/ChainBadge'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { APYBreakdown } from '@/components/ui/APYBadge'
import { TVLDisplay } from '@/components/ui/TVLDisplay'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/components/ui/cn'
import { formatAPY } from '@/utils/format'

interface PoolTableProps {
  pools: RichPool[]
  currency?: 'USD' | 'BRL'
  usdBrl?: number
  page: number
  pageSize?: number
  onPageChange: (p: number) => void
}

const POOL_TYPE_LABELS: Record<string, string> = {
  lending: 'Lending',
  staking: 'Staking',
  liquidity: 'LP',
  vault: 'Vault',
  farm: 'Farm',
  other: 'Outro',
}

const POOL_TYPE_COLORS: Record<string, string> = {
  lending: 'info',
  staking: 'success',
  liquidity: 'purple',
  vault: 'warning',
  farm: 'warning',
  other: 'default',
}

export const PoolTable = ({ pools, currency = 'USD', usdBrl = 1, page, pageSize = 50, onPageChange }: PoolTableProps) => {
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

  return (
    <div className="space-y-3">
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-[#2a3040]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a3040] bg-[#111318]">
              <th className="text-left px-4 py-3 text-xs text-[#5a6278] font-medium w-8" />
              <th className="text-left px-4 py-3 text-xs text-[#5a6278] font-medium">Pool / Símbolo</th>
              <th className="text-left px-4 py-3 text-xs text-[#5a6278] font-medium">Protocolo</th>
              <th className="text-left px-4 py-3 text-xs text-[#5a6278] font-medium">Chain</th>
              <th className="text-right px-4 py-3 text-xs text-[#5a6278] font-medium">TVL</th>
              <th className="text-right px-4 py-3 text-xs text-[#5a6278] font-medium">APY</th>
              <th className="text-left px-4 py-3 text-xs text-[#5a6278] font-medium">Tipo</th>
              <th className="text-left px-4 py-3 text-xs text-[#5a6278] font-medium">Risco</th>
              <th className="text-left px-4 py-3 text-xs text-[#5a6278] font-medium">Stable</th>
              <th className="px-4 py-3 text-xs text-[#5a6278] font-medium" />
            </tr>
          </thead>
          <tbody>
            {pageData.map((pool) => (
              <>
                <tr
                  key={pool.pool}
                  className={cn(
                    'border-b border-[#1e2433] hover:bg-[#141820] transition-colors cursor-pointer',
                    expandedRow === pool.pool && 'bg-[#141820]'
                  )}
                  onClick={() => setExpandedRow(expandedRow === pool.pool ? null : pool.pool)}
                >
                  {/* Favorite */}
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => toggleFavorite(pool.pool, e)}
                      className={cn(
                        'transition-colors',
                        favorites.includes(pool.pool) ? 'text-amber-400' : 'text-[#2e3546] hover:text-[#5a6278]'
                      )}
                    >
                      <Star size={14} fill={favorites.includes(pool.pool) ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  {/* Symbol */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 font-medium text-[#e8eaf0]">
                          {pool.symbol?.slice(0, 20) || '—'}
                          {isHighAPY(pool.apy) && <AlertTriangle size={11} className="text-amber-400" />}
                          {isRewardHeavy(pool) && (
                            <span className="text-[10px] text-amber-400/70 font-normal">reward</span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#5a6278] font-mono truncate max-w-[120px]">
                          {pool.pool.slice(0, 10)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Project */}
                  <td className="px-4 py-3">
                    <span className="text-[#8b93a8] text-xs">{pool.project}</span>
                    {pool.isTrustedProtocol && (
                      <span className="ml-1 text-[10px] text-teal-500" title="Protocolo verificado">✓</span>
                    )}
                  </td>
                  {/* Chain */}
                  <td className="px-4 py-3">
                    <ChainBadge chain={pool.chain} />
                  </td>
                  {/* TVL */}
                  <td className="px-4 py-3 text-right">
                    <TVLDisplay value={pool.tvlUsd} currency={currency} usdBrl={usdBrl} />
                  </td>
                  {/* APY */}
                  <td className="px-4 py-3 text-right">
                    <APYBreakdown
                      total={pool.apy}
                      apyBase={pool.apyBase}
                      apyReward={pool.apyReward}
                    />
                  </td>
                  {/* Type */}
                  <td className="px-4 py-3">
                    <Badge variant={POOL_TYPE_COLORS[pool.poolType] as 'info'} size="sm">
                      {POOL_TYPE_LABELS[pool.poolType]}
                    </Badge>
                  </td>
                  {/* Risk */}
                  <td className="px-4 py-3">
                    <RiskBadge label={pool.riskLabel} score={pool.riskScore} showScore />
                  </td>
                  {/* Stable */}
                  <td className="px-4 py-3">
                    {pool.stablecoin ? (
                      <span className="text-emerald-400 text-xs">✓ Sim</span>
                    ) : (
                      <span className="text-[#5a6278] text-xs">Não</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <button className="text-[#5a6278] hover:text-teal-400 transition-colors" onClick={(e) => e.stopPropagation()}>
                      {expandedRow === pool.pool ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </td>
                </tr>
                {/* Expanded details */}
                {expandedRow === pool.pool && (
                  <tr key={`${pool.pool}-detail`} className="bg-[#0d1018]">
                    <td colSpan={10} className="px-6 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <div className="text-[#5a6278] mb-1">APY Base</div>
                          <div className="text-[#e8eaf0] font-semibold">{formatAPY(pool.apyBase)}</div>
                        </div>
                        <div>
                          <div className="text-[#5a6278] mb-1">APY Reward</div>
                          <div className="text-[#e8eaf0] font-semibold">{formatAPY(pool.apyReward)}</div>
                        </div>
                        <div>
                          <div className="text-[#5a6278] mb-1">IL Risk</div>
                          <div className={pool.ilRisk === 'yes' ? 'text-amber-400' : 'text-emerald-400'}>
                            {pool.ilRisk === 'yes' ? '⚠ Sim' : pool.ilRisk === 'no' ? '✓ Não' : '—'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[#5a6278] mb-1">Exposure</div>
                          <div className="text-[#e8eaf0]">{pool.exposure ?? '—'}</div>
                        </div>
                        {pool.url && (
                          <div className="col-span-2 md:col-span-4">
                            <a
                              href={pool.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-teal-400 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={12} /> Ver no protocolo
                            </a>
                          </div>
                        )}
                        {isHighAPY(pool.apy) && (
                          <div className="col-span-2 md:col-span-4 flex items-center gap-2 text-amber-400">
                            <AlertTriangle size={13} />
                            APY muito alto pode indicar risco elevado ou tokens de recompensa instáveis.
                          </div>
                        )}
                      </div>
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
            className="rounded-xl border border-[#2a3040] bg-[#111318] p-4 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-medium text-[#e8eaf0] text-sm flex items-center gap-1.5">
                  {pool.symbol?.slice(0, 16) || '—'}
                  {isHighAPY(pool.apy) && <AlertTriangle size={11} className="text-amber-400" />}
                </div>
                <div className="text-xs text-[#5a6278]">{pool.project}</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => toggleFavorite(pool.pool, e)}>
                  <Star size={14} className={favorites.includes(pool.pool) ? 'text-amber-400' : 'text-[#2e3546]'} fill={favorites.includes(pool.pool) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <ChainBadge chain={pool.chain} size="sm" />
              <Badge variant={POOL_TYPE_COLORS[pool.poolType] as 'info'} size="sm">
                {POOL_TYPE_LABELS[pool.poolType]}
              </Badge>
              <RiskBadge label={pool.riskLabel} />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <div className="text-[10px] text-[#5a6278]">TVL</div>
                <TVLDisplay value={pool.tvlUsd} currency={currency} usdBrl={usdBrl} size="sm" />
              </div>
              <div>
                <div className="text-[10px] text-[#5a6278]">APY</div>
                <span className="text-xs font-bold text-emerald-400">{formatAPY(pool.apy)}</span>
              </div>
              <div>
                <div className="text-[10px] text-[#5a6278]">Stable</div>
                <span className="text-xs">{pool.stablecoin ? '✓' : '✗'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#5a6278]">
            {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, pools.length)} de {pools.length} pools
          </span>
          <div className="flex gap-1">
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
          </div>
        </div>
      )}
    </div>
  )
}

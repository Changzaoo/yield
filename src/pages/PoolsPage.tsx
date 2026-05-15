import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, RefreshCw, LayoutGrid } from 'lucide-react'
import { useYieldPools } from '@/hooks/useYieldPools'
import { useFilteredPools } from '@/hooks/useFilteredPools'
import { useCurrency } from '@/components/layout/AppLayout'
import { PoolFiltersPanel } from '@/components/pools/PoolFilters'
import { PoolTable } from '@/components/pools/PoolTable'
import { MetricCard } from '@/components/ui/MetricCard'
import { SkeletonMetricCards, SkeletonTable } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { Button } from '@/components/ui/Button'
import { formatTVL, formatAPY } from '@/utils/format'
import type { PoolFilters } from '@/types/defi'
import { useQuery } from '@tanstack/react-query'
import { fetchUsdBrlRate } from '@/services/defillama'

const DEFAULT_FILTERS: PoolFilters = {
  search: '',
  chain: 'all',
  project: 'all',
  stablecoinOnly: false,
  minTvl: 0,
  minApy: 0,
  maxApy: 0,
  poolType: 'all',
  safeOnly: false,
  sortBy: 'tvlUsd',
  sortDir: 'desc',
}

const exportCSV = (pools: ReturnType<typeof useFilteredPools>['filtered']) => {
  const headers = ['Symbol', 'Project', 'Chain', 'TVL USD', 'APY', 'APY Base', 'APY Reward', 'Stablecoin', 'Type', 'Risk Score', 'Risk Label']
  const rows = pools.map((p) => [
    p.symbol, p.project, p.chain, p.tvlUsd, p.apy, p.apyBase ?? '', p.apyReward ?? '',
    p.stablecoin, p.poolType, p.riskScore, p.riskLabel,
  ])
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `yieldscope-pools-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const PoolsPage = () => {
  const [searchParams] = useSearchParams()
  const currency = useCurrency()
  const [filters, setFilters] = useState<PoolFilters>({
    ...DEFAULT_FILTERS,
    search: searchParams.get('q') ?? '',
  })
  const [page, setPage] = useState(1)

  const { data: pools, isLoading, isError, error, refetch } = useYieldPools()
  const { data: usdBrl = 1 } = useQuery({ queryKey: ['usd-brl'], queryFn: fetchUsdBrlRate, staleTime: 60 * 60 * 1000 })

  const { filtered, total, tvlTotal, apyAvg, apyMax, chains: chainCount, protocols: protocolCount } = useFilteredPools(pools, filters)

  const chainOptions = useMemo(() => {
    if (!pools) return []
    return [...new Set(pools.map((p) => p.chain))].sort()
  }, [pools])

  const protocolOptions = useMemo(() => {
    if (!pools) return []
    return [...new Set(pools.map((p) => p.project))].sort()
  }, [pools])

  const updateFilter = (partial: Partial<PoolFilters>) => {
    setFilters((f) => ({ ...f, ...partial }))
    setPage(1)
  }

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  // Sync search param
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) updateFilter({ search: q })
  }, [searchParams])

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#e8eaf0] flex items-center gap-2">
            <LayoutGrid size={20} className="text-teal-400" />
            Pools DeFi
          </h1>
          <p className="text-sm text-[#5a6278] mt-0.5">
            Descubra as melhores oportunidades de rendimento em DeFi
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            leftIcon={<RefreshCw size={14} />}
          >
            Atualizar
          </Button>
          {filtered.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportCSV(filtered)}
              leftIcon={<Download size={14} />}
            >
              CSV
            </Button>
          )}
        </div>
      </div>

      {/* Metrics */}
      {isLoading ? (
        <SkeletonMetricCards count={6} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard label="Pools encontradas" value={total.toLocaleString('pt-BR')} />
          <MetricCard
            label="TVL total filtrado"
            value={formatTVL(tvlTotal, currency, usdBrl)}
            highlight
          />
          <MetricCard label="APY médio" value={formatAPY(apyAvg)} />
          <MetricCard label="Maior APY" value={formatAPY(apyMax)} />
          <MetricCard label="Chains" value={chainCount} />
          <MetricCard label="Protocolos" value={protocolCount} />
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-[#2a3040] bg-[#111318] p-4">
        <PoolFiltersPanel
          filters={filters}
          onChange={updateFilter}
          chains={chainOptions}
          protocols={protocolOptions}
          onReset={resetFilters}
        />
      </div>

      {/* Disclaimer */}
      <Disclaimer compact />

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={10} />
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : 'Erro ao buscar pools'}
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma pool encontrada"
          description="Tente ajustar os filtros para encontrar mais oportunidades."
          action={{ label: 'Limpar filtros', onClick: resetFilters }}
        />
      ) : (
        <PoolTable
          pools={filtered}
          currency={currency}
          usdBrl={usdBrl}
          page={page}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

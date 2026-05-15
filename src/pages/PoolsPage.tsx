import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, RefreshCw, LayoutGrid } from 'lucide-react'
import { useYieldPools } from '@/hooks/useYieldPools'
import { useFilteredPools } from '@/hooks/useFilteredPools'
import { useCurrency } from '@/components/layout/AppLayout'
import { PoolFiltersPanel } from '@/components/pools/PoolFilters'
import { PoolTable } from '@/components/pools/PoolTable'
import { PoolRankingCards } from '@/components/pools/PoolRankingCards'
import { MetricCard } from '@/components/ui/MetricCard'
import { SkeletonMetricCards, SkeletonTable } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { Button } from '@/components/ui/Button'
import { formatTVL, formatAPY } from '@/utils/format'
import type { PoolFilters, RichPool } from '@/types/defi'
import { useQuery } from '@tanstack/react-query'
import { fetchUsdBrlRate } from '@/services/defillama'

const DEFAULT_CHAINS = ['Ethereum', 'Solana', 'BSC', 'Base', 'Polygon', 'Arbitrum', 'Hyperliquid', 'Avalanche', 'Sui']

const DEFAULT_FILTERS: PoolFilters = {
  search: '',
  chains: DEFAULT_CHAINS,
  project: 'all',
  stablecoinOnly: false,
  minTvl: 0,
  minApy: 0,
  maxApy: 0,
  poolType: 'LP',
  safeOnly: true,
  sortBy: 'tvlUsd',
  sortDir: 'desc',
  pageSize: 50,
  includeExtremeApy: false,
  excludeIlRisk: false,
  singleExposureOnly: false,
}

const exportCSV = (pools: RichPool[]) => {
  const headers = [
    'Symbol', 'Project', 'Chain', 'TVL USD', 'APY', 'APY Base', 'APY Reward',
    'Volume 24h', 'Stablecoin', 'IL Risk', 'Exposure', 'Type', 'Risk Score', 'Risk Label',
  ]
  const rows = pools.map((p) => [
    p.symbol, p.project, p.chain,
    p.tvlUsd, p.apy, p.apyBase ?? '', p.apyReward ?? '',
    p.volumeUsd1d ?? '', p.stablecoin, p.ilRisk ?? '',
    p.exposure ?? '', p.poolType, p.riskScore, p.riskLabel,
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
  const { data: usdBrl = 1 } = useQuery({
    queryKey: ['usd-brl'],
    queryFn: fetchUsdBrlRate,
    staleTime: 60 * 60 * 1000,
  })

  const { filtered, total, tvlTotal, apyAvg, apyMax, chains: chainCount, protocols: protocolCount } =
    useFilteredPools(pools, filters)

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

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) updateFilter({ search: q })
  }, [searchParams])

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#e8eaf0] flex items-center gap-2">
            <LayoutGrid size={20} className="text-teal-400" />
            Liquidity Pool Analytics
          </h1>
          <p className="text-sm text-[#5a6278] mt-0.5">
            Descubra e compare as melhores oportunidades DeFi em tempo real
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

      {/* Ranking cards */}
      {!isLoading && !isError && (
        <PoolRankingCards pools={pools} onApplyFilter={updateFilter} />
      )}

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
          tvlTotal={tvlTotal}
          currency={currency}
          usdBrl={usdBrl}
          page={page}
          pageSize={filters.pageSize}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

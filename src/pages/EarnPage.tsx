import { useState, useMemo } from 'react'
import { TrendingUp, Shield, Trophy, AlertTriangle, ExternalLink } from 'lucide-react'
import { useYieldPools } from '@/hooks/useYieldPools'
import { useCurrency } from '@/components/layout/AppLayout'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { ChainBadge } from '@/components/ui/ChainBadge'
import { APYBadge } from '@/components/ui/APYBadge'
import { TVLDisplay } from '@/components/ui/TVLDisplay'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { formatAPY, formatTVL } from '@/utils/format'
import type { RichPool } from '@/types/defi'

const COMMON_TOKENS = ['USDC', 'USDT', 'ETH', 'BTC', 'SOL', 'DAI', 'WBTC', 'MATIC', 'ARB']

const getPoolExplanation = (pool: RichPool): string => {
  const rewardPct = pool.apyReward && pool.apy > 0 ? (pool.apyReward / pool.apy) * 100 : 0
  if (pool.poolType === 'Lending') return `Empreste ${pool.symbol?.split('-')[0] ?? 'tokens'} e receba juros sobre o valor depositado.`
  if (pool.poolType === 'Staking') return `Faça stake dos tokens e receba recompensas pela validação da rede.`
  if ((pool.poolType === 'LP' || pool.poolType === 'Stable') && rewardPct > 80) return `Forneça liquidez e receba tokens de incentivo (${formatAPY(pool.apyReward)} reward APY). Atenção: reward tokens podem ser voláteis.`
  if (pool.poolType === 'LP' || pool.poolType === 'Stable') return `Forneça liquidez para a pool e receba uma parte das taxas de swap.`
  if (pool.poolType === 'Farm') return `Deposite e o vault otimiza automaticamente os rendimentos para você.`
  return `Rendimento gerado via ${pool.project} na chain ${pool.chain}.`
}

interface EarnOpportunityCardProps {
  pool: RichPool
  currency: 'USD' | 'BRL'
  usdBrl: number
  highlight?: string
}

const EarnOpportunityCard = ({ pool, currency, usdBrl, highlight }: EarnOpportunityCardProps) => {
  const isHighAPY = pool.apy > 100
  const isLowTVL = pool.tvlUsd < 500_000

  return (
    <div className="rounded-xl border border-[#2a3040] bg-[#111318] p-4 hover:border-teal-500/30 transition-all duration-200 space-y-3">
      {highlight && (
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
          <Trophy size={12} />
          {highlight}
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-[#e8eaf0]">{pool.symbol}</div>
          <div className="text-xs text-[#5a6278]">{pool.project}</div>
        </div>
        <APYBadge apy={pool.apy} size="lg" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <ChainBadge chain={pool.chain} size="sm" />
        <RiskBadge label={pool.riskLabel} score={pool.riskScore} />
        {pool.stablecoin && <Badge variant="success" size="sm">Stablecoin</Badge>}
      </div>

      <div className="text-xs text-[#8b93a8] bg-[#1a1f2e] rounded-lg p-2 border border-[#2a3040]">
        {getPoolExplanation(pool)}
      </div>

      {/* Warnings */}
      {isHighAPY && (
        <div className="flex items-center gap-1.5 text-xs text-amber-400">
          <AlertTriangle size={11} />
          APY muito alto pode indicar risco elevado
        </div>
      )}
      {isLowTVL && (
        <div className="flex items-center gap-1.5 text-xs text-orange-400">
          <AlertTriangle size={11} />
          TVL baixo — pool pode ter baixa liquidez
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-[#1e2433]">
        <span className="text-xs text-[#5a6278]">
          TVL: <TVLDisplay value={pool.tvlUsd} currency={currency} usdBrl={usdBrl} />
        </span>
        {pool.url && (
          <a href={pool.url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" rightIcon={<ExternalLink size={12} />}>
              Analisar
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}

export const EarnPage = () => {
  const currency = useCurrency()
  const [tokenSearch, setTokenSearch] = useState('')
  const [assetType, setAssetType] = useState<'all' | 'stablecoin' | 'crypto'>('all')
  const [chain, setChain] = useState('all')
  const [safeOnly, setSafeOnly] = useState(false)

  const { data: pools, isLoading, isError, refetch } = useYieldPools()

  const filtered = useMemo(() => {
    if (!pools) return []
    let res = [...pools]
    if (tokenSearch.trim()) {
      const q = tokenSearch.toLowerCase()
      res = res.filter((p) => p.symbol?.toLowerCase().includes(q) || p.project?.toLowerCase().includes(q))
    }
    if (assetType === 'stablecoin') res = res.filter((p) => p.stablecoin)
    if (assetType === 'crypto') res = res.filter((p) => !p.stablecoin)
    if (chain !== 'all') res = res.filter((p) => p.chain === chain)
    if (safeOnly) res = res.filter((p) => p.riskScore >= 60)
    return res
  }, [pools, tokenSearch, assetType, chain, safeOnly])

  const highlights = useMemo(() => {
    if (!filtered.length) return null
    const safePools = filtered.filter((p) => p.riskScore >= 60)
    const bestSafe = [...safePools].sort((a, b) => b.apy - a.apy)[0]
    const highestAPY = [...filtered].sort((a, b) => b.apy - a.apy)[0]
    const highestTVL = [...filtered].sort((a, b) => b.tvlUsd - a.tvlUsd)[0]
    const stablePools = filtered.filter((p) => p.stablecoin)
    const bestStable = stablePools.sort((a, b) => b.apy - a.apy)[0]
    return { bestSafe, highestAPY, highestTVL, bestStable }
  }, [filtered])

  const chainOptions = useMemo(() => {
    if (!pools) return []
    return [...new Set(pools.map((p) => p.chain))].sort()
  }, [pools])

  const top20 = useMemo(() => {
    return [...filtered].sort((a, b) => b.apy - a.apy).slice(0, 20)
  }, [filtered])

  const usdBrl = 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#e8eaf0] flex items-center gap-2">
          <TrendingUp size={20} className="text-teal-400" />
          Earn — Buscar Rendimento
        </h1>
        <p className="text-sm text-[#5a6278] mt-0.5">
          Encontre as melhores oportunidades de rendimento para o seu token
        </p>
      </div>

      {/* Search bar */}
      <div className="rounded-xl border border-[#2a3040] bg-[#111318] p-5 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[#e8eaf0]">Qual token você quer render?</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {COMMON_TOKENS.map((t) => (
              <button
                key={t}
                onClick={() => setTokenSearch(t)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  tokenSearch === t
                    ? 'bg-teal-500/20 text-teal-400 border-teal-500/40'
                    : 'bg-[#1f2330] text-[#8b93a8] border-[#2a3040] hover:border-teal-500/30'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <Input
            placeholder="Digite o símbolo ou nome do token..."
            value={tokenSearch}
            onChange={(e) => setTokenSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Asset type toggle */}
          <div className="col-span-2 sm:col-span-1 flex rounded-lg border border-[#2a3040] overflow-hidden">
            {(['all', 'stablecoin', 'crypto'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setAssetType(t)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  assetType === t
                    ? 'bg-teal-600 text-white'
                    : 'text-[#5a6278] hover:text-[#8b93a8]'
                }`}
              >
                {t === 'all' ? 'Todos' : t === 'stablecoin' ? 'Stablecoins' : 'Crypto'}
              </button>
            ))}
          </div>

          <Select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            options={[
              { value: 'all', label: 'Todas chains' },
              ...chainOptions.map((c) => ({ value: c, label: c })),
            ]}
          />

          <button
            onClick={() => setSafeOnly(!safeOnly)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
              safeOnly
                ? 'bg-teal-500/20 text-teal-400 border-teal-500/40'
                : 'bg-[#1f2330] text-[#5a6278] border-[#2a3040]'
            }`}
          >
            <Shield size={13} />
            Menor risco
          </button>
        </div>
      </div>

      <Disclaimer compact />

      {/* Alerts */}
      <div className="space-y-2">
        <div className="flex items-start gap-2 text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
          APY muito alto pode indicar risco elevado ou emissão inflacionária de tokens de recompensa.
        </div>
        <div className="flex items-start gap-2 text-xs text-blue-400/80 bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
          Dados DeFi mudam rapidamente. Sempre verifique as informações diretamente no protocolo antes de investir.
        </div>
      </div>

      {isError && <ErrorState onRetry={() => refetch()} />}

      {/* Highlights */}
      {!isLoading && highlights && (
        <div>
          <h2 className="text-sm font-semibold text-[#8b93a8] uppercase tracking-wide mb-3">
            Melhores oportunidades
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.bestSafe && (
              <EarnOpportunityCard pool={highlights.bestSafe} currency={currency} usdBrl={usdBrl} highlight="🛡 Melhor APY Seguro" />
            )}
            {highlights.highestAPY && (
              <EarnOpportunityCard pool={highlights.highestAPY} currency={currency} usdBrl={usdBrl} highlight="🚀 Maior APY" />
            )}
            {highlights.highestTVL && (
              <EarnOpportunityCard pool={highlights.highestTVL} currency={currency} usdBrl={usdBrl} highlight="🏦 Maior TVL" />
            )}
            {highlights.bestStable && (
              <EarnOpportunityCard pool={highlights.bestStable} currency={currency} usdBrl={usdBrl} highlight="💲 Melhor Stablecoin" />
            )}
          </div>
        </div>
      )}

      {/* Full list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#8b93a8] uppercase tracking-wide">
            Oportunidades ({filtered.length} encontradas)
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {top20.map((pool) => (
              <EarnOpportunityCard key={pool.pool} pool={pool} currency={currency} usdBrl={usdBrl} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length > 20 && (
          <p className="text-xs text-[#5a6278] text-center mt-4">
            Mostrando top 20. Acesse <a href="/pools" className="text-teal-400 hover:underline">Pools DeFi</a> para ver todas as {filtered.length} oportunidades.
          </p>
        )}
      </div>

      {/* Highlights summary table */}
      {!isLoading && filtered.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2a3040]">
                <th className="text-left py-2 px-3 text-[#5a6278] font-medium">Pool</th>
                <th className="text-left py-2 px-3 text-[#5a6278] font-medium">Protocolo</th>
                <th className="text-left py-2 px-3 text-[#5a6278] font-medium">Chain</th>
                <th className="text-right py-2 px-3 text-[#5a6278] font-medium">TVL</th>
                <th className="text-right py-2 px-3 text-[#5a6278] font-medium">APY</th>
                <th className="text-left py-2 px-3 text-[#5a6278] font-medium">Risco</th>
              </tr>
            </thead>
            <tbody>
              {top20.slice(0, 10).map((pool) => (
                <tr key={pool.pool} className="border-b border-[#1e2433] hover:bg-[#141820] transition-colors">
                  <td className="py-2 px-3 font-medium text-[#e8eaf0]">{pool.symbol?.slice(0, 16)}</td>
                  <td className="py-2 px-3 text-[#8b93a8]">{pool.project}</td>
                  <td className="py-2 px-3"><ChainBadge chain={pool.chain} size="sm" /></td>
                  <td className="py-2 px-3 text-right">
                    {formatTVL(pool.tvlUsd, currency, usdBrl)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <APYBadge apy={pool.apy} size="sm" />
                  </td>
                  <td className="py-2 px-3"><RiskBadge label={pool.riskLabel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

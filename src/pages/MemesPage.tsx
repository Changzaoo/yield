import { useState, useMemo } from 'react'
import { Flame, TrendingUp, Zap, ExternalLink, RefreshCw, Search, AlertTriangle, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchTopBoosted, fetchLatestProfiles, enrichWithPairs } from '@/services/dexscreener'
import type { MemeToken } from '@/services/dexscreener'
import { ChainBadge } from '@/components/ui/ChainBadge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { MetricCard } from '@/components/ui/MetricCard'
import { SkeletonTable, SkeletonMetricCards } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { formatTVL } from '@/utils/format'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/components/ui/cn'

type Tab = 'trending' | 'new'
type SortKey = 'boost' | 'volume' | 'change24h' | 'liquidity' | 'mcap'

const CHAIN_LABELS: Record<string, string> = {
  solana: 'SOL', ethereum: 'ETH', bsc: 'BSC', base: 'BASE',
  arbitrum: 'ARB', polygon: 'POL', avalanche: 'AVAX', blast: 'BLAST',
}

const priceChangeColor = (pct: number) => {
  if (pct >= 20) return 'text-emerald-300 font-bold'
  if (pct >= 5) return 'text-emerald-400'
  if (pct >= 0) return 'text-emerald-500'
  if (pct >= -5) return 'text-red-400'
  return 'text-red-500 font-bold'
}

const formatPrice = (usd?: string) => {
  if (!usd) return '—'
  const n = parseFloat(usd)
  if (n === 0) return '$0'
  if (n < 0.000001) return `$${n.toExponential(2)}`
  if (n < 0.01) return `$${n.toFixed(6)}`
  if (n < 1) return `$${n.toFixed(4)}`
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

const formatChange = (pct?: number) => {
  if (pct == null) return '—'
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`
}

const TOKEN_ICON_SIZES = {
  sm: { box: 'w-7 h-7', flame: 12 },
  md: { box: 'w-9 h-9', flame: 16 },
} as const

const TokenIcon = ({ src, variant = 'sm' }: { src?: string; variant?: 'sm' | 'md' }) => {
  const [failed, setFailed] = useState(false)
  const { box, flame } = TOKEN_ICON_SIZES[variant]
  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${box} rounded-full bg-[#1e2433] shrink-0 object-cover`}
      />
    )
  }
  return (
    <div className={`${box} rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 shrink-0 flex items-center justify-center`}>
      <Flame size={flame} className="text-amber-400" />
    </div>
  )
}

interface MemeRowProps {
  token: MemeToken
  rank: number
  isFav: boolean
  onFav: () => void
}

const MemeRow = ({ token, rank, isFav, onFav }: MemeRowProps) => {
  const p = token.pair
  const change24h = p?.priceChange?.h24
  const volume = p?.volume?.h24 ?? 0
  const liquidity = p?.liquidity?.usd ?? 0
  const mcap = p?.marketCap ?? p?.fdv

  return (
    <tr className="border-b border-[#1a2030] hover:bg-[#141820] transition-colors group">
      {/* Rank + fav */}
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onFav}
            className={cn('transition-colors', isFav ? 'text-amber-400' : 'text-[#2e3546] hover:text-amber-400')}
          >
            <Star size={12} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <span className="text-[11px] text-[#3d4560] w-4 text-right">{rank}</span>
        </div>
      </td>

      {/* Icon + name */}
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <TokenIcon src={token.icon} variant="sm" />
          <div className="min-w-0">
            <div className="font-semibold text-[#e8eaf0] text-xs truncate max-w-[120px]">
              {p?.baseToken.symbol ?? token.tokenAddress.slice(0, 6)}
            </div>
            <div className="text-[10px] text-[#5a6278] truncate max-w-[120px]">
              {p?.baseToken.name ?? '—'}
            </div>
          </div>
        </div>
      </td>

      {/* Chain */}
      <td className="px-3 py-2.5">
        <ChainBadge chain={token.chainId} size="sm" />
      </td>

      {/* Price */}
      <td className="px-3 py-2.5 text-right font-mono text-xs text-[#e8eaf0]">
        {formatPrice(p?.priceUsd)}
      </td>

      {/* 24h change */}
      <td className="px-3 py-2.5 text-right text-xs">
        <span className={change24h != null ? priceChangeColor(change24h) : 'text-[#5a6278]'}>
          {formatChange(change24h)}
        </span>
      </td>

      {/* Volume 24h */}
      <td className="px-3 py-2.5 text-right text-xs text-[#8b93a8]">
        {volume > 0 ? formatTVL(volume) : <span className="text-[#3d4560]">—</span>}
      </td>

      {/* Liquidity */}
      <td className="px-3 py-2.5 text-right text-xs text-[#8b93a8]">
        {liquidity > 0 ? formatTVL(liquidity) : <span className="text-[#3d4560]">—</span>}
      </td>

      {/* Market cap */}
      <td className="px-3 py-2.5 text-right text-xs text-[#8b93a8]">
        {mcap && mcap > 0 ? formatTVL(mcap) : <span className="text-[#3d4560]">—</span>}
      </td>

      {/* Boost */}
      <td className="px-3 py-2.5 text-right">
        {token.amount > 0 && (
          <span className="inline-flex items-center gap-0.5 text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded px-1.5 py-0.5">
            <Zap size={9} />
            {token.amount >= 1000 ? `${(token.amount / 1000).toFixed(0)}K` : token.amount}
          </span>
        )}
      </td>

      {/* Links */}
      <td className="px-3 py-2.5">
        <a
          href={token.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#3d4560] hover:text-teal-400 transition-colors"
          title="Ver no DexScreener"
        >
          <ExternalLink size={12} />
        </a>
      </td>
    </tr>
  )
}

export const MemesPage = () => {
  const [tab, setTab] = useState<Tab>('trending')
  const [search, setSearch] = useState('')
  const [chainFilter, setChainFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('boost')
  const [favorites, setFavorites] = useLocalStorage<string[]>('meme-favs', [])

  const { data: trending, isLoading: loadingTrend, isError: errTrend, refetch: refetchTrend } = useQuery({
    queryKey: ['dex-top-boosted'],
    queryFn: async () => {
      const tokens = await fetchTopBoosted()
      return enrichWithPairs(tokens.slice(0, 50))
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })

  const { data: newest, isLoading: loadingNew, isError: errNew, refetch: refetchNew } = useQuery({
    queryKey: ['dex-latest-profiles'],
    queryFn: async () => {
      const tokens = await fetchLatestProfiles()
      return enrichWithPairs(tokens.slice(0, 40))
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
    enabled: tab === 'new',
  })

  const isLoading = tab === 'trending' ? loadingTrend : loadingNew
  const isError = tab === 'trending' ? errTrend : errNew
  const refetch = tab === 'trending' ? refetchTrend : refetchNew
  const rawData = tab === 'trending' ? (trending ?? []) : (newest ?? [])

  const chains = useMemo(() => {
    const set = new Set(rawData.map((t) => t.chainId))
    return ['all', ...Array.from(set).sort()]
  }, [rawData])

  const sortedFiltered = useMemo(() => {
    let data = [...rawData]

    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (t) =>
          t.pair?.baseToken.symbol?.toLowerCase().includes(q) ||
          t.pair?.baseToken.name?.toLowerCase().includes(q) ||
          t.tokenAddress.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      )
    }

    if (chainFilter !== 'all') {
      data = data.filter((t) => t.chainId === chainFilter)
    }

    data.sort((a, b) => {
      switch (sortKey) {
        case 'boost': return (b.amount ?? 0) - (a.amount ?? 0)
        case 'volume': return (b.pair?.volume.h24 ?? 0) - (a.pair?.volume.h24 ?? 0)
        case 'change24h': return (b.pair?.priceChange.h24 ?? -999) - (a.pair?.priceChange.h24 ?? -999)
        case 'liquidity': return (b.pair?.liquidity?.usd ?? 0) - (a.pair?.liquidity?.usd ?? 0)
        case 'mcap': return (b.pair?.marketCap ?? b.pair?.fdv ?? 0) - (a.pair?.marketCap ?? a.pair?.fdv ?? 0)
        default: return 0
      }
    })

    return data
  }, [rawData, search, chainFilter, sortKey])

  const metrics = useMemo(() => {
    const withPairs = sortedFiltered.filter((t) => t.pair)
    const gainers = withPairs.filter((t) => (t.pair?.priceChange.h24 ?? 0) > 0).length
    const totalVol = withPairs.reduce((s, t) => s + (t.pair?.volume.h24 ?? 0), 0)
    const topGainer = withPairs.sort((a, b) => (b.pair?.priceChange.h24 ?? -999) - (a.pair?.priceChange.h24 ?? -999))[0]
    return { count: sortedFiltered.length, gainers, totalVol, topGainer }
  }, [sortedFiltered])

  const toggleFav = (addr: string) => {
    setFavorites(
      favorites.includes(addr) ? favorites.filter((f) => f !== addr) : [...favorites, addr]
    )
  }

  const SortBtn = ({ sk, label }: { sk: SortKey; label: string }) => (
    <button
      onClick={() => setSortKey(sk)}
      className={cn(
        'px-2.5 py-1 rounded text-xs font-medium border transition-colors',
        sortKey === sk
          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
          : 'text-[#5a6278] border-[#2a3040] hover:border-[#3d4560]'
      )}
    >
      {label}
    </button>
  )

  return (
    <div className="space-y-5 max-w-[1300px]">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#e8eaf0] flex items-center gap-2">
            <Flame size={22} className="text-amber-400" />
            Meme Radar
            <span className="text-xs font-normal text-[#5a6278] mt-0.5">via DexScreener</span>
          </h1>
          <p className="text-sm text-[#5a6278] mt-0.5">
            Memecoins em alta — dados em tempo real de DEXs
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={13} />}>
          Atualizar
        </Button>
      </div>

      {/* Risk disclaimer */}
      <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400">
        <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
        <span>
          Memecoins são ativos de alto risco com alta volatilidade e baixa liquidez. Dados são informativos — não constituem recomendação de investimento. Faça sempre sua própria pesquisa (DYOR).
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#1e2433]">
        <button
          onClick={() => setTab('trending')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
            tab === 'trending'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-[#5a6278] hover:text-[#8b93a8]'
          )}
        >
          <TrendingUp size={14} />
          Tendências
        </button>
        <button
          onClick={() => setTab('new')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
            tab === 'new'
              ? 'border-teal-400 text-teal-400'
              : 'border-transparent text-[#5a6278] hover:text-[#8b93a8]'
          )}
        >
          <Zap size={14} />
          Novos
        </button>
      </div>

      {/* Metrics */}
      {isLoading ? (
        <SkeletonMetricCards count={4} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="Tokens listados" value={metrics.count} />
          <MetricCard label="Em alta (24h)" value={metrics.gainers} highlight />
          <MetricCard label="Volume total 24h" value={formatTVL(metrics.totalVol)} />
          <MetricCard
            label="Maior alta"
            value={
              metrics.topGainer
                ? `+${(metrics.topGainer.pair?.priceChange.h24 ?? 0).toFixed(1)}%`
                : '—'
            }
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            leftIcon={<Search size={13} />}
            placeholder="Buscar token, símbolo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Chain filter */}
        <div className="flex flex-wrap gap-1">
          {chains.slice(0, 8).map((c) => (
            <button
              key={c}
              onClick={() => setChainFilter(c)}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium border transition-colors',
                chainFilter === c
                  ? 'bg-teal-500/15 text-teal-400 border-teal-500/30'
                  : 'text-[#5a6278] border-[#2a3040] hover:border-[#3d4560]'
              )}
            >
              {c === 'all' ? 'Todas' : (CHAIN_LABELS[c] ?? c.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-1 flex-wrap">
          <SortBtn sk="boost" label="Boost" />
          <SortBtn sk="volume" label="Volume" />
          <SortBtn sk="change24h" label="24h%" />
          <SortBtn sk="liquidity" label="Liquid." />
          <SortBtn sk="mcap" label="MCap" />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={12} />
      ) : isError ? (
        <ErrorState
          message="Erro ao buscar dados do DexScreener"
          onRetry={() => refetch()}
        />
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-[#2a3040]">
            <table className="w-full text-xs" style={{ minWidth: 860 }}>
              <thead>
                <tr className="border-b border-[#2a3040] bg-[#0d1018]">
                  <th className="px-3 py-3 w-12" />
                  <th className="text-left px-3 py-3 text-[#5a6278] font-medium">Token</th>
                  <th className="text-left px-3 py-3 text-[#5a6278] font-medium">Chain</th>
                  <th className="text-right px-3 py-3 text-[#5a6278] font-medium">Preço</th>
                  <th className="text-right px-3 py-3 text-[#5a6278] font-medium">24h %</th>
                  <th className="text-right px-3 py-3 text-[#5a6278] font-medium">Vol 24h</th>
                  <th className="text-right px-3 py-3 text-[#5a6278] font-medium">Liquidez</th>
                  <th className="text-right px-3 py-3 text-[#5a6278] font-medium">MCap</th>
                  <th className="text-right px-3 py-3 text-[#5a6278] font-medium">Boost</th>
                  <th className="px-3 py-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {sortedFiltered.map((token, i) => (
                  <MemeRow
                    key={`${token.chainId}-${token.tokenAddress}`}
                    token={token}
                    rank={i + 1}
                    isFav={favorites.includes(token.tokenAddress)}
                    onFav={() => toggleFav(token.tokenAddress)}
                  />
                ))}
                {sortedFiltered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-10 text-[#5a6278]">
                      Nenhum token encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-2">
            {sortedFiltered.slice(0, 30).map((token) => {
              const p = token.pair
              const change24h = p?.priceChange?.h24
              return (
                <div
                  key={`${token.chainId}-${token.tokenAddress}`}
                  className="rounded-xl border border-[#2a3040] bg-[#111318] p-4 space-y-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <TokenIcon src={token.icon} variant="md" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#e8eaf0] text-sm">{p?.baseToken.symbol ?? '—'}</div>
                      <div className="text-[11px] text-[#5a6278] truncate">{p?.baseToken.name ?? token.tokenAddress.slice(0, 12)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChainBadge chain={token.chainId} size="sm" />
                      <a href={token.url} target="_blank" rel="noopener noreferrer" className="text-[#3d4560] hover:text-teal-400">
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-[10px] text-[#5a6278]">Preço</div>
                      <div className="text-xs font-mono text-[#e8eaf0]">{formatPrice(p?.priceUsd)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#5a6278]">24h</div>
                      <div className={`text-xs ${change24h != null ? priceChangeColor(change24h) : 'text-[#5a6278]'}`}>
                        {formatChange(change24h)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#5a6278]">Volume</div>
                      <div className="text-xs text-[#8b93a8]">{p?.volume.h24 ? formatTVL(p.volume.h24) : '—'}</div>
                    </div>
                  </div>
                  {token.amount > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-400">
                      <Zap size={9} />
                      Boost: {token.amount}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-xs text-[#3d4560] text-right">
            Fonte: DexScreener · Atualizado a cada 2min
          </div>
        </>
      )}
    </div>
  )
}

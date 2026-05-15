import { useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown, ArrowUpDown } from 'lucide-react'
import type { PoolFilters, SortField } from '@/types/defi'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AdvancedPoolFilters } from './AdvancedPoolFilters'

interface PoolFiltersProps {
  filters: PoolFilters
  onChange: (f: Partial<PoolFilters>) => void
  chains: string[]
  protocols: string[]
  onReset: () => void
}

const MAIN_CHAINS = [
  'Ethereum', 'Solana', 'BSC', 'Base', 'Polygon',
  'Arbitrum', 'Hyperliquid', 'Avalanche', 'Sui',
]

const POOL_TYPES = [
  { value: 'all',         label: 'Todos os tipos' },
  { value: 'Stablecoin',  label: 'Stablecoin' },
  { value: 'Single',      label: 'Single Asset' },
  { value: 'LP',          label: 'LP Pair' },
  { value: 'Lending',     label: 'Lending' },
  { value: 'Staking',     label: 'Staking' },
  { value: 'RWA',         label: 'RWA' },
  { value: 'Farm',        label: 'Farm' },
  { value: 'Outro',       label: 'Outros' },
  { value: 'HighAPY',     label: 'Alto APY (>100%)' },
  { value: 'LowRisk',     label: 'Baixo Risco' },
]

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'tvlUsd',       label: 'TVL' },
  { value: 'apy',          label: 'APY Total' },
  { value: 'apyBase',      label: 'APY Base' },
  { value: 'apyReward',    label: 'APY Reward' },
  { value: 'riskScore',    label: 'Menor risco' },
  { value: 'volumeUsd1d',  label: 'Volume 24h' },
  { value: 'chain',        label: 'Chain' },
  { value: 'project',      label: 'Protocolo' },
]

const toggleChain = (current: string[], chain: string): string[] =>
  current.includes(chain) ? current.filter((c) => c !== chain) : [...current, chain]

export const PoolFiltersPanel = ({ filters, onChange, chains, protocols, onReset }: PoolFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Chains not in MAIN_CHAINS list available in data
  const extraChains = chains.filter((c) => !MAIN_CHAINS.includes(c))

  const selectedExtra = filters.chains.find((c) => !MAIN_CHAINS.includes(c)) ?? 'all'

  const hasFilters =
    filters.search ||
    filters.chains.length > 0 ||
    (filters.project && filters.project !== 'all') ||
    filters.stablecoinOnly ||
    filters.minTvl > 0 ||
    filters.minApy > 0 ||
    filters.maxApy > 0 ||
    (filters.poolType && filters.poolType !== 'all') ||
    filters.safeOnly ||
    filters.excludeIlRisk ||
    filters.singleExposureOnly

  const allMainSelected = MAIN_CHAINS.every((c) => filters.chains.includes(c))

  return (
    <div className="space-y-3">
      {/* Search row */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            leftIcon={<Search size={15} />}
            placeholder="Buscar por token, protocolo, chain ou pool ID..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced((v) => !v)}
          leftIcon={<SlidersHorizontal size={13} />}
          className={showAdvanced ? 'text-teal-400' : ''}
        >
          Avançado
          <ChevronDown size={11} className={`ml-0.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} leftIcon={<X size={13} />}>
            Limpar
          </Button>
        )}
      </div>

      {/* Chain toggle row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] text-[#5a6278] font-medium mr-1 shrink-0">Redes:</span>

        {/* All / none */}
        <button
          onClick={() => onChange({ chains: [] })}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
            filters.chains.length === 0
              ? 'bg-teal-500/15 text-teal-400 border-teal-500/40'
              : 'text-[#5a6278] border-[#2a3040] hover:border-[#3d4560] hover:text-[#8b93a8]'
          }`}
        >
          Todas
        </button>

        {MAIN_CHAINS.map((chain) => {
          const active = filters.chains.includes(chain)
          return (
            <button
              key={chain}
              onClick={() => onChange({ chains: toggleChain(filters.chains, chain) })}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                active
                  ? 'bg-teal-500/15 text-teal-400 border-teal-500/40'
                  : 'text-[#5a6278] border-[#2a3040] hover:border-[#3d4560] hover:text-[#8b93a8]'
              }`}
            >
              {chain}
            </button>
          )
        })}

        {/* All-main shortcut */}
        <button
          onClick={() => onChange({ chains: MAIN_CHAINS })}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ml-1 ${
            allMainSelected && filters.chains.length === MAIN_CHAINS.length
              ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/40'
              : 'text-[#5a6278] border-[#2a3040] hover:border-[#3d4560] hover:text-[#8b93a8]'
          }`}
        >
          Principais
        </button>

        {/* Extra chain dropdown if data has more */}
        {extraChains.length > 0 && (
          <select
            value={selectedExtra}
            onChange={(e) => {
              const val = e.target.value
              if (val === 'all') {
                onChange({ chains: filters.chains.filter((c) => MAIN_CHAINS.includes(c)) })
              } else {
                onChange({ chains: [...filters.chains.filter((c) => MAIN_CHAINS.includes(c)), val] })
              }
            }}
            className="px-2 py-1 rounded-full text-[11px] border border-[#2a3040] bg-[#0d0f14] text-[#5a6278] hover:border-[#3d4560] transition-colors outline-none cursor-pointer"
          >
            <option value="all">+ Outras redes</option>
            {extraChains.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>

      {/* Filters grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <Select
          value={filters.project}
          onChange={(e) => onChange({ project: e.target.value })}
          options={[
            { value: 'all', label: 'Todos protocolos' },
            ...protocols.slice(0, 60).map((p) => ({ value: p, label: p })),
          ]}
        />

        <Select
          value={filters.poolType}
          onChange={(e) => onChange({ poolType: e.target.value })}
          options={POOL_TYPES}
        />

        <Select
          value={String(filters.minTvl)}
          onChange={(e) => onChange({ minTvl: Number(e.target.value) })}
          options={[
            { value: '0',         label: 'Qualquer TVL' },
            { value: '100000',    label: 'TVL > $100K' },
            { value: '1000000',   label: 'TVL > $1M' },
            { value: '10000000',  label: 'TVL > $10M' },
            { value: '100000000', label: 'TVL > $100M' },
          ]}
        />

        <Select
          value={`${filters.minApy}-${filters.maxApy}`}
          onChange={(e) => {
            const [min, max] = e.target.value.split('-').map(Number)
            onChange({ minApy: min, maxApy: max })
          }}
          options={[
            { value: '0-0',    label: 'Qualquer APY' },
            { value: '0-10',   label: 'APY até 10%' },
            { value: '1-20',   label: 'APY 1% – 20%' },
            { value: '5-50',   label: 'APY 5% – 50%' },
            { value: '20-100', label: 'APY 20% – 100%' },
            { value: '100-0',  label: 'APY > 100%' },
          ]}
        />

        <Select
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value as SortField })}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Toggle row */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onChange({ stablecoinOnly: !filters.stablecoinOnly })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            filters.stablecoinOnly
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
              : 'bg-transparent text-[#5a6278] border-[#2a3040] hover:border-[#3d4560]'
          }`}
        >
          💲 Stablecoins
        </button>

        <button
          onClick={() => onChange({ safeOnly: !filters.safeOnly })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            filters.safeOnly
              ? 'bg-teal-500/15 text-teal-400 border-teal-500/40'
              : 'bg-transparent text-[#5a6278] border-[#2a3040] hover:border-[#3d4560]'
          }`}
        >
          🛡 Menor risco estimado
        </button>

        <button
          onClick={() => onChange({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-[#2a3040] text-[#5a6278] hover:border-[#3d4560] hover:text-[#8b93a8] transition-colors"
        >
          <ArrowUpDown size={11} />
          {filters.sortDir === 'desc' ? 'Decrescente' : 'Crescente'}
        </button>

        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs text-[#5a6278]">Linhas:</span>
          {([20, 50, 100] as const).map((n) => (
            <button
              key={n}
              onClick={() => onChange({ pageSize: n })}
              className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                filters.pageSize === n
                  ? 'bg-teal-500/15 text-teal-400 border-teal-500/40'
                  : 'text-[#5a6278] border-[#2a3040] hover:border-[#3d4560]'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <AdvancedPoolFilters filters={filters} onChange={onChange} />
      )}
    </div>
  )
}

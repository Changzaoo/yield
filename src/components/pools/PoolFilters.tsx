import { Search, SlidersHorizontal, X } from 'lucide-react'
import { type PoolFilters, type SortField } from '@/types/defi'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface PoolFiltersProps {
  filters: PoolFilters
  onChange: (f: Partial<PoolFilters>) => void
  chains: string[]
  protocols: string[]
  onReset: () => void
}

const POOL_TYPES = [
  { value: 'all',       label: 'Todos os tipos' },
  { value: 'lending',   label: 'Lending' },
  { value: 'staking',   label: 'Staking' },
  { value: 'liquidity', label: 'Liquidez' },
  { value: 'vault',     label: 'Vault' },
  { value: 'farm',      label: 'Farm' },
  { value: 'other',     label: 'Outros' },
]

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'apy',       label: 'APY' },
  { value: 'tvlUsd',    label: 'TVL' },
  { value: 'riskScore', label: 'Segurança' },
  { value: 'chain',     label: 'Chain' },
  { value: 'project',   label: 'Protocolo' },
]

export const PoolFiltersPanel = ({ filters, onChange, chains, protocols, onReset }: PoolFiltersProps) => {
  const hasFilters =
    filters.search ||
    (filters.chain && filters.chain !== 'all') ||
    (filters.project && filters.project !== 'all') ||
    filters.stablecoinOnly ||
    filters.minTvl > 0 ||
    filters.minApy > 0 ||
    filters.maxApy > 0 ||
    (filters.poolType && filters.poolType !== 'all') ||
    filters.safeOnly

  return (
    <div className="space-y-3">
      {/* Search + Reset */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            leftIcon={<Search size={15} />}
            placeholder="Buscar por token, protocolo, chain..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} leftIcon={<X size={14} />}>
            Limpar
          </Button>
        )}
      </div>

      {/* Filters grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* Chain */}
        <Select
          value={filters.chain}
          onChange={(e) => onChange({ chain: e.target.value })}
          options={[
            { value: 'all', label: 'Todas chains' },
            ...chains.map((c) => ({ value: c, label: c })),
          ]}
        />

        {/* Protocol */}
        <Select
          value={filters.project}
          onChange={(e) => onChange({ project: e.target.value })}
          options={[
            { value: 'all', label: 'Todos protocolos' },
            ...protocols.slice(0, 50).map((p) => ({ value: p, label: p })),
          ]}
        />

        {/* Pool type */}
        <Select
          value={filters.poolType}
          onChange={(e) => onChange({ poolType: e.target.value })}
          options={POOL_TYPES}
        />

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value as SortField })}
          options={SORT_OPTIONS}
        />

        {/* Min TVL */}
        <Select
          value={String(filters.minTvl)}
          onChange={(e) => onChange({ minTvl: Number(e.target.value) })}
          options={[
            { value: '0',           label: 'Qualquer TVL' },
            { value: '100000',      label: 'TVL > $100K' },
            { value: '1000000',     label: 'TVL > $1M' },
            { value: '10000000',    label: 'TVL > $10M' },
            { value: '100000000',   label: 'TVL > $100M' },
          ]}
        />

        {/* APY Range */}
        <Select
          value={`${filters.minApy}-${filters.maxApy}`}
          onChange={(e) => {
            const [min, max] = e.target.value.split('-').map(Number)
            onChange({ minApy: min, maxApy: max })
          }}
          options={[
            { value: '0-0',    label: 'Qualquer APY' },
            { value: '1-20',   label: 'APY 1% – 20%' },
            { value: '5-50',   label: 'APY 5% – 50%' },
            { value: '20-100', label: 'APY 20% – 100%' },
            { value: '0-10',   label: 'APY até 10%' },
          ]}
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange({ stablecoinOnly: !filters.stablecoinOnly })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            filters.stablecoinOnly
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-transparent text-[#5a6278] border-[#2a3040] hover:border-[#3d4560]'
          }`}
        >
          💲 Stablecoins only
        </button>

        <button
          onClick={() => onChange({ safeOnly: !filters.safeOnly })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            filters.safeOnly
              ? 'bg-teal-500/20 text-teal-400 border-teal-500/40'
              : 'bg-transparent text-[#5a6278] border-[#2a3040] hover:border-[#3d4560]'
          }`}
        >
          🛡 Menor risco estimado
        </button>

        <button
          onClick={() => onChange({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })}
          className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#2a3040] text-[#5a6278] hover:border-[#3d4560] hover:text-[#8b93a8] transition-colors"
        >
          {filters.sortDir === 'desc' ? '↓ Decrescente' : '↑ Crescente'}
        </button>

        <div className="flex items-center ml-auto">
          <SlidersHorizontal size={13} className="text-[#5a6278] mr-1" />
        </div>
      </div>
    </div>
  )
}

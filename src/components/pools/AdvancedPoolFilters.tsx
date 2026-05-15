import type { PoolFilters } from '@/types/defi'

interface AdvancedPoolFiltersProps {
  filters: PoolFilters
  onChange: (f: Partial<PoolFilters>) => void
}

interface ToggleProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  color?: 'teal' | 'amber' | 'sky'
}

const Toggle = ({ active, onClick, children, color = 'teal' }: ToggleProps) => {
  const colors = {
    teal: active ? 'bg-teal-500/15 text-teal-400 border-teal-500/40' : 'bg-transparent text-[#5a6278] border-[#2a3040] hover:border-[#3d4560]',
    amber: active ? 'bg-amber-500/15 text-amber-400 border-amber-500/40' : 'bg-transparent text-[#5a6278] border-[#2a3040] hover:border-[#3d4560]',
    sky: active ? 'bg-sky-500/15 text-sky-400 border-sky-500/40' : 'bg-transparent text-[#5a6278] border-[#2a3040] hover:border-[#3d4560]',
  }
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${colors[color]}`}
    >
      {children}
    </button>
  )
}

export const AdvancedPoolFilters = ({ filters, onChange }: AdvancedPoolFiltersProps) => (
  <div className="rounded-lg border border-[#2a3040] bg-[#0d1018] p-3 space-y-2">
    <div className="text-[10px] text-[#5a6278] uppercase tracking-wider">Filtros avançados</div>
    <div className="flex flex-wrap gap-2">
      <Toggle
        active={!filters.includeExtremeApy}
        onClick={() => onChange({ includeExtremeApy: !filters.includeExtremeApy })}
        color="amber"
      >
        {filters.includeExtremeApy ? '⚠ Incluindo APY extremo' : '🛡 Ocultar APY > 1000%'}
      </Toggle>

      <Toggle
        active={filters.excludeIlRisk}
        onClick={() => onChange({ excludeIlRisk: !filters.excludeIlRisk })}
        color="sky"
      >
        Sem Impermanent Loss
      </Toggle>

      <Toggle
        active={filters.singleExposureOnly}
        onClick={() => onChange({ singleExposureOnly: !filters.singleExposureOnly })}
        color="teal"
      >
        Single exposure only
      </Toggle>
    </div>
  </div>
)

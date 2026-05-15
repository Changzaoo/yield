import { AlertTriangle } from 'lucide-react'

interface DisclaimerProps {
  compact?: boolean
}

export const Disclaimer = ({ compact }: DisclaimerProps) => {
  if (compact) {
    return (
      <p className="text-xs text-[#5a6278] flex items-center gap-1.5">
        <AlertTriangle size={12} className="text-amber-500 flex-shrink-0" />
        Dados on-chain e APIs públicas podem conter atraso. Isto não é recomendação financeira.
      </p>
    )
  }

  return (
    <div className="flex gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/80">
      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold">Aviso de risco:</span> Dados on-chain e APIs públicas podem conter
        atraso ou inconsistência. APYs são estimativas e podem mudar a qualquer momento.{' '}
        <strong>Isto não é recomendação financeira.</strong> Sempre faça sua própria pesquisa (DYOR).
      </div>
    </div>
  )
}

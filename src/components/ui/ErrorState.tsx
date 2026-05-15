import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export const ErrorState = ({
  title = 'Erro ao carregar dados',
  message = 'Não foi possível conectar à API. Verifique sua conexão e tente novamente.',
  onRetry,
}: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
      <AlertTriangle size={24} />
    </div>
    <h3 className="text-[#e8eaf0] font-semibold text-base mb-1">{title}</h3>
    <p className="text-[#5a6278] text-sm max-w-sm">{message}</p>
    {onRetry && (
      <Button
        variant="secondary"
        size="sm"
        className="mt-4"
        onClick={onRetry}
        leftIcon={<RefreshCw size={14} />}
      >
        Tentar novamente
      </Button>
    )}
  </div>
)

import { Lock, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { type ReactNode } from 'react'
import { Button } from './Button'

interface ProGateProps {
  children: ReactNode
  locked?: boolean
  title?: string
  description?: string
}

export const ProGate = ({
  children,
  locked = true,
  title = 'Funcionalidade PRO',
  description = 'Acesso exclusivo para assinantes do plano PRO',
}: ProGateProps) => {
  if (!locked) return <>{children}</>

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="select-none pointer-events-none" aria-hidden>
        <div className="blur-sm opacity-40">{children}</div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0c10]/70 backdrop-blur-[2px] p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">
          <Lock size={20} />
        </div>
        <h3 className="text-[#e8eaf0] font-bold text-base mb-1">{title}</h3>
        <p className="text-[#5a6278] text-sm max-w-xs mb-4">{description}</p>
        <Link to="/pro">
          <Button variant="primary" size="sm" leftIcon={<Zap size={14} />}>
            Desbloquear PRO
          </Button>
        </Link>
      </div>
    </div>
  )
}

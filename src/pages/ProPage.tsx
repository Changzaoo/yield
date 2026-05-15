import { useState } from 'react'
import {
  Zap, Shield, Eye, Bitcoin, Bell, Star, Download, BarChart2,
  CheckCircle, Wallet, ChevronRight,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useWallet } from '@/hooks/useWallet'
import { env } from '@/config/env'
import { formatAddress } from '@/utils/format'

const BENEFITS = [
  {
    icon: Shield,
    title: 'Filtros avançados',
    desc: 'Score de risco detalhado, filtros por múltiplos critérios e combinações personalizadas.',
  },
  {
    icon: Eye,
    title: 'Whale Tracker avançado',
    desc: 'Alertas de grandes movimentações, histórico ilimitado e dados de carteiras reais via API.',
  },
  {
    icon: Bitcoin,
    title: 'Bitcoin Lab completo',
    desc: 'Simulador de estratégias BTC, análise comparativa e rastreamento de WBTC/cbBTC/tBTC.',
  },
  {
    icon: Bell,
    title: 'Alertas de APY',
    desc: 'Notificações quando um pool atinge seu APY alvo ou quando há mudanças significativas.',
  },
  {
    icon: Star,
    title: 'Watchlist',
    desc: 'Acompanhe pools favoritas com atualizações em tempo real e histórico de APY.',
  },
  {
    icon: Download,
    title: 'Export CSV ilimitado',
    desc: 'Exporte dados de pools, histórico e análises para Excel, Google Sheets e ferramentas externas.',
  },
  {
    icon: BarChart2,
    title: 'Backtesting de rendimento',
    desc: 'Simule qual seria o retorno histórico de uma estratégia DeFi nos últimos 30/90/180 dias.',
  },
  {
    icon: Zap,
    title: 'Acesso antecipado',
    desc: 'Seja o primeiro a testar novas funcionalidades e influenciar o roadmap da plataforma.',
  },
]

const PLANS = [
  {
    id: 'monthly',
    label: 'Mensal',
    price: 'R$ 49',
    period: '/mês',
    highlight: false,
    badge: null,
  },
  {
    id: 'yearly',
    label: 'Anual',
    price: 'R$ 399',
    period: '/ano',
    highlight: true,
    badge: 'Economize 32%',
  },
  {
    id: 'token',
    label: 'Hold Token',
    price: `${env.proTokenMinAmount} ${env.proTokenSymbol}`,
    period: 'na carteira',
    highlight: false,
    badge: 'Em breve',
  },
]

const WalletVerification = () => {
  const { wallet, connecting, error, connect, disconnect } = useWallet()
  const [tokenBalance] = useState<number | null>(null)
  const [showProviders, setShowProviders] = useState(false)

  const WALLET_PROVIDERS = [
    { id: 'phantom',  name: 'Phantom',  icon: '👻' },
    { id: 'solflare', name: 'Solflare', icon: '🌞' },
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
  ] as const

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Wallet size={16} className="text-teal-400" />
        <h3 className="text-sm font-semibold text-[#e8eaf0]">Verificação por carteira</h3>
        <Badge variant="warning" size="sm">Em breve</Badge>
      </div>
      <p className="text-xs text-[#8b93a8] mb-4">
        Segure {env.proTokenMinAmount} {env.proTokenSymbol} em sua carteira para desbloquear o PRO automaticamente.
        Sem assinatura, sem renovação — apenas segure o token.
      </p>

      {!wallet ? (
        <div className="space-y-2">
          {!showProviders ? (
            <Button variant="secondary" className="w-full" onClick={() => setShowProviders(true)}>
              Conectar carteira
            </Button>
          ) : (
            <div className="space-y-2">
              {WALLET_PROVIDERS.map((p) => (
                <Button
                  key={p.id}
                  variant="secondary"
                  className="w-full justify-start gap-3"
                  loading={connecting}
                  onClick={() => connect(p.id as 'phantom' | 'solflare' | 'metamask')}
                >
                  <span>{p.icon}</span> {p.name} <ChevronRight size={14} className="ml-auto" />
                </Button>
              ))}
              <button className="text-xs text-[#5a6278] w-full text-center" onClick={() => setShowProviders(false)}>
                Cancelar
              </button>
            </div>
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
            <div>
              <div className="text-xs text-teal-400 font-medium">Conectada</div>
              <div className="font-mono text-xs text-[#8b93a8]">{formatAddress(wallet.address)}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={disconnect}>Desconectar</Button>
          </div>

          {tokenBalance !== null ? (
            tokenBalance >= env.proTokenMinAmount ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                <CheckCircle size={14} />
                Você tem {tokenBalance} {env.proTokenSymbol} — PRO ativado!
              </div>
            ) : (
              <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                Você tem {tokenBalance} {env.proTokenSymbol}. Mínimo necessário: {env.proTokenMinAmount}.
              </div>
            )
          ) : (
            <div className="text-xs text-[#5a6278] text-center py-2">
              Verificação on-chain de {env.proTokenSymbol} em desenvolvimento.
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export const ProPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('yearly')
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center py-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
          <Zap size={14} />
          YieldScope PRO
        </div>
        <h1 className="text-3xl font-bold text-[#e8eaf0]">
          Desbloqueie o potencial completo
        </h1>
        <p className="text-[#8b93a8] max-w-lg mx-auto text-sm">
          Acesso a ferramentas avançadas, dados em tempo real e funcionalidades exclusivas
          para investidores DeFi sérios.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`text-left rounded-xl border p-5 transition-all duration-200 relative ${
              selectedPlan === plan.id
                ? 'border-teal-500/60 bg-teal-500/5 shadow-lg shadow-teal-900/20'
                : 'border-[#2a3040] bg-[#111318] hover:border-[#3d4560]'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                {plan.badge}
              </span>
            )}
            <div className="text-sm font-semibold text-[#e8eaf0] mb-1">{plan.label}</div>
            <div className="text-2xl font-bold gradient-text">{plan.price}</div>
            <div className="text-xs text-[#5a6278]">{plan.period}</div>
            {selectedPlan === plan.id && (
              <div className="mt-2">
                <CheckCircle size={14} className="text-teal-400" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-teal-500/30 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 p-6 space-y-4">
        <h3 className="text-base font-semibold text-[#e8eaf0]">
          {selectedPlan === 'token' ? 'Verificação por token' : 'Lista de espera PRO'}
        </h3>

        {selectedPlan === 'token' ? (
          <WalletVerification />
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#8b93a8]">
              O pagamento via {selectedPlan === 'monthly' ? 'plano mensal' : 'plano anual'} estará disponível em breve.
              Entre na lista de espera para ser notificado primeiro e ganhar acesso antecipado.
            </p>
            {!emailSubmitted ? (
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  onClick={() => { if (email) setEmailSubmitted(true) }}
                  leftIcon={<Zap size={14} />}
                >
                  Entrar na lista
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle size={16} />
                Perfeito! Você está na lista. Vamos te avisar quando o PRO for lançado.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Benefits grid */}
      <div>
        <h2 className="text-base font-semibold text-[#e8eaf0] mb-4">O que está incluído no PRO</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 p-4 rounded-xl border border-[#2a3040] bg-[#111318]">
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 flex-shrink-0">
                <Icon size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#e8eaf0]">{title}</div>
                <div className="text-xs text-[#5a6278] mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <Card>
        <h2 className="text-base font-semibold text-[#e8eaf0] mb-4">Perguntas frequentes</h2>
        <div className="space-y-3">
          {[
            {
              q: 'O YieldScope PRO executa transações por mim?',
              a: 'Não. O YieldScope é uma plataforma de análise e descoberta. Todas as operações são realizadas diretamente nos protocolos DeFi.',
            },
            {
              q: 'Os dados são em tempo real?',
              a: 'Usamos a API do DefiLlama, que atualiza os dados a cada ~1 hora. O plano PRO pode incluir polling mais frequente no futuro.',
            },
            {
              q: 'Como funciona a verificação por token?',
              a: `Você conecta sua carteira e o sistema verifica se você possui ${env.proTokenMinAmount} ${env.proTokenSymbol}. Enquanto segurar o token, o PRO fica ativo.`,
            },
            {
              q: 'Posso cancelar a assinatura?',
              a: 'Sim. Planos mensais e anuais poderão ser cancelados a qualquer momento. Sem taxas de cancelamento.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-[#1e2433] pb-3">
              <div className="text-sm font-medium text-[#e8eaf0] mb-1">{q}</div>
              <div className="text-xs text-[#8b93a8]">{a}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="text-xs text-[#5a6278] text-center">
        Nenhuma funcionalidade do YieldScope constitui recomendação financeira.
        Todo rendimento DeFi envolve risco. Invista com responsabilidade.
      </div>
    </div>
  )
}

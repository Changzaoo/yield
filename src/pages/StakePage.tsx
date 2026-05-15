import { useState } from 'react'
import { ExternalLink, AlertTriangle, Info, ChevronRight, Zap } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { useWallet } from '@/hooks/useWallet'
import { formatAddress } from '@/utils/format'
import { SOL_LST_TOKENS, buildJupiterSwapUrl } from '@/services/jupiter'

const LST_OPTIONS = [
  {
    symbol: 'jitoSOL',
    name: 'Jito Staked SOL',
    mint: SOL_LST_TOKENS.jitoSOL,
    apy: '~7.5%',
    protocol: 'Jito',
    description: 'Stake com MEV rewards via Jito. Um dos maiores e mais usados LSTs de Solana.',
    color: '#22d3ee',
  },
  {
    symbol: 'mSOL',
    name: 'Marinade Staked SOL',
    mint: SOL_LST_TOKENS.mSOL,
    apy: '~7.2%',
    protocol: 'Marinade',
    description: 'LST da Marinade Finance. Distribuição de stake entre centenas de validadores.',
    color: '#a78bfa',
  },
  {
    symbol: 'bSOL',
    name: 'BlazeStake SOL',
    mint: SOL_LST_TOKENS.bSOL,
    apy: '~7.3%',
    protocol: 'BlazeStake',
    description: 'LST com foco em descentralização via Sanctum.',
    color: '#fb923c',
  },
  {
    symbol: 'INF',
    name: 'Infinity by Sanctum',
    mint: SOL_LST_TOKENS.INF,
    apy: '~7.8%',
    protocol: 'Sanctum',
    description: 'Pool de liquidez unificada de LSTs via Sanctum. Acumula yield de múltiplos validators.',
    color: '#10b981',
  },
]

const WALLET_PROVIDERS = [
  { id: 'phantom',  name: 'Phantom',  icon: '👻', url: 'https://phantom.app' },
  { id: 'solflare', name: 'Solflare', icon: '🌞', url: 'https://solflare.com' },
  { id: 'backpack', name: 'Backpack', icon: '🎒', url: 'https://backpack.app' },
] as const

export const StakePage = () => {
  const { wallet, connecting, error: walletError, connect, disconnect } = useWallet()
  const [selectedLST, setSelectedLST] = useState(LST_OPTIONS[0])
  const [amount, setAmount] = useState('')
  const [showWalletOptions, setShowWalletOptions] = useState(false)

  const estimatedLST = amount ? (parseFloat(amount) * 0.9995).toFixed(4) : ''
  const estimatedYearlyReward = amount
    ? (parseFloat(amount) * (parseFloat(selectedLST.apy) / 100)).toFixed(4)
    : ''

  const jupiterUrl = buildJupiterSwapUrl(SOL_LST_TOKENS.SOL, selectedLST.mint)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 py-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-3">
          <Zap size={14} />
          Powered by Sanctum / Jupiter
        </div>
        <h1 className="text-3xl font-bold text-[#e8eaf0]">
          Stake SOL e receba um{' '}
          <span className="gradient-text">LST</span>
        </h1>
        <p className="text-[#8b93a8] max-w-lg mx-auto text-sm">
          Transforme seu SOL em um Liquid Staking Token (LST) e ganhe recompensas de staking
          enquanto mantém liquidez para usar em DeFi.
        </p>
      </div>

      <Disclaimer />

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { step: '1', icon: '🔗', title: 'Conecte sua carteira', desc: 'Phantom, Solflare ou Backpack' },
          { step: '2', icon: '💰', title: 'Insira a quantidade', desc: 'Mínimo: qualquer valor de SOL' },
          { step: '3', icon: '📈', title: 'Receba o LST', desc: 'Seu LST acumula rendimento automaticamente' },
        ].map(({ step, icon, title, desc }) => (
          <div key={step} className="rounded-xl border border-[#2a3040] bg-[#111318] p-4 text-center">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-xs text-teal-400 font-semibold mb-1">Passo {step}</div>
            <div className="text-sm font-semibold text-[#e8eaf0]">{title}</div>
            <div className="text-xs text-[#5a6278] mt-0.5">{desc}</div>
          </div>
        ))}
      </div>

      {/* LST Selector */}
      <Card>
        <h3 className="text-sm font-semibold text-[#e8eaf0] mb-3">Escolha o LST</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LST_OPTIONS.map((lst) => (
            <button
              key={lst.symbol}
              onClick={() => setSelectedLST(lst)}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                selectedLST.symbol === lst.symbol
                  ? 'border-teal-500/50 bg-teal-500/5'
                  : 'border-[#2a3040] hover:border-[#3d4560]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: lst.color + '30', color: lst.color }}
                  >
                    ◎
                  </div>
                  <span className="font-semibold text-[#e8eaf0] text-sm">{lst.symbol}</span>
                </div>
                <Badge variant="success" size="sm">{lst.apy}</Badge>
              </div>
              <div className="text-xs text-[#5a6278]">{lst.description}</div>
              <div className="text-[10px] text-teal-400 mt-1">via {lst.protocol}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Stake form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card neon>
          <h3 className="text-sm font-semibold text-[#e8eaf0] mb-4">Fazer Stake</h3>

          {/* Wallet connect */}
          {!wallet ? (
            <div className="space-y-3 mb-4">
              <p className="text-xs text-[#5a6278]">Conecte sua carteira Solana para continuar</p>
              {!showWalletOptions ? (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowWalletOptions(true)}
                >
                  Conectar Carteira
                </Button>
              ) : (
                <div className="space-y-2">
                  {WALLET_PROVIDERS.map((p) => (
                    <Button
                      key={p.id}
                      variant="secondary"
                      className="w-full justify-start gap-3"
                      loading={connecting}
                      onClick={() => connect(p.id as 'phantom' | 'solflare' | 'backpack')}
                    >
                      <span>{p.icon}</span>
                      {p.name}
                      <ChevronRight size={14} className="ml-auto" />
                    </Button>
                  ))}
                  <button
                    className="text-xs text-[#5a6278] w-full text-center pt-1"
                    onClick={() => setShowWalletOptions(false)}
                  >
                    Cancelar
                  </button>
                </div>
              )}
              {walletError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle size={11} /> {walletError}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between mb-4 p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
              <div className="text-xs">
                <div className="text-teal-400 font-medium">Carteira conectada</div>
                <div className="text-[#5a6278] font-mono">{formatAddress(wallet.address)}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={disconnect}>Desconectar</Button>
            </div>
          )}

          {/* Amount input */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-[#5a6278]">Quantidade de SOL</label>
              <Input
                type="number"
                min={0}
                step={0.1}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                rightElement={<span className="text-xs font-medium text-[#8b93a8]">SOL</span>}
              />
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="space-y-2 text-xs p-3 bg-[#1a1f2e] rounded-lg border border-[#2a3040]">
                <div className="flex justify-between">
                  <span className="text-[#5a6278]">Você receberá (est.)</span>
                  <span className="text-[#e8eaf0] font-semibold">{estimatedLST} {selectedLST.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a6278]">Rendimento anual (est.)</span>
                  <span className="text-emerald-400 font-semibold">~{estimatedYearlyReward} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a6278]">APY estimado</span>
                  <span className="text-teal-400 font-semibold">{selectedLST.apy}</span>
                </div>
              </div>
            )}

            {/* TODO: Jupiter Terminal integration */}
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full"
                disabled={!wallet || !amount || parseFloat(amount) <= 0}
                onClick={() => window.open(jupiterUrl, '_blank')}
              >
                {wallet ? `Stake via Jupiter →` : 'Conecte a carteira primeiro'}
              </Button>
              <p className="text-[10px] text-[#5a6278] text-center">
                {/* TODO: Integrar Jupiter Terminal diretamente quando disponível */}
                Abre o Jupiter para executar o swap SOL → {selectedLST.symbol}
              </p>
            </div>

            <div className="flex items-start gap-1.5 text-xs text-amber-400/80">
              <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" />
              <span>Slippage, taxas de rede e preço de mercado podem afetar o valor final recebido. Rendimento não é garantido.</span>
            </div>
          </div>
        </Card>

        {/* LST Info */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#e8eaf0]">{selectedLST.name}</h3>
              <Badge variant="success">{selectedLST.apy} APY</Badge>
            </div>
            <div className="space-y-3 text-xs text-[#8b93a8]">
              <p>{selectedLST.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#1a1f2e] p-2 rounded-lg border border-[#2a3040]">
                  <div className="text-[#5a6278] mb-0.5">Protocolo</div>
                  <div className="text-[#e8eaf0] font-semibold">{selectedLST.protocol}</div>
                </div>
                <div className="bg-[#1a1f2e] p-2 rounded-lg border border-[#2a3040]">
                  <div className="text-[#5a6278] mb-0.5">Rede</div>
                  <div className="text-[#e8eaf0] font-semibold">Solana</div>
                </div>
              </div>
              <a
                href={jupiterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-teal-400 hover:underline"
              >
                <ExternalLink size={12} />
                Ver no Jupiter
              </a>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Info size={14} className="text-[#5a6278]" />
              <h3 className="text-sm font-semibold text-[#e8eaf0]">Como o LST acumula rendimento</h3>
            </div>
            <div className="space-y-2 text-xs text-[#8b93a8]">
              <p>Ao contrário de um token de recompensa separado, o {selectedLST.symbol} <strong className="text-[#e8eaf0]">valoriza em relação ao SOL</strong> ao longo do tempo.</p>
              <p>Exemplo: hoje 1 {selectedLST.symbol} = 1.07 SOL. Em um ano, pode valer 1.14 SOL.</p>
              <p>Você pode usar o {selectedLST.symbol} em pools DeFi (Marinade, Orca, Kamino) enquanto ainda acumula as recompensas de staking.</p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-amber-400" />
              <h3 className="text-sm font-semibold text-[#e8eaf0]">Riscos</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-[#8b93a8]">
              <li>• <strong className="text-[#e8eaf0]">Smart contract risk:</strong> bugs no contrato do protocolo de staking</li>
              <li>• <strong className="text-[#e8eaf0]">Depegging:</strong> o LST pode ser negociado abaixo do preço do SOL</li>
              <li>• <strong className="text-[#e8eaf0]">Slashing:</strong> penalidades por má conduta de validadores</li>
              <li>• <strong className="text-[#e8eaf0]">APY variável:</strong> o rendimento muda conforme as condições da rede</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

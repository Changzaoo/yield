import { useState } from 'react'
import { Eye, Search, ExternalLink, AlertTriangle, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ChainBadge } from '@/components/ui/ChainBadge'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { analyzeWallet, getAddressUrl } from '@/services/whales'
import { formatUSD, formatAddress, formatTimeAgo } from '@/utils/format'
import type { SupportedChain } from '@/types/wallet'

const CHAIN_OPTIONS: { value: SupportedChain; label: string }[] = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'base',     label: 'Base' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'bsc',      label: 'BNB Chain' },
  { value: 'polygon',  label: 'Polygon' },
  { value: 'solana',   label: 'Solana' },
]

const DEMO_ADDRESSES: Record<SupportedChain, string> = {
  ethereum: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  base:     '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  arbitrum: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  bsc:      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  polygon:  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  solana:   '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
}

export const WhaleTrackerPage = () => {
  const [inputAddress, setInputAddress] = useState('')
  const [chain, setChain] = useState<SupportedChain>('ethereum')
  const [submitted, setSubmitted] = useState<{ address: string; chain: SupportedChain } | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['whale', submitted?.address, submitted?.chain],
    queryFn: () =>
      submitted ? analyzeWallet(submitted.address, submitted.chain) : null,
    enabled: !!submitted,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const addr = inputAddress.trim()
    if (!addr) return
    setSubmitted({ address: addr, chain })
  }

  const loadDemo = () => {
    const addr = DEMO_ADDRESSES[chain]
    setInputAddress(addr)
    setSubmitted({ address: addr, chain })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-[#e8eaf0] flex items-center gap-2">
          <Eye size={20} className="text-teal-400" />
          Whale Tracker
        </h1>
        <p className="text-sm text-[#5a6278] mt-0.5">
          Analise carteiras DeFi em múltiplas chains e acompanhe grandes movimentações
        </p>
      </div>

      {/* Search form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={chain}
              onChange={(e) => setChain(e.target.value as SupportedChain)}
              options={CHAIN_OPTIONS}
              className="sm:w-40"
            />
            <div className="flex-1">
              <Input
                leftIcon={<Search size={15} />}
                placeholder="Endereço da carteira (0x... ou endereço Solana)"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" leftIcon={<Search size={14} />}>
              Analisar
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={loadDemo}>
              Carregar endereço demo
            </Button>
            <span className="text-xs text-[#5a6278]">
              (sem chave de API configurada, exibe dados demonstrativos)
            </span>
          </div>
        </form>
      </Card>

      <Disclaimer compact />

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {isError && (
        <Card>
          <div className="flex flex-col items-center py-8 gap-3 text-center">
            <AlertTriangle size={24} className="text-red-400" />
            <p className="text-[#e8eaf0] font-semibold">Erro ao analisar carteira</p>
            <p className="text-xs text-[#5a6278]">Verifique o endereço e tente novamente.</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={13} />}>
              Tentar novamente
            </Button>
          </div>
        </Card>
      )}

      {data && (
        <div className="space-y-4">
          {/* Demo warning */}
          {data.isDemo && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <AlertTriangle size={13} />
              <strong>Dados demonstrativos.</strong> Configure uma chave de API (Helius para Solana, Etherscan para EVM) no arquivo .env para ver dados reais.
            </div>
          )}

          {/* Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <div className="text-xs text-[#5a6278] mb-1">Endereço</div>
              <div className="font-mono text-sm text-[#e8eaf0] break-all">{formatAddress(data.address, 8)}</div>
              <div className="mt-2">
                <ChainBadge chain={data.chain} />
              </div>
              <a
                href={getAddressUrl(data.chain, data.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-teal-400 hover:underline mt-2"
              >
                <ExternalLink size={11} /> Ver no explorer
              </a>
            </Card>

            <Card highlight>
              <div className="text-xs text-[#5a6278] mb-1">Saldo total estimado</div>
              <div className="text-2xl font-bold gradient-text">{formatUSD(data.totalBalanceUsd)}</div>
              <div className="mt-2 space-y-0.5 text-xs text-[#8b93a8]">
                <div>Nativo: {formatUSD(data.nativeBalance)}</div>
                <div>Stablecoins: {formatUSD(data.stablecoinBalance)}</div>
              </div>
            </Card>

            <Card>
              <div className="text-xs text-[#5a6278] mb-1">Composição</div>
              <div className="space-y-1.5 mt-2">
                {[
                  { label: 'Nativo', value: data.nativeBalance, total: data.totalBalanceUsd, color: '#0ea5e9' },
                  { label: 'Stablecoins', value: data.stablecoinBalance, total: data.totalBalanceUsd, color: '#10b981' },
                  { label: 'Outros', value: Math.max(0, data.totalBalanceUsd - data.nativeBalance - data.stablecoinBalance), total: data.totalBalanceUsd, color: '#8b5cf6' },
                ].map(({ label, value, total, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-[#5a6278]">{label}</span>
                      <span className="text-[#8b93a8]">{total > 0 ? ((value / total) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1f2330] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${total > 0 ? (value / total) * 100 : 0}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Tokens */}
          <Card>
            <CardHeader title="Tokens principais" description={`${data.tokens.length} ativos encontrados`} />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#2a3040]">
                    <th className="text-left py-2 text-[#5a6278]">Token</th>
                    <th className="text-right py-2 text-[#5a6278]">Quantidade</th>
                    <th className="text-right py-2 text-[#5a6278]">Preço</th>
                    <th className="text-right py-2 text-[#5a6278]">Valor USD</th>
                    <th className="text-right py-2 text-[#5a6278]">% Portfólio</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tokens.map((token) => (
                    <tr key={token.symbol} className="border-b border-[#1e2433] hover:bg-[#141820]">
                      <td className="py-2">
                        <div className="font-semibold text-[#e8eaf0]">{token.symbol}</div>
                        <div className="text-[#5a6278]">{token.name}</div>
                      </td>
                      <td className="py-2 text-right text-[#8b93a8] tabular-nums">
                        {token.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                      </td>
                      <td className="py-2 text-right text-[#8b93a8] tabular-nums">
                        {formatUSD(token.price)}
                      </td>
                      <td className="py-2 text-right font-semibold text-[#e8eaf0] tabular-nums">
                        {formatUSD(token.balanceUsd)}
                      </td>
                      <td className="py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-[#1f2330] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-teal-500"
                              style={{ width: `${Math.min(100, (token.balanceUsd / data.totalBalanceUsd) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[#8b93a8] w-8 text-right">
                            {((token.balanceUsd / data.totalBalanceUsd) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Transactions */}
          <Card>
            <CardHeader
              title="Últimas transações"
              description="Movimentações recentes"
              action={
                <a
                  href={getAddressUrl(data.chain, data.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-400 hover:underline flex items-center gap-1"
                >
                  Ver todas <ExternalLink size={11} />
                </a>
              }
            />
            <div className="space-y-2">
              {data.transactions.map((tx) => (
                <div
                  key={tx.hash}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#141820] transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'receive'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-red-500/15 text-red-400'
                    }`}
                  >
                    {tx.type === 'receive' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={tx.type === 'receive' ? 'success' : 'danger'} size="sm">
                        {tx.type === 'receive' ? 'Recebeu' : 'Enviou'}
                      </Badge>
                      <span className="text-xs text-[#8b93a8]">{tx.symbol}</span>
                    </div>
                    <div className="font-mono text-[11px] text-[#5a6278] truncate">{tx.hash.slice(0, 20)}...</div>
                  </div>
                  <div className="text-right">
                    {tx.valueUsd && (
                      <div className="text-xs font-semibold text-[#e8eaf0]">{formatUSD(tx.valueUsd)}</div>
                    )}
                    <div className="text-[11px] text-[#5a6278]">{formatTimeAgo(tx.timestamp)}</div>
                  </div>
                  <a
                    href={`https://${data.chain === 'solana' ? 'solscan.io/tx' : 'etherscan.io/tx'}/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5a6278] hover:text-teal-400 transition-colors"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {!submitted && !isLoading && (
        <Card>
          <div className="flex flex-col items-center py-12 gap-3 text-center">
            <Eye size={32} className="text-[#2e3546]" />
            <h3 className="text-[#e8eaf0] font-semibold">Digite um endereço para começar</h3>
            <p className="text-xs text-[#5a6278] max-w-sm">
              Analise qualquer carteira Ethereum, Base, Arbitrum, BSC, Polygon ou Solana.
              Configure chaves de API no .env para dados reais.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

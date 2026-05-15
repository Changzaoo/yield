import { useState, useMemo } from 'react'
import { Bitcoin, Lock, TrendingUp, BarChart2 } from 'lucide-react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useYieldPools } from '@/hooks/useYieldPools'
import { useCurrency } from '@/components/layout/AppLayout'
import { ProGate } from '@/components/ui/ProGate'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChainBadge } from '@/components/ui/ChainBadge'
import { APYBadge } from '@/components/ui/APYBadge'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { TVLDisplay } from '@/components/ui/TVLDisplay'
import { MetricCard } from '@/components/ui/MetricCard'
import { SkeletonTable, SkeletonMetricCards } from '@/components/ui/Skeleton'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { Input } from '@/components/ui/Input'
import { formatAPY, formatTVL } from '@/utils/format'

const BTC_KEYWORDS = ['btc', 'wbtc', 'cbbtc', 'tbtc', 'bitcoin', 'lbtc', 'solvbtc']

const isBtcPool = (symbol: string, project: string) => {
  const s = symbol.toLowerCase()
  const p = project.toLowerCase()
  return BTC_KEYWORDS.some((k) => s.includes(k) || p.includes(k))
}

const SimulatorSection = () => {
  const [btcAmount, setBtcAmount] = useState(1)
  const [btcPrice, setBtcPrice] = useState(95000)
  const [holdMonths, setHoldMonths] = useState(12)
  const [wbtcApy, setWbtcApy] = useState(3)
  const [lpApy, setLpApy] = useState(8)
  const [lstApy, setLstApy] = useState(2)

  const initialUsd = btcAmount * btcPrice
  const holdReturn = initialUsd
  const wbtcReturn = initialUsd * (1 + (wbtcApy / 100) * (holdMonths / 12))
  const lpReturn = initialUsd * (1 + (lpApy / 100) * (holdMonths / 12))
  const lstReturn = initialUsd * (1 + (lstApy / 100) * (holdMonths / 12))

  const chartData = [
    { name: 'HOLD BTC', value: Number(holdReturn.toFixed(0)), fill: '#f59e0b' },
    { name: 'WBTC Lending', value: Number(wbtcReturn.toFixed(0)), fill: '#0ea5e9' },
    { name: 'cbBTC Pool', value: Number(lpReturn.toFixed(0)), fill: '#10b981' },
    { name: 'BTC LST', value: Number(lstReturn.toFixed(0)), fill: '#8b5cf6' },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Parâmetros da simulação" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Quantidade de BTC', value: btcAmount, setter: setBtcAmount, step: 0.01 },
            { label: 'Preço BTC (USD)', value: btcPrice, setter: setBtcPrice, step: 1000 },
            { label: 'Período (meses)', value: holdMonths, setter: setHoldMonths, step: 1 },
            { label: 'APY WBTC Lending (%)', value: wbtcApy, setter: setWbtcApy, step: 0.5 },
            { label: 'APY cbBTC Pool (%)', value: lpApy, setter: setLpApy, step: 0.5 },
            { label: 'APY BTC LST (%)', value: lstApy, setter: setLstApy, step: 0.5 },
          ].map(({ label, value, setter, step }) => (
            <div key={label} className="space-y-1">
              <label className="text-xs text-[#5a6278]">{label}</label>
              <Input
                type="number"
                min={0}
                step={step}
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {chartData.map(({ name, value }) => (
          <MetricCard
            key={name}
            label={name}
            value={formatTVL(value)}
            sub={`+${((value / initialUsd - 1) * 100).toFixed(1)}%`}
          />
        ))}
      </div>

      <Card>
        <CardHeader title="Comparação de estratégias BTC" description={`${holdMonths} meses`} />
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" />
              <XAxis dataKey="name" tick={{ fill: '#5a6278', fontSize: 10 }} />
              <YAxis tick={{ fill: '#5a6278', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#111318', border: '1px solid #2a3040', borderRadius: 8 }}
                formatter={(val) => [formatTVL(Number(val)), 'Valor USD']}
              />
              <Legend wrapperStyle={{ fontSize: 10, color: '#8b93a8' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export const BitcoinLabPage = () => {
  const currency = useCurrency()
  const { data: pools, isLoading } = useYieldPools()

  const btcPools = useMemo(() => {
    if (!pools) return []
    return pools.filter((p) => isBtcPool(p.symbol ?? '', p.project ?? ''))
  }, [pools])

  const metrics = useMemo(() => {
    const tvl = btcPools.reduce((s, p) => s + p.tvlUsd, 0)
    const apys = btcPools.map((p) => p.apy).filter((a) => a > 0)
    const apyAvg = apys.length ? apys.reduce((s, a) => s + a, 0) / apys.length : 0
    const apyMax = apys.length ? Math.max(...apys) : 0
    return { count: btcPools.length, tvl, apyAvg, apyMax }
  }, [btcPools])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-[#e8eaf0] flex items-center gap-2">
            <Bitcoin size={20} className="text-amber-400" />
            Bitcoin Lab
          </h1>
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">PRO</span>
        </div>
        <p className="text-sm text-[#5a6278]">
          Descubra as melhores oportunidades DeFi com BTC, WBTC, cbBTC e tBTC
        </p>
      </div>

      <Disclaimer />

      {/* Metrics */}
      {isLoading ? (
        <SkeletonMetricCards count={4} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="Pools BTC" value={metrics.count} />
          <MetricCard label="TVL total" value={formatTVL(metrics.tvl, currency)} highlight />
          <MetricCard label="APY médio" value={formatAPY(metrics.apyAvg)} />
          <MetricCard label="Maior APY" value={formatAPY(metrics.apyMax)} />
        </div>
      )}

      {/* BTC Pool table — public */}
      <Card>
        <CardHeader
          title="Pools com BTC"
          description="WBTC, cbBTC, tBTC, solvBTC e derivados"
          icon={<BarChart2 size={14} />}
        />
        {isLoading ? (
          <SkeletonTable rows={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#2a3040]">
                  <th className="text-left py-2 px-2 text-[#5a6278]">Pool</th>
                  <th className="text-left py-2 px-2 text-[#5a6278]">Protocolo</th>
                  <th className="text-left py-2 px-2 text-[#5a6278]">Chain</th>
                  <th className="text-right py-2 px-2 text-[#5a6278]">TVL</th>
                  <th className="text-right py-2 px-2 text-[#5a6278]">APY</th>
                  <th className="text-left py-2 px-2 text-[#5a6278]">Risco</th>
                </tr>
              </thead>
              <tbody>
                {btcPools.slice(0, 15).map((pool) => (
                  <tr key={pool.pool} className="border-b border-[#1e2433] hover:bg-[#141820]">
                    <td className="py-2 px-2 font-medium text-[#e8eaf0]">{pool.symbol?.slice(0, 20)}</td>
                    <td className="py-2 px-2 text-[#8b93a8]">{pool.project}</td>
                    <td className="py-2 px-2"><ChainBadge chain={pool.chain} size="sm" /></td>
                    <td className="py-2 px-2 text-right">
                      <TVLDisplay value={pool.tvlUsd} currency={currency} />
                    </td>
                    <td className="py-2 px-2 text-right"><APYBadge apy={pool.apy} size="sm" /></td>
                    <td className="py-2 px-2"><RiskBadge label={pool.riskLabel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Simulator — PRO locked */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-teal-400" />
          <h2 className="text-sm font-semibold text-[#e8eaf0]">Simulador de estratégias BTC</h2>
          <Lock size={13} className="text-amber-400" />
        </div>
        <ProGate
          title="Simulador PRO"
          description="Compare Hold vs Lending vs LP com BTC de forma detalhada. Disponível no plano PRO."
        >
          <SimulatorSection />
        </ProGate>
      </div>

      {/* Advanced analysis — PRO locked */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={16} className="text-teal-400" />
          <h2 className="text-sm font-semibold text-[#e8eaf0]">Análise avançada de pools BTC</h2>
          <Lock size={13} className="text-amber-400" />
        </div>
        <ProGate
          title="Análise PRO"
          description="Filtros avançados, histórico de APY e alertas de movimentação BTC. Disponível no plano PRO."
        >
          <Card>
            <div className="h-40 flex items-center justify-center text-[#5a6278]">
              Análise detalhada disponível no PRO
            </div>
          </Card>
        </ProGate>
      </div>
    </div>
  )
}

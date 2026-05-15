import { useState, useMemo } from 'react'
import { Droplets, AlertTriangle } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Input, Select } from '@/components/ui/Input'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { simulateLiquidity } from '@/utils/calculations'
import { formatUSD } from '@/utils/format'

const COMMON_TOKENS = ['ETH', 'BTC', 'SOL', 'MATIC', 'ARB', 'USDC', 'USDT', 'DAI', 'BNB', 'AVAX']

const DEFAULT_PRICES: Record<string, number> = {
  ETH: 3000, BTC: 95000, SOL: 160, MATIC: 0.6,
  ARB: 0.9, USDC: 1, USDT: 1, DAI: 1, BNB: 600, AVAX: 30,
}

const ILColor = (il: number) => {
  if (il >= -1) return '#10b981'
  if (il >= -5) return '#f59e0b'
  if (il >= -15) return '#f97316'
  return '#ef4444'
}

export const LiquidityCalculatorPage = () => {
  const [tokenA, setTokenA] = useState('ETH')
  const [tokenB, setTokenB] = useState('USDC')
  const [priceA, setPriceA] = useState(DEFAULT_PRICES['ETH'])
  const [priceB, setPriceB] = useState(DEFAULT_PRICES['USDC'])
  const [capital, setCapital] = useState(10000)
  const [changeA, setChangeA] = useState(50)
  const [changeB, setChangeB] = useState(0)
  const [feeApy, setFeeApy] = useState(30)
  const [days, setDays] = useState(365)

  const handleTokenAChange = (val: string) => {
    setTokenA(val)
    if (DEFAULT_PRICES[val]) setPriceA(DEFAULT_PRICES[val])
  }

  const handleTokenBChange = (val: string) => {
    setTokenB(val)
    if (DEFAULT_PRICES[val]) setPriceB(DEFAULT_PRICES[val])
  }

  const tokenAAmount = priceA > 0 ? (capital / 2) / priceA : 0
  const tokenBAmount = priceB > 0 ? (capital / 2) / priceB : 0
  const newPriceA = priceA * (1 + changeA / 100)
  const newPriceB = priceB * (1 + changeB / 100)

  const result = useMemo(
    () =>
      simulateLiquidity(
        tokenAAmount,
        tokenBAmount,
        priceA,
        priceB,
        newPriceA,
        newPriceB,
        feeApy,
        days
      ),
    [tokenAAmount, tokenBAmount, priceA, priceB, newPriceA, newPriceB, feeApy, days]
  )

  const chartData = useMemo(() => {
    const scenarios = [-75, -50, -30, -20, -10, 0, 10, 25, 50, 100, 200]
    return scenarios.map((change) => {
      const nPriceA = priceA * (1 + change / 100)
      const r = simulateLiquidity(tokenAAmount, tokenBAmount, priceA, priceB, nPriceA, priceB, feeApy, days)
      return {
        name: `${change > 0 ? '+' : ''}${change}%`,
        HOLD: Number(r.holdValue.toFixed(0)),
        'LP + Fees': Number(r.lpValueWithFees.toFixed(0)),
        IL: Number(r.ilFraction.toFixed(2)),
      }
    })
  }, [tokenAAmount, tokenBAmount, priceA, priceB, feeApy, days])

  const ilColor = ILColor(result.ilFraction)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-[#e8eaf0] flex items-center gap-2">
          <Droplets size={20} className="text-teal-400" />
          Calculadora de Liquidez
        </h1>
        <p className="text-sm text-[#5a6278] mt-0.5">
          Simule impermanent loss, taxas e rendimento de pools de liquidez (AMM)
        </p>
      </div>

      <Disclaimer />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Tokens da Pool" />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Token A</label>
                  <Select
                    value={tokenA}
                    onChange={(e) => handleTokenAChange(e.target.value)}
                    options={COMMON_TOKENS.map((t) => ({ value: t, label: t }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Token B</label>
                  <Select
                    value={tokenB}
                    onChange={(e) => handleTokenBChange(e.target.value)}
                    options={COMMON_TOKENS.map((t) => ({ value: t, label: t }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Preço {tokenA} (USD)</label>
                  <Input
                    type="number"
                    min={0}
                    value={priceA}
                    onChange={(e) => setPriceA(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Preço {tokenB} (USD)</label>
                  <Input
                    type="number"
                    min={0}
                    value={priceB}
                    onChange={(e) => setPriceB(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#5a6278]">Capital total (USD)</label>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs p-2 bg-[#1a1f2e] rounded-lg border border-[#2a3040]">
                <div>
                  <div className="text-[#5a6278]">Qtd. {tokenA}</div>
                  <div className="text-[#e8eaf0] font-semibold">{tokenAAmount.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-[#5a6278]">Qtd. {tokenB}</div>
                  <div className="text-[#e8eaf0] font-semibold">{tokenBAmount.toFixed(4)}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Cenário futuro" />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Variação {tokenA} (%)</label>
                  <Input
                    type="number"
                    step={5}
                    value={changeA}
                    onChange={(e) => setChangeA(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Variação {tokenB} (%)</label>
                  <Input
                    type="number"
                    step={5}
                    value={changeB}
                    onChange={(e) => setChangeB(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Fee APY estimado (%)</label>
                  <Input
                    type="number"
                    min={0}
                    max={1000}
                    step={1}
                    value={feeApy}
                    onChange={(e) => setFeeApy(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Período (dias)</label>
                  <Select
                    value={String(days)}
                    onChange={(e) => setDays(Number(e.target.value))}
                    options={[
                      { value: '30',  label: '30 dias' },
                      { value: '90',  label: '90 dias' },
                      { value: '180', label: '180 dias' },
                      { value: '365', label: '1 ano' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <Card neon>
            <h3 className="text-sm font-semibold text-[#e8eaf0] mb-4">Resultado</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#1a1f2e] rounded-lg p-3 border border-[#2a3040]">
                <div className="text-[#5a6278]">Valor inicial</div>
                <div className="text-lg font-bold text-[#e8eaf0]">{formatUSD(result.initialValue)}</div>
              </div>
              <div className="bg-[#1a1f2e] rounded-lg p-3 border border-[#2a3040]">
                <div className="text-[#5a6278]">Taxas ganhas</div>
                <div className="text-lg font-bold text-emerald-400">+{formatUSD(result.feesEarned)}</div>
              </div>
              <div className="bg-[#1a1f2e] rounded-lg p-3 border border-[#2a3040]">
                <div className="text-[#5a6278]">HOLD futuro</div>
                <div className="text-lg font-bold text-sky-400">{formatUSD(result.holdValue)}</div>
              </div>
              <div className="bg-[#1a1f2e] rounded-lg p-3 border border-[#2a3040]">
                <div className="text-[#5a6278]">LP + Fees</div>
                <div className="text-lg font-bold text-teal-400">{formatUSD(result.lpValueWithFees)}</div>
              </div>

              <div className="col-span-2 bg-[#1a1f2e] rounded-lg p-3 border border-[#2a3040]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#5a6278]">Impermanent Loss</div>
                    <div className="text-xl font-bold mt-0.5" style={{ color: ilColor }}>
                      {result.ilFraction.toFixed(2)}%
                    </div>
                  </div>
                  <Badge
                    variant={result.ilFraction >= -1 ? 'success' : result.ilFraction >= -5 ? 'warning' : 'danger'}
                  >
                    {result.ilFraction >= -1 ? 'Baixo IL' : result.ilFraction >= -5 ? 'IL Moderado' : 'IL Alto'}
                  </Badge>
                </div>
                {result.ilUsd < 0 && (
                  <div className="text-[10px] text-[#5a6278] mt-1">
                    = {formatUSD(Math.abs(result.ilUsd))} a menos que HOLD
                  </div>
                )}
              </div>

              <div className="col-span-2 bg-[#1a1f2e] rounded-lg p-3 border border-[#2a3040]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#5a6278]">P&L líquido (LP vs. initial)</div>
                    <div className={`text-xl font-bold mt-0.5 ${result.netPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.netPnl >= 0 ? '+' : ''}{formatUSD(result.netPnl)}
                    </div>
                  </div>
                  {result.breakEvenApy > 0 && (
                    <div className="text-right">
                      <div className="text-[10px] text-[#5a6278]">APY p/ cobrir IL</div>
                      <div className="text-sm font-bold text-amber-400">{result.breakEvenApy.toFixed(1)}%</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {result.lpValueWithFees > result.holdValue ? (
              <div className="mt-3 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
                ✓ LP com fees supera a estratégia HOLD neste cenário (+{formatUSD(result.lpValueWithFees - result.holdValue)})
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                <AlertTriangle size={12} />
                HOLD seria mais rentável neste cenário ({formatUSD(result.holdValue - result.lpValueWithFees)} a mais)
              </div>
            )}
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader title={`HOLD vs LP — variação do ${tokenA}`} description="Considerando fee APY fixo" />
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" />
                  <XAxis dataKey="name" tick={{ fill: '#5a6278', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#5a6278', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#111318', border: '1px solid #2a3040', borderRadius: 8 }}
                    labelStyle={{ color: '#8b93a8', fontSize: 11 }}
                    formatter={(val) => [formatUSD(Number(val))]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#8b93a8' }} />
                  <Bar dataKey="HOLD" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="LP + Fees" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Reference table */}
          <Card>
            <CardHeader title="Tabela de IL por variação de preço" />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#2a3040]">
                    <th className="text-left py-1.5 text-[#5a6278]">Variação {tokenA}</th>
                    <th className="text-right py-1.5 text-[#5a6278]">IL%</th>
                    <th className="text-right py-1.5 text-[#5a6278]">LP Value</th>
                    <th className="text-right py-1.5 text-[#5a6278]">vs HOLD</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row) => {
                    const diff = row['LP + Fees'] - row['HOLD']
                    return (
                      <tr key={row.name} className="border-b border-[#1e2433]">
                        <td className="py-1.5 font-medium text-[#e8eaf0]">{row.name}</td>
                        <td className="py-1.5 text-right" style={{ color: ILColor(row.IL) }}>
                          {row.IL.toFixed(1)}%
                        </td>
                        <td className="py-1.5 text-right text-[#8b93a8]">{formatUSD(row['LP + Fees'])}</td>
                        <td className={`py-1.5 text-right font-semibold ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {diff >= 0 ? '+' : ''}{formatUSD(diff)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Landmark, AlertTriangle, Info } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { Input, Select } from '@/components/ui/Input'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { simulateLend, simulatePriceDrop, getHealthFactorLabel } from '@/utils/calculations'
import { formatUSD } from '@/utils/format'

const COLLATERAL_TOKENS = [
  { value: 'ETH',  label: 'ETH',  defaultPrice: 3000,  liquidationThreshold: 82.5 },
  { value: 'BTC',  label: 'BTC',  defaultPrice: 95000, liquidationThreshold: 80 },
  { value: 'SOL',  label: 'SOL',  defaultPrice: 160,   liquidationThreshold: 75 },
  { value: 'MATIC',label: 'MATIC',defaultPrice: 0.6,   liquidationThreshold: 70 },
  { value: 'ARB',  label: 'ARB',  defaultPrice: 0.9,   liquidationThreshold: 70 },
]

const BORROW_TOKENS = [
  { value: 'USDC', label: 'USDC', defaultPrice: 1 },
  { value: 'USDT', label: 'USDT', defaultPrice: 1 },
  { value: 'DAI',  label: 'DAI',  defaultPrice: 1 },
  { value: 'ETH',  label: 'ETH',  defaultPrice: 3000 },
  { value: 'WBTC', label: 'WBTC', defaultPrice: 95000 },
]

const DROP_SCENARIOS = [5, 10, 20, 30, 50]

const HFGauge = ({ value }: { value: number }) => {
  const { label, color } = getHealthFactorLabel(value)
  const display = value === Infinity ? '∞' : value.toFixed(2)
  const pct = Math.min(100, value === Infinity ? 100 : (value / 4) * 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#5a6278]">Health Factor</span>
        <span className="text-xs font-medium" style={{ color }}>
          {display} — {label}
        </span>
      </div>
      <div className="h-3 rounded-full bg-[#1f2330] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[#5a6278]">
        <span>Liquidação (&lt;1.0)</span>
        <span>Seguro (&gt;3.0)</span>
      </div>
    </div>
  )
}

export const LendSimulatorPage = () => {
  const [collateralToken, setCollateralToken] = useState(COLLATERAL_TOKENS[0])
  const [collateralAmount, setCollateralAmount] = useState(10)
  const [collateralPrice, setCollateralPrice] = useState(COLLATERAL_TOKENS[0].defaultPrice)
  const [borrowToken, setBorrowToken] = useState(BORROW_TOKENS[0])
  const [borrowAmount, setBorrowAmount] = useState(10000)
  const [borrowPrice, setBorrowPrice] = useState(BORROW_TOKENS[0].defaultPrice)
  const [supplyApy, setSupplyApy] = useState(3)
  const [borrowApy, setBorrowApy] = useState(5)

  const liqThreshold = collateralToken.liquidationThreshold

  const sim = useMemo(
    () =>
      simulateLend(
        collateralAmount,
        collateralPrice,
        borrowAmount,
        borrowPrice,
        liqThreshold,
        supplyApy,
        borrowApy
      ),
    [collateralAmount, collateralPrice, borrowAmount, borrowPrice, liqThreshold, supplyApy, borrowApy]
  )

  const { label: hfLabel, color: hfColor } = getHealthFactorLabel(sim.healthFactor)

  const scenarios = useMemo(
    () =>
      DROP_SCENARIOS.map((drop) => ({
        drop,
        ...simulatePriceDrop(collateralAmount, collateralPrice, sim.borrowedValue, liqThreshold, drop),
      })),
    [collateralAmount, collateralPrice, sim.borrowedValue, liqThreshold]
  )

  const chartData = useMemo(() => {
    const steps = Array.from({ length: 21 }, (_, i) => i * 5)
    return steps.map((drop) => {
      const { newCollateralValue, newHealthFactor } = simulatePriceDrop(
        collateralAmount,
        collateralPrice,
        sim.borrowedValue,
        liqThreshold,
        drop
      )
      return {
        drop: `-${drop}%`,
        hf: newHealthFactor === Infinity ? 99 : Number(newHealthFactor.toFixed(2)),
        collateralValue: Number(newCollateralValue.toFixed(0)),
      }
    })
  }, [collateralAmount, collateralPrice, sim.borrowedValue, liqThreshold])

  const handleCollateralTokenChange = (val: string) => {
    const token = COLLATERAL_TOKENS.find((t) => t.value === val) ?? COLLATERAL_TOKENS[0]
    setCollateralToken(token)
    setCollateralPrice(token.defaultPrice)
  }

  const handleBorrowTokenChange = (val: string) => {
    const token = BORROW_TOKENS.find((t) => t.value === val) ?? BORROW_TOKENS[0]
    setBorrowToken(token)
    setBorrowPrice(token.defaultPrice)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-[#e8eaf0] flex items-center gap-2">
          <Landmark size={20} className="text-teal-400" />
          Simulador de Empréstimo (Lend)
        </h1>
        <p className="text-sm text-[#5a6278] mt-0.5">
          Simule posições de lending e visualize seu risco de liquidação. Não executa operações reais.
        </p>
      </div>

      <Disclaimer />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Colateral" icon={<Info size={14} />} />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Token colateral</label>
                  <Select
                    value={collateralToken.value}
                    onChange={(e) => handleCollateralTokenChange(e.target.value)}
                    options={COLLATERAL_TOKENS.map((t) => ({ value: t.value, label: t.label }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Quantidade</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#5a6278]">
                  Preço atual {collateralToken.value} (USD)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={collateralPrice}
                  onChange={(e) => setCollateralPrice(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-between text-xs p-2 bg-[#1a1f2e] rounded-lg border border-[#2a3040]">
                <span className="text-[#5a6278]">Valor colateral</span>
                <span className="text-[#e8eaf0] font-semibold">{formatUSD(sim.collateralValue)}</span>
              </div>
              <div className="flex justify-between text-xs p-2 bg-[#1a1f2e] rounded-lg border border-[#2a3040]">
                <span className="text-[#5a6278]">Liquidation Threshold</span>
                <span className="text-[#e8eaf0] font-semibold">{liqThreshold}%</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Empréstimo" icon={<Info size={14} />} />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Token emprestado</label>
                  <Select
                    value={borrowToken.value}
                    onChange={(e) => handleBorrowTokenChange(e.target.value)}
                    options={BORROW_TOKENS.map((t) => ({ value: t.value, label: t.label }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#5a6278]">Quantidade</label>
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#5a6278]">
                  Preço atual {borrowToken.value} (USD)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={borrowPrice}
                  onChange={(e) => setBorrowPrice(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-between text-xs p-2 bg-[#1a1f2e] rounded-lg border border-[#2a3040]">
                <span className="text-[#5a6278]">Valor emprestado</span>
                <span className="text-[#e8eaf0] font-semibold">{formatUSD(sim.borrowedValue)}</span>
              </div>
              <div className="flex justify-between text-xs p-2 bg-[#1a1f2e] rounded-lg border border-[#2a3040]">
                <span className="text-[#5a6278]">LTV atual</span>
                <span className="text-[#e8eaf0] font-semibold">
                  {sim.collateralValue > 0 ? ((sim.borrowedValue / sim.collateralValue) * 100).toFixed(1) : '0'}%
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="APYs (estimativa)" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#5a6278]">APY Supply (%)</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={supplyApy}
                  onChange={(e) => setSupplyApy(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#5a6278]">APY Borrow (%)</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={borrowApy}
                  onChange={(e) => setBorrowApy(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-between text-xs p-2 bg-[#1a1f2e] rounded-lg border border-[#2a3040]">
              <span className="text-[#5a6278]">APY líquido estimado</span>
              <span className={`font-semibold ${sim.netApy >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {sim.netApy.toFixed(2)}%
              </span>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <Card neon>
            <h3 className="text-sm font-semibold text-[#e8eaf0] mb-4">Resultado da Simulação</h3>
            <HFGauge value={sim.healthFactor} />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-[#1a1f2e] rounded-lg p-3 border border-[#2a3040]">
                <div className="text-xs text-[#5a6278]">Health Factor</div>
                <div className="text-xl font-bold mt-1" style={{ color: hfColor }}>
                  {sim.healthFactor === Infinity ? '∞' : sim.healthFactor.toFixed(2)}
                </div>
                <Badge variant={hfLabel === 'Seguro' ? 'success' : hfLabel === 'Moderado' ? 'warning' : 'danger'} size="sm">
                  {hfLabel}
                </Badge>
              </div>
              <div className="bg-[#1a1f2e] rounded-lg p-3 border border-[#2a3040]">
                <div className="text-xs text-[#5a6278]">Preço de Liquidação</div>
                <div className="text-xl font-bold text-red-400 mt-1">
                  {sim.liquidationPrice > 0 ? formatUSD(sim.liquidationPrice) : '—'}
                </div>
                <div className="text-[10px] text-[#5a6278] mt-1">{collateralToken.value} price</div>
              </div>
            </div>

            {sim.healthFactor < 1.2 && sim.healthFactor !== Infinity && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                <AlertTriangle size={13} />
                <span>Posição próxima de liquidação! Adicione mais colateral ou reduza o empréstimo.</span>
              </div>
            )}
          </Card>

          {/* Scenarios table */}
          <Card>
            <CardHeader title="Cenários de queda de preço" description={`Colateral: ${collateralToken.value}`} />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#2a3040]">
                    <th className="text-left py-2 text-[#5a6278]">Queda</th>
                    <th className="text-left py-2 text-[#5a6278]">Novo preço</th>
                    <th className="text-left py-2 text-[#5a6278]">Valor colateral</th>
                    <th className="text-left py-2 text-[#5a6278]">Health Factor</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((s) => {
                    const { label, color } = getHealthFactorLabel(s.newHealthFactor)
                    return (
                      <tr key={s.drop} className="border-b border-[#1e2433]">
                        <td className="py-2 text-amber-400 font-semibold">-{s.drop}%</td>
                        <td className="py-2 text-[#e8eaf0]">{formatUSD(s.newPrice)}</td>
                        <td className="py-2 text-[#8b93a8]">{formatUSD(s.newCollateralValue)}</td>
                        <td className="py-2 font-semibold" style={{ color }}>
                          {s.newHealthFactor === Infinity ? '∞' : s.newHealthFactor.toFixed(2)}{' '}
                          <span className="font-normal text-[#5a6278]">({label})</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader title="Health Factor vs Queda de preço" />
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" />
                  <XAxis
                    dataKey="drop"
                    tick={{ fill: '#5a6278', fontSize: 10 }}
                    interval={3}
                  />
                  <YAxis
                    tick={{ fill: '#5a6278', fontSize: 10 }}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    contentStyle={{ background: '#111318', border: '1px solid #2a3040', borderRadius: 8 }}
                    labelStyle={{ color: '#8b93a8', fontSize: 11 }}
                    itemStyle={{ color: '#10b981', fontSize: 11 }}
                    formatter={(val) => [Number(val) === 99 ? '∞' : Number(val).toFixed(2), 'Health Factor']}
                  />
                  <ReferenceLine y={1} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Liquidação', fill: '#ef4444', fontSize: 10 }} />
                  <ReferenceLine y={1.5} stroke="#f59e0b" strokeDasharray="4 4" />
                  <Line
                    type="monotone"
                    dataKey="hf"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

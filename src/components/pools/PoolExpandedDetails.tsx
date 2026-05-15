import { ExternalLink, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import type { RichPool } from '@/types/defi'
import { formatAPY, formatTVL } from '@/utils/format'
import { getRiskScoreFactors } from '@/utils/riskScore'

interface PoolExpandedDetailsProps {
  pool: RichPool
}

export const PoolExpandedDetails = ({ pool }: PoolExpandedDetailsProps) => {
  const factors = getRiskScoreFactors(pool)
  const isHighApy = pool.apy > 100
  const isRewardHeavy = pool.apyReward != null && pool.apy > 0 && pool.apyReward / pool.apy > 0.8

  return (
    <div className="space-y-4">
      {/* Warnings */}
      {(isHighApy || isRewardHeavy || pool.ilRisk === 'yes') && (
        <div className="flex flex-wrap gap-2">
          {isHighApy && (
            <div className="flex items-center gap-1.5 text-amber-400 text-xs bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5">
              <AlertTriangle size={12} />
              APY extremo — risco elevado ou token de recompensa instável
            </div>
          )}
          {isRewardHeavy && (
            <div className="flex items-center gap-1.5 text-orange-400 text-xs bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1.5">
              <AlertTriangle size={12} />
              Rendimento fortemente dependente de token de recompensa
            </div>
          )}
          {pool.ilRisk === 'yes' && (
            <div className="flex items-center gap-1.5 text-yellow-400 text-xs bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
              <AlertTriangle size={12} />
              Risco de Impermanent Loss presente
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <div className="text-[#5a6278] mb-1">APY Base</div>
          <div className="text-[#e8eaf0] font-semibold">{formatAPY(pool.apyBase)}</div>
        </div>
        <div>
          <div className="text-[#5a6278] mb-1">APY Reward</div>
          <div className="text-[#e8eaf0] font-semibold">{formatAPY(pool.apyReward)}</div>
        </div>
        <div>
          <div className="text-[#5a6278] mb-1">IL Risk</div>
          <div className={pool.ilRisk === 'yes' ? 'text-amber-400' : 'text-emerald-400'}>
            {pool.ilRisk === 'yes' ? '⚠ Sim' : pool.ilRisk === 'no' || pool.ilRisk === 'none' ? '✓ Não' : '—'}
          </div>
        </div>
        <div>
          <div className="text-[#5a6278] mb-1">Exposure</div>
          <div className="text-[#e8eaf0] capitalize">{pool.exposure ?? '—'}</div>
        </div>
        {pool.volumeUsd1d != null && pool.volumeUsd1d > 0 && (
          <div>
            <div className="text-[#5a6278] mb-1">Volume 24h</div>
            <div className="text-[#e8eaf0]">{formatTVL(pool.volumeUsd1d)}</div>
          </div>
        )}
        {pool.apyMean30d != null && (
          <div>
            <div className="text-[#5a6278] mb-1">APY Médio 30d</div>
            <div className="text-[#e8eaf0]">{formatAPY(pool.apyMean30d)}</div>
          </div>
        )}
        {pool.apyPct7D != null && (
          <div>
            <div className="text-[#5a6278] mb-1">Var. 7d</div>
            <div className={`flex items-center gap-1 ${pool.apyPct7D >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {pool.apyPct7D >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {pool.apyPct7D >= 0 ? '+' : ''}{pool.apyPct7D.toFixed(1)}%
            </div>
          </div>
        )}
        {pool.count != null && (
          <div>
            <div className="text-[#5a6278] mb-1">Amostras (30d)</div>
            <div className="text-[#e8eaf0]">{pool.count}</div>
          </div>
        )}
      </div>

      {/* Risk score breakdown */}
      <div>
        <div className="text-[10px] text-[#5a6278] uppercase tracking-wide mb-2">Fatores do score de risco ({pool.riskScore}/100)</div>
        <div className="flex flex-wrap gap-1.5">
          {factors.map((f) => (
            <span
              key={f.label}
              className={`text-[10px] px-2 py-0.5 rounded border ${
                f.points > 0
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              {f.points > 0 ? '+' : ''}{f.points} {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* Tokens */}
      {pool.underlyingTokens && pool.underlyingTokens.length > 0 && (
        <div>
          <div className="text-[10px] text-[#5a6278] uppercase tracking-wide mb-1">Tokens subjacentes</div>
          <div className="flex flex-wrap gap-1">
            {pool.underlyingTokens.map((t) => (
              <span key={t} className="text-[10px] font-mono bg-[#1e2433] text-[#8b93a8] px-2 py-0.5 rounded border border-[#2a3040]">
                {t.slice(0, 20)}{t.length > 20 ? '…' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Link */}
      {pool.url && (
        <a
          href={pool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={12} />
          Ver no protocolo
        </a>
      )}
    </div>
  )
}

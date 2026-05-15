import type { Pool, RichPool, RiskLabel, PoolType } from '@/types/defi'
import { isTrustedProtocol } from '@/config/protocols'
import { classifyPoolType } from '@/utils/poolClassifiers'

export const calculateRiskScore = (pool: Pool): number => {
  let score = 50

  if (pool.tvlUsd >= 100_000_000) score += 25
  else if (pool.tvlUsd >= 10_000_000) score += 15
  else if (pool.tvlUsd >= 1_000_000) score += 8
  else if (pool.tvlUsd < 100_000) score -= 15

  if (pool.stablecoin) score += 10

  const apy = pool.apy ?? 0
  if (apy >= 1 && apy <= 20) score += 20
  else if (apy > 20 && apy <= 60) score += 10
  else if (apy > 60 && apy <= 100) score += 0
  else if (apy > 100 && apy <= 500) score -= 20
  else if (apy > 500 && apy <= 1000) score -= 30
  else if (apy > 1000) score -= 40

  if (pool.ilRisk === 'no' || pool.ilRisk === 'none') score += 15
  else if (pool.ilRisk === 'yes') score -= 15

  if (pool.exposure === 'single') score += 10
  else if (pool.exposure === 'multi') score -= 5

  if (isTrustedProtocol(pool.project)) score += 10

  const rewardShare = pool.apyReward != null && apy > 0 ? pool.apyReward / apy : 0
  if (rewardShare > 0.8 && apy > 20) score -= 10

  return Math.max(0, Math.min(100, score))
}

export const getRiskLabel = (score: number): RiskLabel => {
  if (score >= 80) return 'Baixo'
  if (score >= 60) return 'Moderado'
  if (score >= 40) return 'Alto'
  return 'Crítico'
}

export const getRiskColor = (label: RiskLabel): string => {
  switch (label) {
    case 'Baixo': return '#10b981'
    case 'Moderado': return '#f59e0b'
    case 'Alto': return '#f97316'
    case 'Crítico': return '#ef4444'
  }
}

export const getRiskScoreFactors = (pool: Pool): { label: string; points: number }[] => {
  const factors: { label: string; points: number }[] = []
  const apy = pool.apy ?? 0

  if (pool.tvlUsd >= 100_000_000) factors.push({ label: 'TVL > $100M', points: 25 })
  else if (pool.tvlUsd >= 10_000_000) factors.push({ label: 'TVL > $10M', points: 15 })
  else if (pool.tvlUsd >= 1_000_000) factors.push({ label: 'TVL > $1M', points: 8 })
  else if (pool.tvlUsd < 100_000) factors.push({ label: 'TVL < $100K', points: -15 })

  if (pool.stablecoin) factors.push({ label: 'Stablecoin', points: 10 })

  if (apy >= 1 && apy <= 20) factors.push({ label: 'APY conservador', points: 20 })
  else if (apy > 20 && apy <= 60) factors.push({ label: 'APY moderado', points: 10 })
  else if (apy > 100 && apy <= 500) factors.push({ label: 'APY extremo', points: -20 })
  else if (apy > 500 && apy <= 1000) factors.push({ label: 'APY muito extremo', points: -30 })
  else if (apy > 1000) factors.push({ label: 'APY suspeito', points: -40 })

  if (pool.ilRisk === 'no' || pool.ilRisk === 'none') factors.push({ label: 'Sem IL risk', points: 15 })
  else if (pool.ilRisk === 'yes') factors.push({ label: 'IL risk presente', points: -15 })

  if (pool.exposure === 'single') factors.push({ label: 'Exposição single', points: 10 })
  else if (pool.exposure === 'multi') factors.push({ label: 'Exposição multi', points: -5 })

  if (isTrustedProtocol(pool.project)) factors.push({ label: 'Protocolo verificado', points: 10 })

  const rewardShare = pool.apyReward != null && apy > 0 ? pool.apyReward / apy : 0
  if (rewardShare > 0.8 && apy > 20) factors.push({ label: 'APY reward-heavy', points: -10 })

  return factors
}

export const inferPoolType = (pool: Pool): PoolType => classifyPoolType(pool)

export const enrichPool = (pool: Pool): RichPool => {
  const riskScore = calculateRiskScore(pool)
  return {
    ...pool,
    riskScore,
    riskLabel: getRiskLabel(riskScore),
    poolType: classifyPoolType(pool),
    isTrustedProtocol: isTrustedProtocol(pool.project),
  }
}

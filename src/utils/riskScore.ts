import type { Pool, RichPool, RiskLabel, PoolType } from '@/types/defi'
import { isTrustedProtocol } from '@/config/protocols'

export const calculateRiskScore = (pool: Pool): number => {
  let score = 50

  // TVL scoring
  if (pool.tvlUsd >= 100_000_000) score += 25
  else if (pool.tvlUsd >= 10_000_000) score += 15
  else if (pool.tvlUsd >= 1_000_000) score += 8
  else if (pool.tvlUsd < 100_000) score -= 15

  // Stablecoin
  if (pool.stablecoin) score += 10

  // APY scoring
  const apy = pool.apy ?? 0
  if (apy >= 1 && apy <= 20) score += 20
  else if (apy > 20 && apy <= 60) score += 10
  else if (apy > 60 && apy <= 100) score += 0
  else if (apy > 100 && apy <= 500) score -= 20
  else if (apy > 500) score -= 35

  // IL risk
  if (pool.ilRisk === 'no' || pool.ilRisk === 'none') score += 15
  else if (pool.ilRisk === 'yes') score -= 15

  // Exposure
  if (pool.exposure === 'single') score += 10
  else if (pool.exposure === 'multi') score -= 5

  // Trusted protocol
  if (isTrustedProtocol(pool.project)) score += 10

  // Reward-heavy pools can be riskier
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

export const inferPoolType = (pool: Pool): PoolType => {
  const sym = pool.symbol?.toLowerCase() ?? ''
  const proj = pool.project?.toLowerCase() ?? ''
  const meta = pool.poolMeta?.toLowerCase() ?? ''

  if (
    proj.includes('aave') ||
    proj.includes('compound') ||
    proj.includes('morpho') ||
    proj.includes('venus') ||
    proj.includes('radiant') ||
    meta.includes('lend') ||
    sym.includes('lend')
  ) return 'lending'

  if (
    proj.includes('lido') ||
    proj.includes('rocket') ||
    proj.includes('frax') ||
    proj.includes('stakefish') ||
    proj.includes('marinade') ||
    proj.includes('jito') ||
    proj.includes('sanctum') ||
    meta.includes('stake') ||
    sym.startsWith('st') ||
    sym.includes('lst')
  ) return 'staking'

  if (
    proj.includes('uniswap') ||
    proj.includes('curve') ||
    proj.includes('balancer') ||
    proj.includes('pancake') ||
    proj.includes('sushi') ||
    proj.includes('raydium') ||
    proj.includes('orca') ||
    meta.includes('lp') ||
    sym.includes('-')
  ) return 'liquidity'

  if (
    proj.includes('yearn') ||
    proj.includes('beefy') ||
    proj.includes('convex') ||
    meta.includes('vault')
  ) return 'vault'

  if (
    proj.includes('farm') ||
    meta.includes('farm') ||
    (pool.apyReward != null && pool.apyReward > 0 && pool.apyBase === 0)
  ) return 'farm'

  return 'other'
}

export const enrichPool = (pool: Pool): RichPool => {
  const riskScore = calculateRiskScore(pool)
  return {
    ...pool,
    riskScore,
    riskLabel: getRiskLabel(riskScore),
    poolType: inferPoolType(pool),
    isTrustedProtocol: isTrustedProtocol(pool.project),
  }
}

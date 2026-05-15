import { useMemo } from 'react'
import type { RichPool } from '@/types/defi'

export interface PoolRankings {
  bestStable: RichPool | null
  bestSingle: RichPool | null
  bestRwa: RichPool | null
  bestLp: RichPool | null
}

export const usePoolRankings = (pools: RichPool[] | undefined): PoolRankings => {
  return useMemo(() => {
    if (!pools?.length) return { bestStable: null, bestSingle: null, bestRwa: null, bestLp: null }

    const eligible = pools.filter((p) => p.tvlUsd >= 500_000 && p.apy > 0)

    const bestStable =
      eligible
        .filter((p) => p.stablecoin && p.apy < 50 && p.riskScore >= 50)
        .sort((a, b) => b.riskScore - a.riskScore || b.apy - a.apy)[0] ?? null

    const bestSingle =
      eligible
        .filter((p) => p.exposure === 'single' && !p.stablecoin && p.apy < 100 && p.riskScore >= 40)
        .sort((a, b) => b.riskScore - a.riskScore || b.apy - a.apy)[0] ?? null

    const bestRwa =
      eligible
        .filter((p) => p.poolType === 'RWA')
        .sort((a, b) => b.tvlUsd - a.tvlUsd)[0] ?? null

    const bestLp =
      eligible
        .filter((p) => (p.poolType === 'LP' || p.poolType === 'Stable') && p.apy < 300)
        .sort((a, b) => b.apy - a.apy)[0] ?? null

    return { bestStable, bestSingle, bestRwa, bestLp }
  }, [pools])
}

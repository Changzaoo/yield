import { useMemo } from 'react'
import type { RichPool, PoolFilters } from '@/types/defi'

export const useFilteredPools = (pools: RichPool[] | undefined, filters: PoolFilters) => {
  return useMemo(() => {
    if (!pools) return { filtered: [], total: 0, tvlTotal: 0, apyAvg: 0, apyMax: 0, chains: 0, protocols: 0 }

    let result = [...pools]

    // Exclude extreme APY unless opted in
    if (!filters.includeExtremeApy) {
      result = result.filter((p) => p.apy <= 1000)
    }

    // Exclude IL risk pools
    if (filters.excludeIlRisk) {
      result = result.filter((p) => p.ilRisk !== 'yes')
    }

    // Single exposure only
    if (filters.singleExposureOnly) {
      result = result.filter((p) => p.exposure === 'single')
    }

    // Text search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.symbol?.toLowerCase().includes(q) ||
          p.project?.toLowerCase().includes(q) ||
          p.chain?.toLowerCase().includes(q) ||
          p.pool?.toLowerCase().includes(q)
      )
    }

    // Chain filter
    if (filters.chain && filters.chain !== 'all') {
      result = result.filter((p) => p.chain?.toLowerCase() === filters.chain.toLowerCase())
    }

    // Project filter
    if (filters.project && filters.project !== 'all') {
      result = result.filter((p) => p.project?.toLowerCase() === filters.project.toLowerCase())
    }

    // Stablecoin filter
    if (filters.stablecoinOnly) {
      result = result.filter((p) => p.stablecoin)
    }

    // Min TVL
    if (filters.minTvl > 0) {
      result = result.filter((p) => p.tvlUsd >= filters.minTvl)
    }

    // APY range
    if (filters.minApy > 0) {
      result = result.filter((p) => p.apy >= filters.minApy)
    }
    if (filters.maxApy > 0) {
      result = result.filter((p) => p.apy <= filters.maxApy)
    }

    // Pool type / meta-filter
    if (filters.poolType && filters.poolType !== 'all') {
      switch (filters.poolType) {
        case 'Stablecoin':
          result = result.filter((p) => p.stablecoin)
          break
        case 'Single':
          result = result.filter((p) => p.exposure === 'single')
          break
        case 'HighAPY':
          result = result.filter((p) => p.apy > 100)
          break
        case 'LowRisk':
          result = result.filter((p) => p.riskScore >= 70)
          break
        default:
          result = result.filter((p) => p.poolType === filters.poolType)
      }
    }

    // Safe only: "Baixo" risk label threshold
    if (filters.safeOnly) {
      result = result.filter((p) => p.riskScore >= 75)
    }

    // Sort
    result.sort((a, b) => {
      let av = 0, bv = 0
      switch (filters.sortBy) {
        case 'apy': av = a.apy; bv = b.apy; break
        case 'tvlUsd': av = a.tvlUsd; bv = b.tvlUsd; break
        case 'riskScore': av = a.riskScore; bv = b.riskScore; break
        case 'apyBase': av = a.apyBase ?? 0; bv = b.apyBase ?? 0; break
        case 'apyReward': av = a.apyReward ?? 0; bv = b.apyReward ?? 0; break
        case 'volumeUsd1d': av = a.volumeUsd1d ?? 0; bv = b.volumeUsd1d ?? 0; break
        case 'chain': return filters.sortDir === 'asc'
          ? (a.chain ?? '').localeCompare(b.chain ?? '')
          : (b.chain ?? '').localeCompare(a.chain ?? '')
        case 'project': return filters.sortDir === 'asc'
          ? (a.project ?? '').localeCompare(b.project ?? '')
          : (b.project ?? '').localeCompare(a.project ?? '')
      }
      return filters.sortDir === 'asc' ? av - bv : bv - av
    })

    const tvlTotal = result.reduce((s, p) => s + p.tvlUsd, 0)
    const apyValues = result.map((p) => p.apy).filter((v) => v > 0)
    const apyAvg = apyValues.length ? apyValues.reduce((s, v) => s + v, 0) / apyValues.length : 0
    const apyMax = apyValues.length ? Math.max(...apyValues) : 0
    const chains = new Set(result.map((p) => p.chain)).size
    const protocols = new Set(result.map((p) => p.project)).size

    return { filtered: result, total: result.length, tvlTotal, apyAvg, apyMax, chains, protocols }
  }, [pools, filters])
}

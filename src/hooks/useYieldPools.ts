import { useQuery } from '@tanstack/react-query'
import { fetchPools } from '@/services/defillama'
import { enrichPool } from '@/utils/riskScore'
import { isCEX } from '@/config/protocols'
import type { RichPool } from '@/types/defi'

export const useYieldPools = () => {
  return useQuery<RichPool[]>({
    queryKey: ['yield-pools'],
    queryFn: async () => {
      const pools = await fetchPools()
      return pools
        .filter((p) => !isCEX(p.project))
        .map(enrichPool)
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  })
}

export const useCexPools = () => {
  return useQuery<RichPool[]>({
    queryKey: ['cex-pools'],
    queryFn: async () => {
      const pools = await fetchPools()
      return pools
        .filter((p) => isCEX(p.project))
        .map(enrichPool)
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  })
}

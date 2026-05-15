export interface Pool {
  pool: string
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apy: number
  apyBase: number | null
  apyReward: number | null
  stablecoin: boolean
  ilRisk: 'yes' | 'no' | 'none' | null
  exposure: 'single' | 'multi' | null
  underlyingTokens: string[] | null
  rewardTokens: string[] | null
  poolMeta: string | null
  url: string | null
  predictions?: {
    predictedClass: string | null
    predictedProbability: number | null
    binnedConfidence: number | null
  }
  apyPct1D?: number | null
  apyPct7D?: number | null
  apyPct30D?: number | null
  volumeUsd1d?: number | null
  volumeUsd7d?: number | null
  apyBase7d?: number | null
  apyMean30d?: number | null
  count?: number
  outlier?: boolean
}

export interface RichPool extends Pool {
  riskScore: number
  riskLabel: RiskLabel
  poolType: PoolType
  isTrustedProtocol: boolean
}

export type RiskLabel = 'Baixo' | 'Moderado' | 'Alto' | 'Crítico'
export type PoolType = 'lending' | 'staking' | 'liquidity' | 'vault' | 'farm' | 'other'

export interface Protocol {
  id: string
  name: string
  address: string | null
  symbol: string
  url: string
  description: string
  chain: string
  logo: string | null
  audits: string | null
  audit_note: string | null
  gecko_id: string | null
  cmcId: string | null
  category: string
  chains: string[]
  module: string
  twitter: string | null
  forkedFrom: string[]
  oracles: string[]
  listedAt: number
  methodology: string
  slug: string
  tvl: number
  chainTvls: Record<string, number>
  change_1h: number | null
  change_1d: number | null
  change_7d: number | null
  tokenBreakdowns: Record<string, unknown>
  mcap: number | null
}

export interface PoolFilters {
  search: string
  chain: string
  project: string
  stablecoinOnly: boolean
  minTvl: number
  minApy: number
  maxApy: number
  poolType: string
  safeOnly: boolean
  sortBy: SortField
  sortDir: 'asc' | 'desc'
}

export type SortField = 'apy' | 'tvlUsd' | 'chain' | 'project' | 'riskScore' | 'apyBase' | 'apyReward'

export interface TokenPrice {
  decimals: number
  symbol: string
  price: number
  timestamp: number
  confidence: number
}

export interface PriceResponse {
  coins: Record<string, TokenPrice>
}

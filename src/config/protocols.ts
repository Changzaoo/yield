export const TRUSTED_PROTOCOLS = new Set([
  'aave-v3',
  'aave-v2',
  'compound-v3',
  'compound-v2',
  'uniswap-v3',
  'uniswap-v2',
  'curve',
  'convex-finance',
  'lido',
  'makerdao',
  'spark',
  'morpho',
  'balancer-v2',
  'pancakeswap-v3',
  'sushiswap',
  'stargate',
  'radiant-v2',
  'gmx',
  'venus',
  'benqi',
  'traderjoe',
  'pendle',
  'eigenlayer',
  'renzo',
  'ether.fi',
  'kelp-dao',
  'marinade',
  'kamino',
  'solend',
  'drift',
  'jito',
  'sanctum',
  'jupiter',
  'raydium',
  'orca',
])

export const CEX_KEYWORDS = [
  'binance',
  'coinbase',
  'kraken',
  'bybit',
  'okx',
  'kucoin',
  'huobi',
  'gate.io',
  'bitget',
  'mexc',
  'bitfinex',
  'bithumb',
  'upbit',
]

export const isCEX = (project: string): boolean => {
  const lower = project.toLowerCase()
  return CEX_KEYWORDS.some((k) => lower.includes(k))
}

export const isTrustedProtocol = (project: string): boolean => {
  return TRUSTED_PROTOCOLS.has(project.toLowerCase())
}

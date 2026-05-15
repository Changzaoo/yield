import type { PriceResponse, TokenPrice } from '@/types/defi'

const COINS_BASE = 'https://coins.llama.fi'

// Map human-readable symbol to chain:address format for DefiLlama Coins API
const WELL_KNOWN_TOKENS: Record<string, string> = {
  ETH: 'coingecko:ethereum',
  BTC: 'coingecko:bitcoin',
  SOL: 'coingecko:solana',
  USDC: 'coingecko:usd-coin',
  USDT: 'coingecko:tether',
  WBTC: 'coingecko:wrapped-bitcoin',
  BNB: 'coingecko:binancecoin',
  MATIC: 'coingecko:matic-network',
  AVAX: 'coingecko:avalanche-2',
  ARB: 'coingecko:arbitrum',
  OP: 'coingecko:optimism',
  LINK: 'coingecko:chainlink',
  UNI: 'coingecko:uniswap',
  AAVE: 'coingecko:aave',
  CRV: 'coingecko:curve-dao-token',
  MKR: 'coingecko:maker',
  LDO: 'coingecko:lido-dao',
  cbBTC: 'coingecko:coinbase-wrapped-btc',
  tBTC: 'coingecko:tbtc',
}

export const resolveTokenId = (symbol: string): string => {
  return WELL_KNOWN_TOKENS[symbol.toUpperCase()] ?? `coingecko:${symbol.toLowerCase()}`
}

export const fetchPrices = async (symbols: string[]): Promise<Record<string, TokenPrice>> => {
  const ids = symbols.map(resolveTokenId)
  const query = ids.join(',')
  const res = await fetch(`${COINS_BASE}/prices/current/${query}`)
  if (!res.ok) throw new Error(`Price API error: ${res.status}`)
  const json = await res.json() as PriceResponse
  // Re-key by symbol for easier access
  const result: Record<string, TokenPrice> = {}
  symbols.forEach((sym, i) => {
    const id = ids[i]
    if (json.coins[id]) {
      result[sym.toUpperCase()] = json.coins[id]
    }
  })
  return result
}

export const fetchPrice = async (symbol: string): Promise<number | null> => {
  try {
    const prices = await fetchPrices([symbol])
    return prices[symbol.toUpperCase()]?.price ?? null
  } catch {
    return null
  }
}

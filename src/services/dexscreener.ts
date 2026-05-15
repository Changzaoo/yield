const BASE = 'https://api.dexscreener.com'

export interface TokenBoost {
  url: string
  chainId: string
  tokenAddress: string
  icon?: string
  header?: string
  description?: string
  links?: { type: string; label: string; url: string }[]
  amount: number
}

export interface DexPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: { address: string; name: string; symbol: string }
  quoteToken: { address: string; name: string; symbol: string }
  priceUsd?: string
  priceNative: string
  volume: { h24: number; h6: number; h1: number; m5: number }
  priceChange: { m5: number; h1: number; h6: number; h24: number }
  liquidity?: { usd?: number; base: number; quote: number }
  fdv?: number
  marketCap?: number
  pairCreatedAt?: number
  txns?: {
    h24?: { buys: number; sells: number }
    h1?: { buys: number; sells: number }
  }
  info?: {
    imageUrl?: string
    websites?: { url: string }[]
    socials?: { platform: string; handle: string }[]
  }
  boosts?: { active: number }
}

export interface MemeToken extends TokenBoost {
  pair?: DexPair
}

export const fetchTopBoosted = async (): Promise<TokenBoost[]> => {
  const res = await fetch(`${BASE}/token-boosts/top/v1`)
  if (!res.ok) throw new Error('Erro ao buscar memecoins trending')
  return res.json() as Promise<TokenBoost[]>
}

export const fetchLatestProfiles = async (): Promise<TokenBoost[]> => {
  const res = await fetch(`${BASE}/token-profiles/latest/v1`)
  if (!res.ok) throw new Error('Erro ao buscar novos tokens')
  return res.json() as Promise<TokenBoost[]>
}

export const fetchPairsByTokens = async (
  chainId: string,
  addresses: string[]
): Promise<DexPair[]> => {
  if (!addresses.length) return []
  const joined = addresses.slice(0, 30).join(',')
  const res = await fetch(`${BASE}/tokens/v1/${chainId}/${joined}`)
  if (!res.ok) return []
  const data = await res.json() as DexPair[]
  return Array.isArray(data) ? data : []
}

const MEME_KEYWORDS = [
  'doge', 'pepe', 'shib', 'floki', 'meme', 'inu', 'cat', 'frog', 'wojak',
  'bonk', 'wif', 'popcat', 'brett', 'bobo', 'mog', 'act', 'neiro',
  'turbo', 'bome', 'slerf', 'saga', 'myro', 'smolana', 'dog', 'pnut',
  'goat', 'ai16z', 'zerebro', 'chillguy', 'boden', 'spx', 'sigma',
  'retard', 'chad', 'based', 'ponke', 'gigachad',
]

export const isMemeToken = (token: TokenBoost): boolean => {
  const name = (token.description ?? '').toLowerCase()
  const addr = token.tokenAddress.toLowerCase()
  return MEME_KEYWORDS.some((k) => name.includes(k) || addr.includes(k)) || token.amount > 0
}

export const enrichWithPairs = async (tokens: TokenBoost[]): Promise<MemeToken[]> => {
  const byChain: Record<string, TokenBoost[]> = {}
  for (const t of tokens) {
    if (!byChain[t.chainId]) byChain[t.chainId] = []
    byChain[t.chainId].push(t)
  }

  const allPairs: Record<string, DexPair> = {}

  await Promise.allSettled(
    Object.entries(byChain).map(async ([chain, chainTokens]) => {
      const addresses = chainTokens.map((t) => t.tokenAddress)
      const pairs = await fetchPairsByTokens(chain, addresses)
      for (const pair of pairs) {
        const addr = pair.baseToken.address.toLowerCase()
        const existing = allPairs[addr]
        if (!existing || (pair.liquidity?.usd ?? 0) > (existing.liquidity?.usd ?? 0)) {
          allPairs[addr] = pair
        }
      }
    })
  )

  return tokens.map((token) => ({
    ...token,
    pair: allPairs[token.tokenAddress.toLowerCase()],
  }))
}

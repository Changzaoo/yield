// Jupiter integration service
// Full integration requires @jup-ag/terminal or @jup-ag/react-hook

const JUPITER_PRICE_API = 'https://price.jup.ag/v6/price'

export interface JupiterPriceResult {
  id: string
  mintSymbol: string
  vsToken: string
  vsTokenSymbol: string
  price: number
}

export const fetchJupiterPrice = async (tokenMint: string): Promise<number | null> => {
  try {
    const res = await fetch(`${JUPITER_PRICE_API}?ids=${tokenMint}`)
    if (!res.ok) return null
    const json = await res.json() as { data: Record<string, JupiterPriceResult> }
    return json.data[tokenMint]?.price ?? null
  } catch {
    return null
  }
}

export const buildJupiterSwapUrl = (
  inputMint: string,
  outputMint: string,
  amount?: number
): string => {
  const params = new URLSearchParams({ inputMint, outputMint })
  if (amount) params.set('amount', String(amount))
  return `https://jup.ag/swap/${inputMint}-${outputMint}?${params.toString()}`
}

// Known SOL LST mints for Sanctum/Jupiter staking
export const SOL_LST_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  mSOL: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
  stSOL: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj',
  jitoSOL: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
  bSOL: 'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
  INF: '5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm',
}

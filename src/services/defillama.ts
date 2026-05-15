import type { Pool, Protocol } from '@/types/defi'

const YIELDS_BASE = 'https://yields.llama.fi'
const API_BASE = 'https://api.llama.fi'

export const fetchPools = async (): Promise<Pool[]> => {
  const res = await fetch(`${YIELDS_BASE}/pools`)
  if (!res.ok) throw new Error(`DefiLlama yields API error: ${res.status}`)
  const json = await res.json() as { status: string; data: Pool[] }
  if (json.status !== 'success') throw new Error('DefiLlama returned non-success status')
  return json.data
}

export const fetchPoolDetails = async (poolId: string): Promise<Pool> => {
  const res = await fetch(`${YIELDS_BASE}/chart/${poolId}`)
  if (!res.ok) throw new Error(`Pool details error: ${res.status}`)
  const json = await res.json() as { status: string; data: Pool }
  return json.data
}

export const fetchProtocols = async (): Promise<Protocol[]> => {
  const res = await fetch(`${API_BASE}/protocols`)
  if (!res.ok) throw new Error(`Protocols API error: ${res.status}`)
  const json = await res.json() as Protocol[]
  return json
}

export const fetchUsdBrlRate = async (): Promise<number> => {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=BRL')
    if (!res.ok) return 5.0
    const json = await res.json() as { rates: { BRL: number } }
    return json.rates.BRL ?? 5.0
  } catch {
    return 5.0
  }
}

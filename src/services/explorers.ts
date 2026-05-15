import type { SupportedChain } from '@/types/wallet'

export const EXPLORER_MAP: Record<SupportedChain, string> = {
  ethereum: 'https://etherscan.io',
  base: 'https://basescan.org',
  arbitrum: 'https://arbiscan.io',
  bsc: 'https://bscscan.com',
  polygon: 'https://polygonscan.com',
  solana: 'https://solscan.io',
}

export const getTxUrl = (chain: SupportedChain, hash: string): string => {
  const base = EXPLORER_MAP[chain]
  if (chain === 'solana') return `${base}/tx/${hash}`
  return `${base}/tx/${hash}`
}

export const getAddressUrl = (chain: SupportedChain, address: string): string => {
  const base = EXPLORER_MAP[chain]
  if (chain === 'solana') return `${base}/account/${address}`
  return `${base}/address/${address}`
}

export type SupportedChain = 'ethereum' | 'solana' | 'base' | 'arbitrum' | 'bsc' | 'polygon'

export interface WalletToken {
  symbol: string
  name: string
  balance: number
  balanceUsd: number
  price: number
  contractAddress: string | null
  logo: string | null
  decimals: number
}

export interface WalletTransaction {
  hash: string
  from: string
  to: string
  value: string
  valueUsd: number | null
  timestamp: number
  blockNumber: number
  symbol: string | null
  type: 'send' | 'receive' | 'swap' | 'unknown'
}

export interface WalletAnalysis {
  address: string
  chain: SupportedChain
  totalBalanceUsd: number
  tokens: WalletToken[]
  transactions: WalletTransaction[]
  stablecoinBalance: number
  nativeBalance: number
  isDemo: boolean
  fetchedAt: number
}

export interface ConnectedWallet {
  address: string
  chain: SupportedChain
  provider: 'phantom' | 'solflare' | 'backpack' | 'metamask' | 'walletconnect' | null
}

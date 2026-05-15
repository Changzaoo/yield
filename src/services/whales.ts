import type { WalletAnalysis, SupportedChain } from '@/types/wallet'
import { env } from '@/config/env'
import { getAddressUrl } from './explorers'

// Demo data for when no API keys are configured
const DEMO_ANALYSIS = (address: string, chain: SupportedChain): WalletAnalysis => ({
  address,
  chain,
  totalBalanceUsd: 4_230_000,
  tokens: [
    { symbol: 'ETH', name: 'Ethereum', balance: 800, balanceUsd: 2_400_000, price: 3000, contractAddress: null, logo: null, decimals: 18 },
    { symbol: 'USDC', name: 'USD Coin', balance: 1_000_000, balanceUsd: 1_000_000, price: 1, contractAddress: '0xa0b8...', logo: null, decimals: 6 },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: 5, balanceUsd: 450_000, price: 90000, contractAddress: '0x2260...', logo: null, decimals: 8 },
    { symbol: 'LINK', name: 'Chainlink', balance: 10000, balanceUsd: 150_000, price: 15, contractAddress: '0x514910...', logo: null, decimals: 18 },
    { symbol: 'ARB', name: 'Arbitrum', balance: 230000, balanceUsd: 230_000, price: 1, contractAddress: '0x912c...', logo: null, decimals: 18 },
  ],
  transactions: [
    { hash: '0xabc123...', from: address, to: '0xDEF456...', value: '100000000000000000000', valueUsd: 300_000, timestamp: Math.floor(Date.now() / 1000) - 3600, blockNumber: 19_000_000, symbol: 'ETH', type: 'send' },
    { hash: '0xdef456...', from: '0xABC123...', to: address, value: '500000000', valueUsd: 500_000, timestamp: Math.floor(Date.now() / 1000) - 7200, blockNumber: 18_999_000, symbol: 'USDC', type: 'receive' },
    { hash: '0x789abc...', from: address, to: '0x789DEF...', value: '50000000000000000000', valueUsd: 150_000, timestamp: Math.floor(Date.now() / 1000) - 86400, blockNumber: 18_990_000, symbol: 'ETH', type: 'send' },
  ],
  stablecoinBalance: 1_000_000,
  nativeBalance: 2_400_000,
  isDemo: true,
  fetchedAt: Date.now(),
})

export const analyzeWallet = async (
  address: string,
  chain: SupportedChain
): Promise<WalletAnalysis> => {
  // Etherscan-compatible chains
  if (['ethereum', 'base', 'arbitrum', 'bsc', 'polygon'].includes(chain)) {
    if (!env.etherscanApiKey && !env.alchemyApiKey) {
      return DEMO_ANALYSIS(address, chain)
    }
    // Would integrate with Etherscan/Alchemy here when keys are provided
    return DEMO_ANALYSIS(address, chain)
  }

  // Solana
  if (chain === 'solana') {
    if (!env.heliusApiKey) {
      return DEMO_ANALYSIS(address, chain)
    }
    // Would integrate with Helius here
    return DEMO_ANALYSIS(address, chain)
  }

  return DEMO_ANALYSIS(address, chain)
}

export { getAddressUrl }

export interface ChainConfig {
  id: string
  label: string
  color: string
  explorerUrl: string
  explorerName: string
  rpcUrl?: string
  nativeToken: string
  logo: string
}

export const CHAINS: Record<string, ChainConfig> = {
  Ethereum: {
    id: 'ethereum',
    label: 'Ethereum',
    color: '#627EEA',
    explorerUrl: 'https://etherscan.io',
    explorerName: 'Etherscan',
    nativeToken: 'ETH',
    logo: '⟠',
  },
  BSC: {
    id: 'bsc',
    label: 'BNB Chain',
    color: '#F3BA2F',
    explorerUrl: 'https://bscscan.com',
    explorerName: 'BscScan',
    nativeToken: 'BNB',
    logo: '⬡',
  },
  Polygon: {
    id: 'polygon',
    label: 'Polygon',
    color: '#8247E5',
    explorerUrl: 'https://polygonscan.com',
    explorerName: 'PolygonScan',
    nativeToken: 'MATIC',
    logo: '⬡',
  },
  Arbitrum: {
    id: 'arbitrum',
    label: 'Arbitrum',
    color: '#28A0F0',
    explorerUrl: 'https://arbiscan.io',
    explorerName: 'Arbiscan',
    nativeToken: 'ETH',
    logo: '○',
  },
  Optimism: {
    id: 'optimism',
    label: 'Optimism',
    color: '#FF0420',
    explorerUrl: 'https://optimistic.etherscan.io',
    explorerName: 'Optimistic Etherscan',
    nativeToken: 'ETH',
    logo: '○',
  },
  Base: {
    id: 'base',
    label: 'Base',
    color: '#0052FF',
    explorerUrl: 'https://basescan.org',
    explorerName: 'BaseScan',
    nativeToken: 'ETH',
    logo: '○',
  },
  Solana: {
    id: 'solana',
    label: 'Solana',
    color: '#9945FF',
    explorerUrl: 'https://solscan.io',
    explorerName: 'Solscan',
    nativeToken: 'SOL',
    logo: '◎',
  },
  Avalanche: {
    id: 'avalanche',
    label: 'Avalanche',
    color: '#E84142',
    explorerUrl: 'https://snowtrace.io',
    explorerName: 'Snowtrace',
    nativeToken: 'AVAX',
    logo: '▲',
  },
  Fantom: {
    id: 'fantom',
    label: 'Fantom',
    color: '#1969FF',
    explorerUrl: 'https://ftmscan.com',
    explorerName: 'FtmScan',
    nativeToken: 'FTM',
    logo: '◊',
  },
}

export const CHAIN_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(CHAINS).map(([key, val]) => [key, val.color])
)

export const getChainConfig = (chain: string): ChainConfig | null => {
  return CHAINS[chain] ?? null
}

export const getExplorerUrl = (chain: string, txHash: string, type: 'tx' | 'address' = 'tx'): string => {
  const cfg = getChainConfig(chain)
  if (!cfg) return '#'
  return `${cfg.explorerUrl}/${type}/${txHash}`
}

import type { Pool, PoolType } from '@/types/defi'

const RWA_KEYWORDS = [
  'ondo', 'centrifuge', 'maple', 'goldfinch', 'truefi', 'backed', 'matrixport',
  'usdy', 'ousg', 't-bill', 'tbill', 'plume', 'mountain', 'resolv', 'ethena-rwa',
  'superstate', 'openeden', 'hashnote', 'swarm', 'clearpool', 'credix',
]

const LENDING_PROJECTS = [
  'aave', 'compound', 'morpho', 'venus', 'radiant', 'benqi', 'euler', 'spark',
  'silo', 'moonwell', 'seamless', 'ironbank', 'cream', 'rari', 'geist', 'scream',
  'solend', 'kamino', 'drift', 'marginfi', 'save',
]

const STAKING_PROJECTS = [
  'lido', 'rocket-pool', 'rocketpool', 'frax-ether', 'stakefish', 'marinade',
  'jito', 'sanctum', 'ether.fi', 'eigenpie', 'kelp-dao', 'renzo', 'stader',
  'ankr', 'stakewise', 'swell', 'dinero', 'puffer', 'liquid-collective',
  'bifrost-liquid-staking',
]

const FARM_PROJECTS = [
  'beefy', 'yearn', 'convex-finance', 'concentrator', 'autofarm', 'harvest-finance',
  'alpaca-finance', 'badger-dao', 'pickle-finance', 'among',
]

const LP_PROJECTS = [
  'uniswap', 'curve', 'balancer', 'pancakeswap', 'sushiswap', 'raydium', 'orca',
  'aerodrome', 'velodrome', 'camelot', 'thena', 'traderjoe', 'quickswap',
  'spookyswap', 'spirit', 'solidly', 'beethoven-x', 'kyberswap',
  'syncswap', 'mav', 'maverick', 'cetus', 'turbos', 'whirlpool',
]

export const isRWAPool = (pool: Pool): boolean => {
  const s = pool.symbol?.toLowerCase() ?? ''
  const p = pool.project?.toLowerCase() ?? ''
  const m = pool.poolMeta?.toLowerCase() ?? ''
  return RWA_KEYWORDS.some((k) => s.includes(k) || p.includes(k) || m.includes(k))
}

export const isLPPair = (pool: Pool): boolean => {
  const sym = pool.symbol ?? ''
  return (
    sym.includes('-') ||
    sym.includes('/') ||
    (pool.underlyingTokens?.length ?? 0) >= 2 ||
    (pool.exposure === 'multi' && !LENDING_PROJECTS.some((k) => pool.project?.toLowerCase().includes(k)))
  )
}

export const classifyPoolType = (pool: Pool): PoolType => {
  const proj = pool.project?.toLowerCase() ?? ''
  const sym = pool.symbol?.toLowerCase() ?? ''
  const meta = pool.poolMeta?.toLowerCase() ?? ''

  if (isRWAPool(pool)) return 'RWA'

  if (LENDING_PROJECTS.some((k) => proj.includes(k)) || meta.includes('lend') || meta.includes('supply')) return 'Lending'

  if (
    STAKING_PROJECTS.some((k) => proj.includes(k)) ||
    meta.includes('stake') ||
    sym.startsWith('wst') ||
    sym.startsWith('mst') ||
    sym.startsWith('bst') ||
    (sym.startsWith('st') && sym.length < 8) ||
    sym.includes('lst')
  ) return 'Staking'

  if (FARM_PROJECTS.some((k) => proj.includes(k)) || meta.includes('vault') || meta.includes('farm')) return 'Farm'

  if (isLPPair(pool) || LP_PROJECTS.some((k) => proj.includes(k))) {
    return pool.stablecoin ? 'Stable' : 'LP'
  }

  if (pool.exposure === 'single') return 'Single'

  return 'Outro'
}

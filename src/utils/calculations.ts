// APY / APR conversions
export const apyToApr = (apy: number): number => {
  return (Math.pow(1 + apy / 100, 1 / 365) - 1) * 365 * 100
}

export const aprToApy = (apr: number): number => {
  return (Math.pow(1 + apr / 100 / 365, 365) - 1) * 100
}

// Lending simulator
export interface LendSimulation {
  collateralValue: number
  borrowedValue: number
  healthFactor: number
  liquidationPrice: number
  netApy: number
}

export const simulateLend = (
  collateralAmount: number,
  collateralPrice: number,
  borrowedAmount: number,
  borrowedPrice: number,
  liquidationThreshold: number,
  supplyApy: number,
  borrowApy: number
): LendSimulation => {
  const collateralValue = collateralAmount * collateralPrice
  const borrowedValue = borrowedAmount * borrowedPrice

  const healthFactor =
    borrowedValue > 0
      ? (collateralValue * (liquidationThreshold / 100)) / borrowedValue
      : Infinity

  const liquidationPrice =
    collateralAmount > 0 && liquidationThreshold > 0
      ? (borrowedValue / (liquidationThreshold / 100)) / collateralAmount
      : 0

  const netApy = supplyApy - (borrowedValue / collateralValue) * borrowApy

  return { collateralValue, borrowedValue, healthFactor, liquidationPrice, netApy }
}

export const simulatePriceDrop = (
  collateralAmount: number,
  collateralPrice: number,
  borrowedValue: number,
  liquidationThreshold: number,
  dropPct: number
): { newPrice: number; newCollateralValue: number; newHealthFactor: number } => {
  const newPrice = collateralPrice * (1 - dropPct / 100)
  const newCollateralValue = collateralAmount * newPrice
  const newHealthFactor =
    borrowedValue > 0
      ? (newCollateralValue * (liquidationThreshold / 100)) / borrowedValue
      : Infinity
  return { newPrice, newCollateralValue, newHealthFactor }
}

// Impermanent loss
export const calculateIL = (priceRatioChange: number): number => {
  // priceRatioChange = new price ratio / initial price ratio
  const k = Math.sqrt(priceRatioChange)
  return (2 * k) / (1 + priceRatioChange) - 1
}

export const simulateLiquidity = (
  tokenAAmount: number,
  tokenBAmount: number,
  tokenAPrice: number,
  tokenBPrice: number,
  newTokenAPrice: number,
  newTokenBPrice: number,
  feeApy: number,
  daysHeld = 365
) => {
  const initialValue = tokenAAmount * tokenAPrice + tokenBAmount * tokenBPrice

  // Future hold value
  const holdValue = tokenAAmount * newTokenAPrice + tokenBAmount * newTokenBPrice

  // Price ratio change: (newA/newB) / (A/B)
  const initialRatio = tokenAPrice / tokenBPrice
  const newRatio = newTokenAPrice / newTokenBPrice
  const priceRatioChange = newRatio / initialRatio

  const ilFraction = calculateIL(priceRatioChange)
  const lpValueBeforeFees = holdValue * (1 + ilFraction)

  // Fees earned proportional to time
  const feesEarned = initialValue * (feeApy / 100) * (daysHeld / 365)
  const lpValueWithFees = lpValueBeforeFees + feesEarned

  const ilUsd = lpValueBeforeFees - holdValue
  const netPnl = lpValueWithFees - initialValue

  return {
    initialValue,
    holdValue,
    lpValueBeforeFees,
    lpValueWithFees,
    feesEarned,
    ilFraction: ilFraction * 100,
    ilUsd,
    netPnl,
    breakEvenApy: ilFraction < 0 ? (Math.abs(ilFraction) / (daysHeld / 365)) * 100 : 0,
  }
}

export const getHealthFactorLabel = (hf: number): { label: string; color: string } => {
  if (hf === Infinity || hf > 3) return { label: 'Seguro', color: '#10b981' }
  if (hf > 1.5) return { label: 'Moderado', color: '#f59e0b' }
  if (hf > 1.1) return { label: 'Alto Risco', color: '#f97316' }
  return { label: 'Crítico', color: '#ef4444' }
}

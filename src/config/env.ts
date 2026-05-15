export const env = {
  heliusApiKey: import.meta.env.VITE_HELIUS_API_KEY ?? '',
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_API_KEY ?? '',
  etherscanApiKey: import.meta.env.VITE_ETHERSCAN_API_KEY ?? '',
  covalentApiKey: import.meta.env.VITE_COVALENT_API_KEY ?? '',
  firebaseApiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  proTokenSymbol: import.meta.env.VITE_PRO_TOKEN_SYMBOL ?? 'yldSOL',
  proTokenMinAmount: Number(import.meta.env.VITE_PRO_TOKEN_MIN_AMOUNT ?? '10'),
}

import { useState, useCallback } from 'react'
import type { ConnectedWallet } from '@/types/wallet'

export const useWallet = () => {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async (provider: ConnectedWallet['provider']) => {
    setConnecting(true)
    setError(null)
    try {
      // Phantom detection
      if (provider === 'phantom') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const phantom = (window as any).phantom?.solana
        if (!phantom?.isPhantom) {
          throw new Error('Phantom não encontrado. Instale a extensão Phantom.')
        }
        const resp = await phantom.connect()
        setWallet({ address: resp.publicKey.toString(), chain: 'solana', provider: 'phantom' })
        return
      }

      // Solflare detection
      if (provider === 'solflare') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const solflare = (window as any).solflare
        if (!solflare?.isSolflare) {
          throw new Error('Solflare não encontrado. Instale a extensão Solflare.')
        }
        await solflare.connect()
        setWallet({ address: solflare.publicKey.toString(), chain: 'solana', provider: 'solflare' })
        return
      }

      // MetaMask / generic EVM
      if (provider === 'metamask') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eth = (window as any).ethereum
        if (!eth) throw new Error('MetaMask não encontrado.')
        const accounts = await eth.request({ method: 'eth_requestAccounts' }) as string[]
        if (!accounts.length) throw new Error('Nenhuma conta autorizada.')
        setWallet({ address: accounts[0], chain: 'ethereum', provider: 'metamask' })
        return
      }

      throw new Error('Provider não suportado ainda.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar carteira')
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setWallet(null)
    setError(null)
  }, [])

  return { wallet, connecting, error, connect, disconnect }
}

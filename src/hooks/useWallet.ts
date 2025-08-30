import { useConnect, useDisconnect, useAccount } from 'wagmi'
import { useDispatch } from 'react-redux'
import { setConnecting, setConnected, setDisconnected, setError } from '../store/slices/walletSlice'
import { useCallback, useEffect } from 'react'

export const useWallet = () => {
  const dispatch = useDispatch()
  const { address, isConnected, isConnecting } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (isConnecting) {
      dispatch(setConnecting(true))
    } else if (isConnected && address) {
      dispatch(setConnected({ address }))
    } else if (!isConnected) {
      dispatch(setDisconnected())
    }
  }, [isConnected, isConnecting, address, dispatch])

  useEffect(() => {
    if (error) {
      dispatch(setError(error.message))
    }
  }, [error, dispatch])

  const connectWallet = useCallback((connectorId?: string) => {
    const connector = connectorId 
      ? connectors.find(c => c.id === connectorId)
      : connectors[0] 

    if (connector) {
      connect({ connector })
    }
  }, [connect, connectors])

  const disconnectWallet = useCallback(() => {
    disconnect()
  }, [disconnect])

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isPending,
    connectWallet,
    disconnectWallet,
    connectors,
    error
  }
}
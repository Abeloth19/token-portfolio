import { useState } from 'react'
import { useWallet } from '../hooks/useWallet'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {
  const { connectWallet, connectors, isConnecting } = useWallet()
  const [selectedConnector, setSelectedConnector] = useState<string>('')

  const handleConnect = (connectorId: string) => {
    setSelectedConnector(connectorId)
    connectWallet(connectorId)
    onClose()
  }

  if (!isOpen) return null

  const getConnectorName = (id: string) => {
    switch (id) {
      case 'injected':
        return 'Browser Wallet'
      case 'metaMask':
        return 'MetaMask'
      default:
        return id
    }
  }

  const getConnectorIcon = (id: string) => {
    switch (id) {
      case 'metaMask':
        return '🦊'
      case 'injected':
        return '👛'
      default:
        return '🔗'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-xl p-6 w-96 bg-[#212124]">      
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

          <div className="space-y-3">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector.id)}
              disabled={isConnecting && selectedConnector === connector.id}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-transparent border border-gray-600 hover:border-gray-400 hover:bg-gray-700/20 transition-colors text-left"
               >
              <span className="text-2xl">{getConnectorIcon(connector.id)}</span>
              <div className="flex-1">
                <div className="text-white font-medium">
                  {getConnectorName(connector.id)}
                </div>
                <div className="text-gray-400 text-sm">
                  {connector.id === 'injected' && 'Connect using browser extension'}
                  {connector.id === 'metaMask' && 'Connect using MetaMask'}
                </div>
              </div>
              {isConnecting && selectedConnector === connector.id && (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            By connecting a wallet, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  )
}
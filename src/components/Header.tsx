import { useState } from 'react'
import { TokenIcon } from './icons/TokenIcon'
import { WalletIcon } from './icons/WalletIcon'
import { WalletModal } from './WalletModal'
import { useWallet } from '../hooks/useWallet'

export const Header = () => {
  const { isConnected, address, isConnecting, disconnectWallet } = useWallet()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleWalletAction = () => {
    if (isConnected) {
      disconnectWallet()
    } else {
      setIsModalOpen(true)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  const getButtonText = () => {
    if (isConnecting) return 'Connecting...'
    if (isConnected && address) return formatAddress(address)
    return 'Connect Wallet'
  } 

  return (
    <header className="flex items-center justify-between px-6 py-5 ">  
      <div className="flex items-center gap-3">
        <div className="w-[28px] h-[28px] rounded-lg flex items-center justify-center bg-[#A9E851]">
          <TokenIcon className="w-4 h-4 text-black" />
        </div>
        <h1 className="text-white text-xl font-semibold">Token Portfolio</h1>
      </div>

      <button
        onClick={handleWalletAction}
        disabled={isConnecting}
        className={`flex items-center gap-2 p-2 font-medium rounded-full transition-colors text-black bg-[#A9E851] ${
          isConnecting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
        }`}
      >
        <WalletIcon className="w-4 h-4" />
        {getButtonText()}
      </button>

      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}
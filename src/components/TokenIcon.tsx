import ethereumImg from '../assets/ethereum.png'
import bitcoinImg from '../assets/bitcoin.png'
import solanaImg from '../assets/solana.png'
import dogecoinImg from '../assets/dogecoin.png'
import usdcImg from '../assets/USDC.png'
import stellarImg from '../assets/stellar.png'

interface TokenIconProps {
  symbol: string
  name: string
  className?: string
}

export const TokenIconComponent = ({ symbol, name, className = "w-8 h-8" }: TokenIconProps) => {
  const availableIcons = [ethereumImg, bitcoinImg, solanaImg, dogecoinImg, usdcImg, stellarImg]

  const icons: Record<string, string> = {
    'ETH': ethereumImg,
    'BTC': bitcoinImg,
    'SOL': solanaImg,
    'DOGE': dogecoinImg,
    'USDC': usdcImg,
    'XLM': stellarImg
  }

  const getTokenImage = () => {
      if (icons[symbol]) {
      return icons[symbol]
    }

    const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const randomIndex = hash % availableIcons.length
    return availableIcons[randomIndex]
  }

  return (
    <img 
      src={getTokenImage()}
      alt={`${name} (${symbol})`}
      className={`${className} rounded-lg w-[32px] h-[48px]`}
      />
  )
}
interface SparklineProps {
  symbol: string
  change24h: number
  sparklineData?: number[]
}

export const Sparkline = ({ change24h, sparklineData }: SparklineProps) => {
  if (sparklineData && sparklineData.length > 0) {
    const width = 76
    const height = 28
    const minPrice = Math.min(...sparklineData)
    const maxPrice = Math.max(...sparklineData)
    const priceRange = maxPrice - minPrice || 1
    
    const pathData = sparklineData.map((price, index) => {
      const x = (index / (sparklineData.length - 1)) * width
      const y = height - ((price - minPrice) / priceRange) * height
      return index === 0 ? `M${x.toFixed(2)} ${y.toFixed(2)}` : `L${x.toFixed(2)} ${y.toFixed(2)}`
    }).join(' ')
    
    const color = change24h >= 0 ? '#32CA5B' : '#FF3A33'
    
    return (
      <div className="w-19 h-7 flex items-center justify-center">
        <svg width="76" height="28" viewBox="0 0 76 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d={pathData} stroke={color} strokeWidth="0.7" fill="none"/>
        </svg>
      </div>
    )
  }

  return (
    <div className="w-19 h-7 flex items-center justify-center text-gray-400 text-xs">
      Loading...
    </div>
  )
}
import { useCallback } from 'react'
import { PortfolioChart } from './PortfolioChart'
import type { WatchlistItem } from '../types'

interface PortfolioCardProps {
  watchlist: WatchlistItem[]
  total: number
  lastUpdated: string
}

export const PortfolioCard = ({ watchlist, total, lastUpdated }: PortfolioCardProps) => {
 
  const { DonutChart, chartData, chartTotal } = PortfolioChart({ watchlist })

  const formatLastUpdated = useCallback((timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    })
  }, [])

  return (
    <>
      {/* Desktop Layout - Single Card */}
      <div className="hidden md:flex rounded-xl p-6 mb-8 gap-5 w-full bg-[#27272A] h-72">
        {/* Left Section - Portfolio Total */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-gray-400 text-sm mb-2">Portfolio Total</h2>
          <div className="text-white text-4xl font-medium flex-1">${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-gray-500 text-sm">Last updated: {formatLastUpdated(lastUpdated)}</p>
        </div>

        {/* Right Section - Portfolio Total Chart */}
        <div className="flex-1">
          <h2 className="text-gray-400 text-sm mb-4">Portfolio Total</h2>
          
          <div className="flex items-start gap-6">
            <DonutChart data={chartData} />
            <div className="flex-1 space-y-4">
              {chartData.length > 0 ? (
                chartData.map((item, index) => (
                  <div key={`${item.symbol}-${index}`} className="flex items-center justify-between text-sm font-medium">
                    <span style={{ color: item.color }}>{item.name} ({item.symbol})</span>
                    <span className="text-gray-400">
                      {chartTotal > 0 ? 
                      ((item.value / chartTotal) * 100) < 0.1 && ((item.value / chartTotal) * 100) > 0 
                        ? '<0.1' 
                        : ((item.value / chartTotal) * 100).toFixed(1) 
                      : '0.0'}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No tokens with holdings yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Single Combined Card */}
      <div className="md:hidden mb-8">
        {/* Combined Portfolio Card */}
        <div className="rounded-xl p-6 bg-[#27272A]">
          <h2 className="text-gray-400 text-sm mb-3">Portfolio Total</h2>
          <div className="text-white text-3xl font-bold mb-6">${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-gray-500 text-sm mb-6">Last updated: {formatLastUpdated(lastUpdated)}</p>
          
          {/* Chart and breakdown */}
          <div className="flex flex-col items-center space-y-6">
            <DonutChart data={chartData} />
            
            {/* Token breakdown */}
            <div className="w-full space-y-4">
              {chartData.length > 0 ? (
                chartData.map((item, index) => (
                  <div key={`${item.symbol}-${index}`} className="flex items-center justify-between text-sm">
                    <span style={{ color: item.color }}>{item.name} ({item.symbol})</span>
                    <span className="text-gray-400">
                      {chartTotal > 0 ? 
                      ((item.value / chartTotal) * 100) < 0.1 && ((item.value / chartTotal) * 100) > 0 
                        ? '<0.1' 
                        : ((item.value / chartTotal) * 100).toFixed(1) 
                      : '0.0'}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No tokens with holdings yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
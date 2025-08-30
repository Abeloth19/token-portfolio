import { useCallback, useMemo } from 'react'

export interface PortfolioDataItem {
  name: string
  symbol: string
  value: number
  color: string
}

const DonutChart = ({ data }: { data: PortfolioDataItem[] }) => {
  const radius = 80
  const innerRadius = 45
  const centerX = radius
  const centerY = radius
  
  let cumulativeAngle = 0
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)
  
  if (!data || data.length === 0 || totalValue === 0) {
    return (
      <div className="w-40 h-40 flex items-center justify-center">
        <svg width={160} height={160} viewBox="0 0 160 160">
          <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#374151" strokeWidth="2"/>
          <circle cx={centerX} cy={centerY} r={innerRadius} fill="#18181B"/>
        </svg>
      </div>
    )
  }
  
  return (
    <div className="w-40 h-40">
      <svg width={160} height={160} viewBox="0 0 160 160">
        <circle cx={80} cy={80} r={80} fill="none" stroke="#ffffff" strokeWidth="1"/>
        {data.map((item, index) => {
          const percentage = totalValue > 0 ? item.value / totalValue : 0
          const angle = percentage * 360
          
          const startAngle = cumulativeAngle
          const endAngle = cumulativeAngle + angle
          
          const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180)
          const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180)
          const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180)
          const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180)
          
          const x3 = centerX + innerRadius * Math.cos((endAngle - 90) * Math.PI / 180)
          const y3 = centerY + innerRadius * Math.sin((endAngle - 90) * Math.PI / 180)
          const x4 = centerX + innerRadius * Math.cos((startAngle - 90) * Math.PI / 180)
          const y4 = centerY + innerRadius * Math.sin((startAngle - 90) * Math.PI / 180)
          
          const largeArcFlag = angle > 180 ? 1 : 0
          
          const pathData = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            'Z'
          ].join(' ')
          
          cumulativeAngle += angle
          
          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              stroke="#ffffff"
              strokeWidth="1"
            />
          )
        })}
        <circle cx={80} cy={80} r={45} fill="none" stroke="#ffffff" strokeWidth="1"/>
      </svg>
    </div>
  )
}

import type { WatchlistItem } from '../types'

interface PortfolioChartProps {
  watchlist: WatchlistItem[]
}

export const PortfolioChart = ({ watchlist }: PortfolioChartProps) => {
  
  const getTokenColor = useCallback((index: number): string => {
    const chartColors = ['#FB923C', '#A78BFA', '#FB7185', '#10B981', '#60A5FA', '#18C9DD']
    return chartColors[index % chartColors.length]
  }, [])

  const portfolioData = useMemo(() => {
    const data = watchlist
      .filter(token => {
        return token.value > 0
      })
      .sort((a, b) => b.value - a.value)
      .map((token, index) => ({
        name: token.name,
        symbol: token.symbol,
        value: token.value,
        color: getTokenColor(index)
      }))
    return data
  }, [watchlist, getTokenColor])

    const chartData = useMemo(() => {
    return portfolioData.slice(0, 6)
  }, [portfolioData])

    const chartTotal = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0)
  }, [chartData])

  return { DonutChart, chartData, chartTotal }
}
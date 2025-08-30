import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { updatePrices, setLoading, setError } from '../store/slices/portfolioSlice'
import { fetchTokenPrices, type TokenPrice } from '../services/api'

export const useTokenPrices = () => {
  const dispatch = useDispatch()
  const { watchlist, isLoading, error } = useSelector((state: RootState) => state.portfolio)
  const [refreshing, setRefreshing] = useState(false)

  const refreshPrices = useCallback(async () => {
    if (watchlist.length === 0) return

    setRefreshing(true)
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
       const tokenIds = watchlist.map(item => item.id)
       const pricesData = await fetchTokenPrices(tokenIds)
       const priceUpdates = pricesData.map((tokenData: TokenPrice) => ({
        id: tokenData.id,
        price: tokenData.current_price,
        change24h: tokenData.price_change_percentage_24h || 0,
        sparklineData: tokenData.sparkline_in_7d?.price || []
      }))
      dispatch(updatePrices(priceUpdates))
      
    } catch (error) {
      console.error('Failed to refresh prices:', error)
      dispatch(setError('Failed to refresh prices. Please try again.'))
    } finally {
      setTimeout(() => {
        setRefreshing(false)
        dispatch(setLoading(false))
      }, 1000)
    }
  }, [watchlist, dispatch])

  const fetchTokenData = useCallback(async (tokenId: string): Promise<TokenPrice | null> => {
    try {
      const data = await fetchTokenPrices([tokenId])
      return data[0] || null
    } catch (error) {
      console.error('Failed to fetch token data:', error)
      return null
    }
  }, [])

  return {
    refreshPrices,
    fetchTokenData,
    isLoading,
    isRefreshing: refreshing,
    error
  }
}
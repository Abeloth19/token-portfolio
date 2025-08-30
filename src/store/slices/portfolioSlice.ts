import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { WatchlistItem, Token } from '../../types'

interface PortfolioState {
  watchlist: WatchlistItem[]
  total: number
  lastUpdated: string
  isLoading: boolean
  error: string | null
}

const getSampleData = (): WatchlistItem[] => [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 43250.67,
    change24h: 2.30,
    sparklineData: [42000, 42500, 43000, 42800, 43100, 43250],
    holdings: 0.05,
    value: 2162.53,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2654.32,
    change24h: -1.20,
    sparklineData: [2700, 2680, 2650, 2640, 2660, 2654],
    holdings: 2.5,
    value: 6635.80,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 98.45,
    change24h: 4.70,
    sparklineData: [94, 95, 97, 99, 98, 98.45],
    holdings: 15,
    value: 1476.75,
  }
]

const getStoredWatchlist = (): WatchlistItem[] => {
  try {
    const stored = localStorage.getItem('portfolio-watchlist')
    return stored ? JSON.parse(stored) : getSampleData()
  } catch {
    return getSampleData()
  }
}

const watchlist = getStoredWatchlist()
const initialTotal = watchlist.reduce((sum, item) => sum + item.value, 0)

const initialState: PortfolioState = {
  watchlist,
  total: initialTotal,
  lastUpdated: new Date().toISOString(),
  isLoading: false,
  error: null,
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<Token[]>) => {
      try {
        const newTokens = action.payload.map(token => ({
          ...token,
          holdings: 0,
          value: 0,
        }))
        
        const existingIds = state.watchlist.map(item => item.id)
        const filteredTokens = newTokens.filter(token => !existingIds.includes(token.id))
        
        state.watchlist.push(...filteredTokens)
        localStorage.setItem('portfolio-watchlist', JSON.stringify(state.watchlist))
        state.error = null
      } catch (error) {
        state.error = 'Failed to add tokens to watchlist'
        console.error('Error adding to watchlist:', error)
      }
    },
    
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      try {
        state.watchlist = state.watchlist.filter(item => item.id !== action.payload)
        localStorage.setItem('portfolio-watchlist', JSON.stringify(state.watchlist))
        portfolioSlice.caseReducers.calculateTotal(state)
        state.error = null
      } catch (error) {
        state.error = 'Failed to remove token from watchlist'
        console.error('Error removing from watchlist:', error)
      }
    },
    
    updateHoldings: (state, action: PayloadAction<{ id: string; holdings: number }>) => {
      try {
        const { id, holdings } = action.payload
        const item = state.watchlist.find(item => item.id === id)
        if (item) {
          item.holdings = holdings
          item.value = holdings * item.price
          localStorage.setItem('portfolio-watchlist', JSON.stringify(state.watchlist))
          portfolioSlice.caseReducers.calculateTotal(state)
          state.error = null
        }
      } catch (error) {
        state.error = 'Failed to update token holdings'
        console.error('Error updating holdings:', error)
      }
    },
    
    updatePrices: (state, action: PayloadAction<{ id: string; price: number; change24h: number; sparklineData: number[] }[]>) => {
      try {
        action.payload.forEach(update => {
          const item = state.watchlist.find(item => item.id === update.id)
          if (item) {
            item.price = update.price
            item.change24h = update.change24h
            item.sparklineData = update.sparklineData
            item.value = item.holdings * update.price
          }
        })
        
        state.lastUpdated = new Date().toISOString()
        localStorage.setItem('portfolio-watchlist', JSON.stringify(state.watchlist))
        portfolioSlice.caseReducers.calculateTotal(state)
        state.error = null
      } catch (error) {
        state.error = 'Failed to update token prices'
        console.error('Error updating prices:', error)
      }
    },
    
    calculateTotal: (state) => {
      state.total = state.watchlist.reduce((sum, item) => sum + item.value, 0)
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  addToWatchlist,
  removeFromWatchlist,
  updateHoldings,
  updatePrices,
  calculateTotal,
  setLoading,
  setError,
} = portfolioSlice.actions

export default portfolioSlice.reducer
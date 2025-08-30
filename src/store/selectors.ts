import type { RootState } from './index'

export const selectWatchlist = (state: RootState) => state.portfolio.watchlist
export const selectPortfolioTotal = (state: RootState) => state.portfolio.total
export const selectLastUpdated = (state: RootState) => state.portfolio.lastUpdated
export const selectPortfolioLoading = (state: RootState) => state.portfolio.isLoading
export const selectPortfolioError = (state: RootState) => state.portfolio.error

export const selectWalletConnected = (state: RootState) => state.wallet.isConnected
export const selectWalletAddress = (state: RootState) => state.wallet.address
export const selectWalletConnecting = (state: RootState) => state.wallet.isConnecting
export const selectWalletError = (state: RootState) => state.wallet.error

export const selectPortfolioChartData = (state: RootState) => {
  const watchlist = state.portfolio.watchlist
  return watchlist.map(item => ({
    name: item.symbol,
    value: item.value,
    color: item.change24h >= 0 ? '#10b981' : '#ef4444'
  }))
}
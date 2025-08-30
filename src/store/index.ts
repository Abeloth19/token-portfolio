import { configureStore } from '@reduxjs/toolkit'
import portfolioSlice from './slices/portfolioSlice'
import walletSlice from './slices/walletSlice'

const store = configureStore({
  reducer: {
    portfolio: portfolioSlice,
    wallet: walletSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['portfolio.lastUpdated'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
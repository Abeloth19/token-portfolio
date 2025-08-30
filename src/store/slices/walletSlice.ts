import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface WalletState {
  isConnected: boolean
  address?: string
  isConnecting: boolean
  error: string | null
}

const initialState: WalletState = {
  isConnected: false,
  address: undefined,
  isConnecting: false,
  error: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload
      if (action.payload) {
        state.error = null
      }
    },
    
    setConnected: (state, action: PayloadAction<{ address: string }>) => {
      state.isConnected = true
      state.address = action.payload.address
      state.isConnecting = false
      state.error = null
    },
    
    setDisconnected: (state) => {
      state.isConnected = false
      state.address = undefined
      state.isConnecting = false
      state.error = null
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isConnecting = false
    },
  },
})

export const {
  setConnecting,
  setConnected,
  setDisconnected,
  setError,
} = walletSlice.actions

export default walletSlice.reducer
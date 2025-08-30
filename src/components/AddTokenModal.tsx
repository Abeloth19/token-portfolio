import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { TokenIconComponent } from './TokenIcon'
import { Toast } from './Toast'
import { useToast } from '../hooks/useToast'
import { CheckIcon } from './icons/CheckIcon'
import { addToWatchlist } from '../store/slices/portfolioSlice'
import { fetchTrendingTokens, searchTokens, fetchTokenDetails, type SearchToken } from '../services/api'

interface AddTokenModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddTokenModal = ({ isOpen, onClose }: AddTokenModalProps) => {
  const dispatch = useDispatch()
  const { toast, showToast, hideToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [availableTokens, setAvailableTokens] = useState<SearchToken[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



  useEffect(() => {
    if (isOpen && availableTokens.length === 0) {
      loadTrendingTokens()
    }
  }, [isOpen])


  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      searchForTokens(searchQuery)
    } else if (searchQuery.trim().length === 0) {
      loadTrendingTokens()
    }
  }, [searchQuery])

  const loadTrendingTokens = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const trending = await fetchTrendingTokens()
      setAvailableTokens(trending.slice(0, 10)) 
    } catch (error) {
      console.error('Failed to load trending tokens:', error)
      setError('Failed to load trending tokens')
      setAvailableTokens([
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', thumb: '', large: '' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', thumb: '', large: '' },
        { id: 'solana', name: 'Solana', symbol: 'SOL', thumb: '', large: '' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const searchForTokens = async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const searchResults = await searchTokens(query)
      setAvailableTokens(searchResults.slice(0, 10))      
    } catch (error) {
      console.error('Failed to search tokens:', error)
      setError('Failed to search tokens')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const filteredTokens = availableTokens

  const toggleTokenSelection = (tokenId: string) => {
    setSelectedTokens(prev => 
      prev.includes(tokenId) 
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    )
  }

  const handleAddToWatchlist = async () => {
    if (selectedTokens.length === 0) return

    setIsLoading(true)
    try {
      const tokenDetails = []
      for (const tokenId of selectedTokens) {
        try {
          const details = await fetchTokenDetails(tokenId)
          tokenDetails.push({
            id: details.id,
            name: details.name || tokenId,
            symbol: details.symbol?.toUpperCase() || tokenId.toUpperCase(),
            price: details.current_price || 0,
            change24h: details.price_change_percentage_24h || 0,
            sparklineData: details.sparkline_in_7d?.price || []
          })
        await new Promise(resolve => setTimeout(resolve, 200))
        } catch (error) {
          console.error(`Failed to fetch details for ${tokenId}:`, error)
            tokenDetails.push({
            id: tokenId,
            name: tokenId,
            symbol: tokenId.toUpperCase(),
            price: 0,
            change24h: 0,
            sparklineData: []
          })
        }
      }

      dispatch(addToWatchlist(tokenDetails))
      showToast(`Added ${selectedTokens.length} token${selectedTokens.length > 1 ? 's' : ''} to watchlist`, 'success')
      setSelectedTokens([])
      setSearchQuery('')
      onClose()
    } catch (error) {
      console.error('Failed to add tokens:', error)
      setError('Failed to add tokens to watchlist')
      showToast('Failed to add tokens to watchlist', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="rounded-xl flex flex-col overflow-hidden w-[90vw] h-[90vh] max-w-[640px] max-h-[480px] mx-4 bg-[#212124]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search */}
        <div className="relative border-b border-gray-600">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-white outline-none w-full h-[52px] bg-[#212124] py-3 pr-12 pl-4"
            placeholder="Search tokens (e.g., ETH, SOL)..."
            disabled={isLoading}
          />
        </div>
        <div className="flex-1 flex flex-col px-2 pt-2 overflow-hidden">
          {error && (
            <div className="mb-4 p-3 bg-red-600/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <div className="mb-2">
            <h3 className="text-[#71717A] text-sm font-medium ml-1">
              Trending
            </h3>
          </div>

          {/* Token List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                 width: 4px;
                 }
                .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
                border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #27272A;
                border-radius: 6px;
                min-height: 96px;
                opacity: 1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #27272A;
                  }
              `}</style>
            <div>
              {filteredTokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between px-2 py-1 rounded-lg transition-colors cursor-pointer bg-transparent"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#27272A")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                  onClick={() => toggleTokenSelection(token.id)}
                >
                  <div className="flex items-center gap-3">
                    <TokenIconComponent
                      symbol={token.symbol}
                      name={token.name}
                      className="w-8 h-8"
                    />
                    <div>
                      <div className="text-white font-medium text-sm">
                        {token.name} ({token.symbol})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {selectedTokens.includes(token.id) && (
                      <svg
                        width="15"
                        height="16"
                        viewBox="0 0 15 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.5 1.88542L9.47917 5.89583L14 6.55208L10.75 9.71875L11.4583 14.2292L7.5 12.1875L3.54167 14.2292L4.25 9.71875L1 6.55208L5.52083 5.89583L7.5 1.88542Z"
                          fill="#A9E851"
                        />
                      </svg>
                    )}
                    <div
                      className={`flex items-center justify-center rounded-full w-[12.5px] h-[12.5px] bg-transparent ${
                        selectedTokens.includes(token.id)
                          ? ""
                          : "border-2 border-zinc-500"
                      }`}
                    >
                      {selectedTokens.includes(token.id) && (
                        <CheckIcon className="w-[15px] h-[15px] text-[#A9E851]" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center px-6 py-3 border-t border-gray-600 h-[57px] bg-[#27272A] rounded-b-xl">
          <button
            onClick={handleAddToWatchlist}
            disabled={selectedTokens.length === 0}
             className={`h-[32px] text-sm px-4 border border-gray-600 font-medium rounded-md transition-colors gap-2 ${
              selectedTokens.length > 0
                ? "bg-[#A9E851] text-black hover:opacity-90"
                : "bg-[#27272A] text-[#52525B] cursor-not-allowed"
            }`}
          >
            Add to Watchlist
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
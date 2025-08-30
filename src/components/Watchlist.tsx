import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StarIcon } from './icons/StarIcon'
import { RefreshIcon } from './icons/RefreshIcon'
import { AddIcon } from './icons/AddIcon'
import { EditIcon } from './icons/EditIcon'
import { RemoveIcon } from './icons/RemoveIcon'
import { TokenIconComponent } from './TokenIcon'
import { Sparkline } from './Sparkline'
import { AddTokenModal } from './AddTokenModal'
import { WatchlistRowSkeleton } from './LoadingSkeleton'
import { Toast } from './Toast'
import { useToast } from '../hooks/useToast'
import { useTokenPrices } from '../hooks/useTokenPrices'
import { updateHoldings, removeFromWatchlist } from '../store/slices/portfolioSlice'
import type { RootState } from '../store'
import type { WatchlistItem } from '../types'


export const Watchlist = () => {
  const dispatch = useDispatch()
  const { watchlist, isLoading } = useSelector((state: RootState) => state.portfolio)
  const { refreshPrices, isRefreshing } = useTokenPrices()
  const { toast, showToast, hideToast } = useToast()
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [editingToken, setEditingToken] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setOpenDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])
  
  const formatPrice = useCallback((price: number) => {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }, [])

  const formatChange = useCallback((change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}%`
  }, [])

  const formatHoldings = useCallback((holdings: number) => {
    return holdings.toFixed(4)
  }, [])

  const handleEditHoldings = (tokenId: string, currentValue: number) => {
    setEditingToken(tokenId)
    setEditValue(formatHoldings(currentValue))
    setOpenDropdown(null)
  }

  const handleSaveHoldings = () => {
    if (editingToken && editValue) {
      const holdings = parseFloat(editValue)
      if (!isNaN(holdings) && holdings >= 0) {
        dispatch(updateHoldings({ id: editingToken, holdings }))
        showToast(`Holdings updated successfully`, 'success')
      } else {
        showToast('Please enter a valid number', 'error')
      }
    }
    setEditingToken(null)
    setEditValue('')
  }

  const handleRefreshPrices = async () => {
    try {
      await refreshPrices()
      showToast('Prices refreshed successfully', 'success')
    } catch {
      showToast('Failed to refresh prices', 'error')
    }
  }

  const totalPages = Math.ceil(watchlist.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedWatchlist = watchlist.slice(startIndex, endIndex)
  const displayedRange = watchlist.length > 0 ? `${startIndex + 1} — ${Math.min(endIndex, watchlist.length)}` : 'No results'

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [watchlist.length])

 useEffect(() => {
   refreshPrices(); 
 }, []);
 
  const renderTokenRow = (token: WatchlistItem) => (
    <>
      {/* Token */}
      <div className="flex items-center gap-3">
        <TokenIconComponent
          symbol={token.symbol}
          name={token.name}
          className="w-8 h-12"
        />
        <div>
          <div className="text-white font-normal text-sm">
            {token.name}{" "}
            <span className="hidden lg:inline text-gray-400">
              ({token.symbol})
            </span>
          </div>
          <div className="lg:hidden text-gray-400 text-xs">
            ({token.symbol})
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="text-[#A1A1AA] text-sm font-normal">
        {formatPrice(token.price)}
      </div>

      {/* 24h Change */}
      <div className="text-sm font-normal text-[#A1A1AA]">
        {formatChange(token.change24h)}
      </div>

      {/* Sparkline */}
      <div className="flex items-center">
        <Sparkline
          symbol={token.symbol}
          change24h={token.change24h}
          sparklineData={token.sparklineData || []}
        />
      </div>

      {/* Holdings */}
      <div>
        {editingToken === token.id ? (
          <div className="flex items-center gap-2">
            <div className="relative inline-block">
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-[109px]  bg-[#27272A] text-white text-sm px-2 py-1 pr-8 rounded border-0 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                style={{
                  boxShadow:
                    "0 0 0 2px #A9E851, 0 0 0 4px rgba(169, 232, 81, 0.2)",
                }}
                step="0.0001"
                min="0"
                autoFocus
              />

              {/* Custom arrows */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col ">
                <button
                  type="button"
                  onClick={() =>
                    setEditValue((prev) =>
                      (parseFloat(prev || "0") + 0.0001).toFixed(4)
                    )
                  }
                  className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-gray-400 hover:border-b-white transition-colors  mb-1"
                ></button>
                <button
                  type="button"
                  onClick={() =>
                    setEditValue((prev) =>
                      Math.max(0, parseFloat(prev || "0") - 0.0001).toFixed(4)
                    )
                  }
                  className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-400 hover:border-t-white transition-colors"
                ></button>
              </div>
            </div>

            <button
              onClick={handleSaveHoldings}
              className="w-[51px] h-[32px] drop-shadow-md bg-[#A9E851] border-[2px] border-[#1F6619] px-2 py-1 text-black text-xs font-medium rounded-md transition-colors"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="text-white text-sm font-normal">
            {formatHoldings(token.holdings)}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="text-white text-sm font-normal">
        {formatPrice(token.value)}
      </div>

      {/* Menu */}
      <div className="flex items-center justify-center relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropdown(openDropdown === token.id ? null : token.id);
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-lg">⋯</span>
        </button>

        {openDropdown === token.id && (
          <div
            ref={dropdownRef}
            className="absolute lg:right-12 lg:-top-4 right-2 -top-16 shadow-lg z-50 w-[144px] h-[72px]
             bg-[#27272A] rounded-lg border border-[#3F3F46] p-2 pointer-events-auto"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEditHoldings(token.id, token.holdings);
              }}
              className="w-full flex items-center gap-3 px-2 py-1 transition-colors text-left text-[#A1A1AA] h-[24px] text-sm whitespace-nowrap"
            >
              <EditIcon className="w-4 h-4" />
              Edit Holdings
            </button>

            <div className="w-full h-px bg-[#3F3F46] my-1"></div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const tokenName =
                  watchlist.find((t) => t.id === token.id)?.symbol || "Token";
                dispatch(removeFromWatchlist(token.id));
                setOpenDropdown(null);
                showToast(`${tokenName} removed from watchlist`, "info");
              }}
              className="w-full flex items-center gap-3 px-2 py-1 transition-colors text-left text-[#FDA4AF] h-6 text-sm whitespace-nowrap"
            >
              <RemoveIcon className="w-4 h-4" />
              Remove
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <StarIcon className="w-6 h-6" />
          <h2 className="text-white text-xl font-semibold">Watchlist</h2>
        </div>

        <div className="flex items-center gap-3 h-[36px]">
          <button
            onClick={handleRefreshPrices}
            disabled={isRefreshing || isLoading}
            className={` h-full text-sm flex items-center border bg-[#27272A] border-gray-800 gap-2 px-4 py-2 text-white hover:bg-[#212124] rounded-lg transition-colors  ${
              isRefreshing || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <RefreshIcon
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden lg:inline">
              {isRefreshing ? "Refreshing..." : "Refresh Prices"}
            </span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className=" h-full flex items-center gap-2 px-4 py-2 text-black  font-medium rounded-lg transition-colors bg-[#A9E851] border-2 border-[#1F6619]  hover:scale-105"
          >
            <AddIcon className="w-4 h-4" />
            Add Token
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-xl bg-[#212124]">
        {/* Desktop Table Header */}
        <div
          className="grid px-6 py-4 h-[48px] border rounded-t-lg border-gray-600 bg-[#27272A] text-[#A1A1AA]"
          style={{
            gridTemplateColumns: "repeat(6, 1fr) 80px",
            gap: "6px",
          }}
        >
          <div className="text-sm font-medium">Token</div>
          <div className="text-sm font-medium">Price</div>
          <div className="text-sm font-medium">24h %</div>
          <div className="text-sm font-medium">Sparkline (7d)</div>
          <div className="text-sm font-medium">Holdings</div>
          <div className="text-sm font-medium">Value</div>
          <div></div>
        </div>

        {/* Loading State - Desktop */}
        {isLoading && watchlist.length === 0 && (
          <>
            <WatchlistRowSkeleton />
            <WatchlistRowSkeleton />
            <WatchlistRowSkeleton />
          </>
        )}

        {/* Empty State - Desktop */}
        {!isLoading && watchlist.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">
              No tokens in watchlist. Add some tokens to get started.
            </div>
          </div>
        )}

        {/* Desktop Table Rows */}
        <div className="border-x border-gray-600 py-2">
          {paginatedWatchlist.map((token) => (
            <div
              key={token.id}
              className="grid px-6 transition-colors cursor-pointer h-12 items-center"
              style={{
                gridTemplateColumns: "repeat(6, 1fr) 80px",
                gap: "6px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#27272A")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {renderTokenRow(token)}
            </div>
          ))}
        </div>
        {/* Desktop Pagination */}
        <div className="flex h-[60px] items-center justify-between px-6 py-4 border rounded-b-lg bg-[#212124] border-gray-600">
          <div className="text-gray-400 text-sm">
            {watchlist.length > 0
              ? `${displayedRange} of ${watchlist.length} results`
              : "No results"}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-gray-400 text-sm">
              {watchlist.length > 0
                ? `${currentPage} of ${totalPages} pages`
                : "0 of 0 pages"}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className={`px-2 py-1 transition-colors ${
                  currentPage <= 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-300 hover:text-white cursor-pointer"
                }`}
              >
                Prev
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className={`px-2 py-1 transition-colors ${
                  currentPage >= totalPages
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-300 hover:text-white cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Table */}
      <div className="lg:hidden rounded-xl overflow-hidden bg-[#212124]">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[1478px]">
            {/* Mobile Table Header */}
            <div
              className="grid px-6 py-4 h-[48px] border rounded-t-lg border-gray-600 bg-[#27272A] text-[#A1A1AA]"
              style={{
                gridTemplateColumns: "repeat(6, 206px) 80px",
                gap: "6px",
               }}
            >
              <div className="text-sm font-medium">Token</div>
              <div className="text-sm font-medium">Price</div>
              <div className="text-sm font-medium">24h %</div>
              <div className="text-sm font-medium">Sparkline (7d)</div>
              <div className="text-sm font-medium">Holdings</div>
              <div className="text-sm font-medium">Value</div>
              <div></div>
            </div>

            {/* Loading State - Mobile */}
            {isLoading && watchlist.length === 0 && (
              <>
                <div
                  className="px-6 py-4 border-b border-gray-700 grid"
                  style={{
                    gridTemplateColumns: "3fr 1.5fr 1fr 2fr 1.5fr 1.5fr 0.5fr",
                    gap: "24px",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-12 bg-gray-600 animate-pulse rounded"></div>
                    <div className="h-4 w-24 bg-gray-600 animate-pulse rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-600 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-600 animate-pulse rounded"></div>
                  <div className="h-8 w-24 bg-gray-600 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-600 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-600 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-600 animate-pulse rounded"></div>
                </div>
                <div
                  className="px-6 py-4 border-b border-gray-700 grid"
                  style={{
                    gridTemplateColumns: "3fr 1.5fr 1fr 2fr 1.5fr 1.5fr 0.5fr",
                    gap: "24px",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-12 bg-gray-600 animate-pulse rounded"></div>
                    <div className="h-4 w-24 bg-gray-600 animate-pulse rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-600 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-600 animate-pulse rounded"></div>
                  <div className="h-8 w-24 bg-gray-600 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-600 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-600 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-600 animate-pulse rounded"></div>
                </div>
              </>
            )}

            {/* Empty State - Mobile */}
            {!isLoading && watchlist.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">
                  No tokens in watchlist. Add some tokens to get started.
                </div>
              </div>
            )}

            {/* Mobile Table Rows */}
            <div className="border-x border-gray-600 py-2">
              {paginatedWatchlist.map((token) => (
                <div
                  key={token.id}
                  className="grid px-6 transition-colors cursor-pointer h-[48px] items-center"
                  style={{
                    gridTemplateColumns: "repeat(6, 206px) 80px",
                    gap: "6px",
                     }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#27272A")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {renderTokenRow(token)}
                </div>
              ))}
            </div>
            {/* Mobile Pagination */}
            <div className="h-[60px] flex items-center justify-between px-6 py-4 border-t bg-[#212124] border-gray-600">
              <div className="text-gray-400 text-sm">
                {watchlist.length > 0
                  ? `${displayedRange} of ${watchlist.length} results`
                  : "No results"}
              </div>

              <div className="flex items-center gap-2">
                <div className="text-gray-400 text-sm">
                  {watchlist.length > 0
                    ? `${currentPage} of ${totalPages} pages`
                    : "0 of 0 pages"}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    className={`px-2 py-1 transition-colors ${
                      currentPage <= 1
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-gray-300 hover:text-white cursor-pointer"
                    }`}
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    className={`px-2 py-1 transition-colors ${
                      currentPage >= totalPages
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-gray-300 hover:text-white cursor-pointer"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
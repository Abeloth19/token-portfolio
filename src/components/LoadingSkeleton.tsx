interface LoadingSkeletonProps {
  className?: string
}

export const LoadingSkeleton = ({ className = "" }: LoadingSkeletonProps) => {
  return (
    <div 
      className={`animate-pulse bg-[#374151] rounded ${className}`}
      />
  )
}

export const WatchlistRowSkeleton = () => {
  return (
    <div className="grid px-6 py-4 border-b border-gray-700" 
      style={{ gridTemplateColumns: '3fr 1.5fr 1fr 2fr 1.5fr 1.5fr 0.5fr', gap: '24px' }}
    >
      {/* Token */}
      <div className="flex items-center gap-3">
        <LoadingSkeleton className="w-8 h-12 rounded-lg" />
        <div className="flex-1">
          <LoadingSkeleton className="h-4 w-32 mb-1" />
          <LoadingSkeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <LoadingSkeleton className="h-4 w-20 ml-auto" />
      </div>

      {/* 24h Change */}
      <div className="text-right">
        <LoadingSkeleton className="h-4 w-12 ml-auto" />
      </div>

      {/* Sparkline */}
      <div className="flex items-center justify-center">
        <LoadingSkeleton className="w-24 h-8" />
      </div>

      {/* Holdings */}
      <div className="text-right">
        <LoadingSkeleton className="h-4 w-16 ml-auto" />
      </div>

      {/* Value */}
      <div className="text-right">
        <LoadingSkeleton className="h-4 w-20 ml-auto" />
      </div>

      {/* Menu */}
      <div className="flex items-center justify-center">
        <LoadingSkeleton className="w-6 h-6 rounded" />
      </div>
    </div>
  )
}
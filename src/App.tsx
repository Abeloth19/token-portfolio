import { useSelector } from 'react-redux'
import { Header } from './components/Header'
import { Watchlist } from './components/Watchlist'
import { PortfolioCard } from './components/PortfolioCard'
import type { RootState } from './store'

function App() {
  const { watchlist, total, lastUpdated } = useSelector((state: RootState) => state.portfolio)
  
  try {
    return (
    <div className="min-h-screen bg-[#212124]">
         <Header />   
      {/* Portfolio Section */}
      <main className="mx-auto px-4 lg:px-6 py-4 lg:py-8">
        <PortfolioCard 
          watchlist={watchlist}
          total={total}
          lastUpdated={lastUpdated}
        />
        
        {/* Watchlist Section */}
        <Watchlist />
      </main>
    </div>
  )
  } catch (error) {
    console.error('App component error:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#212124]">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Something went wrong</h1>
          <p className="text-gray-400">Please refresh the page</p>
        </div>
      </div>
    )
  }
}

export default App

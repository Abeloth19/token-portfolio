# 🪙 Token Portfolio

A modern cryptocurrency portfolio tracker built with React, TypeScript, and Redux. Track your crypto holdings, view real-time prices, and manage your portfolio with an intuitive dark-themed interface.

## ✨ Features

### 📊 Portfolio Dashboard
- **Portfolio Total Card**: Real-time total value display with last updated timestamp
- **Interactive Donut Chart**: Visual breakdown of your top 6 holdings by value
- **Responsive Design**: Optimized layouts for desktop and mobile devices

### 📈 Watchlist Management
- **Complete Token Data**: Logo, name, symbol, price, 24h change, 7-day sparklines
- **Editable Holdings**: Inline editing with precise increment/decrement controls
- **Auto-calculated Values**: Real-time value computation (holdings × price)
- **Row Actions**: Edit holdings or remove tokens via dropdown menu
- **Pagination**: Clean pagination with 10 items per page

### 🔍 Token Discovery
- **Smart Search**: Find any cryptocurrency by name or symbol
- **Trending Section**: Discover popular tokens from CoinGecko
- **Multi-selection**: Add multiple tokens to your watchlist at once
- **Visual Selection**: Clear radio button selection with checkmarks

### 💳 Wallet Integration
- **Multi-wallet Support**: MetaMask and browser wallet integration via wagmi
- **Connection Status**: Display connected wallet address in header
- **Seamless UX**: Wallet state persists across browser sessions

### 🎨 User Experience
- **Dark Theme**: Professional dark interface with custom color palette
- **Real-time Updates**: Live price data with manual refresh control
- **Loading States**: Skeleton loaders and smooth loading indicators
- **Toast Notifications**: Success, error, and info notifications
- **Smooth Animations**: Hover effects and transitions throughout

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - Latest React with modern features
- **TypeScript** - Full type safety and developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### State Management
- **Redux Toolkit** - Modern Redux with simplified API
- **localStorage** - Persistent data across sessions
- **React Hooks** - Custom hooks for reusable logic

### External Integrations
- **wagmi** - Ethereum wallet connection library
- **@tanstack/react-query** - Server state management
- **CoinGecko API** - Real-time cryptocurrency data

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation & Setup

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd token-portfolio
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser

3. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (TypeScript + Vite) |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run preview` | Preview production build locally |


### State Flow
```
CoinGecko API → Redux Store → React Components → UI
     ↓              ↓              ↓           ↓
Real-time data → Global state → Local state → User interface
```

### Data Persistence
```typescript
localStorage: {
  "token-portfolio-state": {
    portfolio: {
      watchlist: WatchlistItem[],
      total: number,
      lastUpdated: string
    }
  }
}
```

## 🎯 Key Implementation Details

### Portfolio Calculations
```typescript
// Token value calculation
token.value = token.holdings * token.price

// Portfolio total calculation  
portfolio.total = watchlist.reduce((sum, token) => sum + token.value, 0)
```

### Chart Logic
- **Top 6 Display**: Shows only the 6 largest holdings by value
- **Color Assignment**: Consistent 6-color palette based on position
- **Percentage Calculation**: Accurate percentage display with <0.1% handling

### API Integration
```typescript
// Rate limiting strategy
fetchTokenPrices() → Sequential API calls with 200ms delays
sparkline=true → 7-day price history included
```

### Responsive Breakpoints
```css
/* Mobile-first approach */
default: Mobile layout
lg: (1024px+) Desktop layout
```

## 🔧 Configuration

### Vite Proxy Setup
```typescript
// vite.config.ts - CORS handling
server: {
  proxy: {
    '/api': {
      target: 'https://api.coingecko.com',
      changeOrigin: true
    }
  }
}
```

### Wagmi Configuration
```typescript
// wagmi.ts - Wallet setup
chains: [mainnet, sepolia]
connectors: [injected(), metaMask()]
```

## 📊 Performance Metrics

### Bundle Analysis
- **Development**: Fast HMR with Vite
- **Production**: Optimized bundle with tree-shaking
- **Code Splitting**: Component-level optimization
- **Type Checking**: Zero runtime TypeScript overhead

### Runtime Performance
- **React Optimization**: useCallback, useMemo for expensive operations
- **Efficient Rendering**: Minimal re-renders with proper dependency arrays
- **API Efficiency**: Batched requests and intelligent caching

## 🔐 Security Considerations

### Wallet Security
- **No Private Key Storage**: Only connection status and addresses
- **Local-only State**: Sensitive data never leaves the browser
- **Safe API Calls**: Public CoinGecko API, no authentication required

### Data Validation
- **TypeScript Types**: Compile-time type checking
- **Input Validation**: Holdings input validation and sanitization
- **Error Boundaries**: Graceful error handling throughout the app

## 🎨 Design System

### Color Palette
```css
/* Background */
--bg-primary: #212124
--bg-secondary: #27272A

/* Accent */
--accent-primary: #A9E851

/* Chart Colors */
--chart-orange: #FB923C
--chart-purple: #A78BFA  
--chart-pink: #FB7185
--chart-green: #10B981
--chart-blue: #60A5FA
--chart-cyan: #18C9DD
```

### Typography Scale
- **Headers**: 2xl, xl font sizes with semibold weight
- **Body**: sm, base sizes with normal weight
- **Data**: Monospace feel with consistent number formatting

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Output: dist/ folder ready for deployment
```

### Deployment Platforms
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **GitHub Pages**: Free hosting option

## 📈 Future Enhancements

### Potential Features
- **Portfolio Analytics**: Historical performance tracking
- **Price Alerts**: Notification system for price movements
- **Multi-currency Support**: Support for different base currencies
- **Advanced Charts**: Candlestick and volume charts
- **Export Functionality**: CSV/PDF portfolio reports

### Technical Improvements
- **Code Splitting**: Route-based code splitting
- **PWA Features**: Offline support and app-like experience
- **Advanced Caching**: Service worker for API caching
- **Testing Suite**: Unit and integration tests

---

## 📞 Support

For questions or issues related to this Token Portfolio application, please check the codebase or create an issue in the repository.

**Built with modern web technologies for optimal performance and user experience.**
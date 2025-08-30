const BASE_URL = import.meta.env.DEV ? '/api/v3' : '/api';

export interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface SearchToken {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  large: string;
}

export const TOKEN_ID_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  DOGE: "dogecoin",
  USDC: "usd-coin",
  XLM: "stellar",
  NOT: "notcoin",
  HYPE: "hyperliquid",
  PIN: "pinlink",
  SD: "stader",
};

export const getCoinGeckoId = (symbol: string): string => {
  return TOKEN_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase();
};

export const fetchTokenPrices = async (
  tokenIds: string[]
): Promise<TokenPrice[]> => {
  try {
    const ids = tokenIds.map((id) => getCoinGeckoId(id)).join(",");
    const response = await fetch(
      import.meta.env.DEV 
        ? `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`
        : `${BASE_URL}/markets?ids=${ids}&sparkline=true&per_page=100&page=1`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    throw error;
  }
};

export const fetchTokenDetails = async (
  tokenId: string
): Promise<TokenPrice> => {
  try {
    const id = getCoinGeckoId(tokenId);
    const response = await fetch(
      import.meta.env.DEV
        ? `${BASE_URL}/coins/markets?vs_currency=usd&ids=${id}&sparkline=true&price_change_percentage=24h`
        : `${BASE_URL}/markets?ids=${id}&sparkline=true`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Error fetching token details:", error);
    throw error;
  }
};

export const searchTokens = async (query: string): Promise<SearchToken[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error("Error searching tokens:", error);
    throw error;
  }
};

export const fetchTrendingTokens = async (): Promise<SearchToken[]> => {
  try {
    const response = await fetch(
      import.meta.env.DEV ? `${BASE_URL}/search/trending` : `${BASE_URL}/trending`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.coins?.map((item: { item: SearchToken }) => item.item) || [];
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    throw error;
  }
};

export const fetchPriceHistory = async (
  tokenId: string,
  days = 7
): Promise<number[]> => {
  try {
    const id = getCoinGeckoId(tokenId);
    const response = await fetch(
      import.meta.env.DEV
        ? `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=hourly`
        : `${BASE_URL}/chart?id=${id}&days=${days}&interval=hourly`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.prices?.map((price: [number, number]) => price[1]) || [];
  } catch (error) {
    console.error("Error fetching price history:", error);
    throw error;
  }
};

export const generateSparklinePath = (
  prices: number[],
  width = 76,
  height = 28
): string => {
  if (!prices || prices.length === 0) return "";

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const points = prices
    .map((price, index) => {
      const x = (index / (prices.length - 1)) * width;
      const y = height - ((price - minPrice) / priceRange) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return `M${points.replace(/,/g, " L").replace(/ L/, " ")}`;
};

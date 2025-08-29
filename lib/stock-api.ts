// Mock stock data fetching service
// In production, this would integrate with real APIs like Yahoo Finance or Google Finance

export interface StockQuote {
  symbol: string
  current_price: number
  pe_ratio?: number
  latest_earnings?: number
}

// Simulate real-time stock price fluctuations
function generateRandomPrice(basePrice: number, volatility = 0.05): number {
  const change = (Math.random() - 0.5) * 2 * volatility
  return Math.round(basePrice * (1 + change) * 100) / 100
}

// Mock stock data with realistic fluctuations
const baseStockPrices: Record<string, { price: number; pe: number; earnings: number }> = {
  // Technology Sector
  RELIANCE: { price: 2520.75, pe: 12.5, earnings: 15000 },
  TCS: { price: 3350.2, pe: 28.3, earnings: 42000 },
  INFY: { price: 1520.4, pe: 24.1, earnings: 28500 },
  "INFOSYS LTD": { price: 1520.4, pe: 24.1, earnings: 28500 },

  // Banking Sector
  HDFCBANK: { price: 1680.9, pe: 18.7, earnings: 35000 },
  "HDFC BANK": { price: 1680.9, pe: 18.7, earnings: 35000 },
  ICICIBANK: { price: 950.5, pe: 15.2, earnings: 25000 },
  "ICICI BANK": { price: 950.5, pe: 15.2, earnings: 25000 },
  SBIN: { price: 720.3, pe: 12.8, earnings: 22000 },
  "STATE BANK OF INDIA": { price: 720.3, pe: 12.8, earnings: 22000 },

  // FMCG Sector
  ITC: { price: 445.6, pe: 22.8, earnings: 18000 },
  "ITC LTD": { price: 445.6, pe: 22.8, earnings: 18000 },
  HINDUNILVR: { price: 2400.8, pe: 45.2, earnings: 8500 },
  "HINDUSTAN UNILEVER": { price: 2400.8, pe: 45.2, earnings: 8500 },
  NESTLEIND: { price: 2200.5, pe: 55.3, earnings: 2800 },

  // Auto Sector
  MARUTI: { price: 9500.2, pe: 25.4, earnings: 12000 },
  "MARUTI SUZUKI": { price: 9500.2, pe: 25.4, earnings: 12000 },
  TATAMOTORS: { price: 650.8, pe: 18.9, earnings: 8500 },
  "TATA MOTORS": { price: 650.8, pe: 18.9, earnings: 8500 },
  M_M: { price: 1850.4, pe: 22.1, earnings: 6200 },
  "MAHINDRA & MAHINDRA": { price: 1850.4, pe: 22.1, earnings: 6200 },

  // Pharma Sector
  SUNPHARMA: { price: 1100.6, pe: 28.7, earnings: 4500 },
  "SUN PHARMA": { price: 1100.6, pe: 28.7, earnings: 4500 },
  "SUN PHARMACEUTICAL": { price: 1100.6, pe: 28.7, earnings: 4500 },
  DRREDDY: { price: 1250.3, pe: 32.1, earnings: 3800 },
  "DR REDDY": { price: 1250.3, pe: 32.1, earnings: 3800 },
  CIPLA: { price: 1450.7, pe: 26.8, earnings: 4200 },

  // Energy Sector
  ONGC: { price: 180.5, pe: 8.5, earnings: 35000 },
  BPCL: { price: 320.8, pe: 12.3, earnings: 8500 },
  IOC: { price: 140.2, pe: 9.8, earnings: 12000 },

  // Metals & Mining
  TATASTEEL: { price: 140.5, pe: 15.2, earnings: 18000 },
  "TATA STEEL": { price: 140.5, pe: 15.2, earnings: 18000 },
  HINDALCO: { price: 520.8, pe: 18.5, earnings: 12500 },
  JSWSTEEL: { price: 920.3, pe: 22.1, earnings: 15000 },
}

function normalizeSymbol(symbol: string): string {
  // Convert to uppercase and remove extra spaces
  const normalized = symbol.toUpperCase().trim()

  // Handle common variations
  const symbolMappings: Record<string, string> = {
    INFOSYS: "INFY",
    "HINDUSTAN UNILEVER LIMITED": "HINDUNILVR",
    "HDFC BANK LIMITED": "HDFCBANK",
    "ICICI BANK LIMITED": "ICICIBANK",
    "TATA CONSULTANCY SERVICES": "TCS",
    "RELIANCE INDUSTRIES": "RELIANCE",
    "MARUTI SUZUKI INDIA": "MARUTI",
    "MAHINDRA AND MAHINDRA": "M_M",
    "SUN PHARMACEUTICAL INDUSTRIES": "SUNPHARMA",
    "DR REDDYS LABORATORIES": "DRREDDY",
  }

  return symbolMappings[normalized] || normalized
}

function generateFallbackStockData(symbol: string): { price: number; pe: number; earnings: number } {
  // Generate realistic but random data for unknown stocks
  const hash = symbol.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const basePrice = 500 + (Math.abs(hash) % 2000) // Price between 500-2500
  const pe = 15 + (Math.abs(hash >> 8) % 30) // PE between 15-45
  const earnings = 1000 + (Math.abs(hash >> 16) % 20000) // Earnings between 1000-21000

  return { price: basePrice, pe, earnings }
}

export class StockDataService {
  // Simulate fetching data from Yahoo Finance
  static async fetchFromYahooFinance(symbols: string[]): Promise<StockQuote[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    return symbols.map((symbol) => {
      const normalizedSymbol = normalizeSymbol(symbol)
      let baseData = baseStockPrices[normalizedSymbol] || baseStockPrices[symbol]

      if (!baseData) {
        console.warn(`Stock data not found for symbol: ${symbol}, generating fallback data`)
        baseData = generateFallbackStockData(symbol)
      }

      return {
        symbol,
        current_price: generateRandomPrice(baseData.price),
        pe_ratio: baseData.pe + (Math.random() - 0.5) * 2,
        latest_earnings: baseData.earnings,
      }
    })
  }

  // Simulate fetching data from Google Finance
  static async fetchFromGoogleFinance(
    symbols: string[],
  ): Promise<Pick<StockQuote, "symbol" | "pe_ratio" | "latest_earnings">[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700))

    return symbols.map((symbol) => {
      const normalizedSymbol = normalizeSymbol(symbol)
      let baseData = baseStockPrices[normalizedSymbol] || baseStockPrices[symbol]

      if (!baseData) {
        console.warn(`Stock data not found for symbol: ${symbol}, generating fallback data`)
        baseData = generateFallbackStockData(symbol)
      }

      return {
        symbol,
        pe_ratio: baseData.pe + (Math.random() - 0.5) * 1.5,
        latest_earnings: baseData.earnings * (0.95 + Math.random() * 0.1),
      }
    })
  }

  // Combined data fetching with error handling
  static async fetchStockData(symbols: string[]): Promise<StockQuote[]> {
    try {
      // In production, you might want to fetch from multiple sources and merge
      const yahooData = await this.fetchFromYahooFinance(symbols)
      const googleData = await this.fetchFromGoogleFinance(symbols)

      // Merge data from both sources
      return yahooData.map((yahoo) => {
        const google = googleData.find((g) => g.symbol === yahoo.symbol)
        return {
          ...yahoo,
          pe_ratio: google?.pe_ratio || yahoo.pe_ratio,
          latest_earnings: google?.latest_earnings || yahoo.latest_earnings,
        }
      })
    } catch (error) {
      console.error("Error fetching stock data:", error)
      throw error
    }
  }

  // Batch update with rate limiting simulation
  static async batchUpdateStockData(symbols: string[], batchSize = 5): Promise<StockQuote[]> {
    const results: StockQuote[] = []

    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize)
      try {
        const batchResults = await this.fetchStockData(batch)
        results.push(...batchResults)

        // Rate limiting - wait between batches
        if (i + batchSize < symbols.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error(`Error fetching batch ${i}-${i + batchSize}:`, error)
        // Continue with next batch even if one fails
      }
    }

    return results
  }
}

// Simple database connection utility
// In a real application, you would use a proper database client like Prisma or Drizzle
// For this demo, we'll simulate database operations with in-memory storage

import type { PortfolioHolding, StockData } from "./types"

// Mock database - in production, this would be replaced with actual database calls
const mockPortfolioHoldings: PortfolioHolding[] = [
  {
    id: 1,
    stock_symbol: "RELIANCE",
    stock_name: "Reliance Industries Ltd",
    purchase_price: 2450.0,
    quantity: 10,
    sector: "Energy",
    exchange_code: "NSE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    stock_symbol: "TCS",
    stock_name: "Tata Consultancy Services",
    purchase_price: 3200.0,
    quantity: 5,
    sector: "Technology",
    exchange_code: "NSE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    stock_symbol: "INFY",
    stock_name: "Infosys Ltd",
    purchase_price: 1450.0,
    quantity: 8,
    sector: "Technology",
    exchange_code: "NSE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    stock_symbol: "HDFCBANK",
    stock_name: "HDFC Bank Ltd",
    purchase_price: 1650.0,
    quantity: 12,
    sector: "Financials",
    exchange_code: "NSE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    stock_symbol: "ITC",
    stock_name: "ITC Ltd",
    purchase_price: 420.0,
    quantity: 25,
    sector: "Consumer Goods",
    exchange_code: "NSE",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockStockData: StockData[] = [
  {
    id: 1,
    symbol: "RELIANCE",
    current_price: 2520.75,
    pe_ratio: 12.5,
    latest_earnings: 15000.0,
    last_updated: new Date().toISOString(),
  },
  {
    id: 2,
    symbol: "TCS",
    current_price: 3350.2,
    pe_ratio: 28.3,
    latest_earnings: 42000.0,
    last_updated: new Date().toISOString(),
  },
  {
    id: 3,
    symbol: "INFY",
    current_price: 1520.4,
    pe_ratio: 24.1,
    latest_earnings: 28500.0,
    last_updated: new Date().toISOString(),
  },
  {
    id: 4,
    symbol: "HDFCBANK",
    current_price: 1680.9,
    pe_ratio: 18.7,
    latest_earnings: 35000.0,
    last_updated: new Date().toISOString(),
  },
  {
    id: 5,
    symbol: "ITC",
    current_price: 445.6,
    pe_ratio: 22.8,
    latest_earnings: 18000.0,
    last_updated: new Date().toISOString(),
  },
]

// Database operations
export const db = {
  // Portfolio Holdings operations
  async getPortfolioHoldings(): Promise<PortfolioHolding[]> {
    // Simulate async database call
    await new Promise((resolve) => setTimeout(resolve, 100))
    return [...mockPortfolioHoldings]
  },

  async getPortfolioHolding(id: number): Promise<PortfolioHolding | null> {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return mockPortfolioHoldings.find((h) => h.id === id) || null
  },

  async createPortfolioHolding(
    holding: Omit<PortfolioHolding, "id" | "created_at" | "updated_at">,
  ): Promise<PortfolioHolding> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const newHolding: PortfolioHolding = {
      ...holding,
      id: Math.max(...mockPortfolioHoldings.map((h) => h.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockPortfolioHoldings.push(newHolding)
    return newHolding
  },

  async updatePortfolioHolding(id: number, updates: Partial<PortfolioHolding>): Promise<PortfolioHolding | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const index = mockPortfolioHoldings.findIndex((h) => h.id === id)
    if (index === -1) return null

    mockPortfolioHoldings[index] = {
      ...mockPortfolioHoldings[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockPortfolioHoldings[index]
  },

  async deletePortfolioHolding(id: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const index = mockPortfolioHoldings.findIndex((h) => h.id === id)
    if (index === -1) return false

    mockPortfolioHoldings.splice(index, 1)
    return true
  },

  // Stock Data operations
  async getStockData(symbols?: string[]): Promise<StockData[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    if (symbols) {
      return mockStockData.filter((s) => symbols.includes(s.symbol))
    }
    return [...mockStockData]
  },

  async getStockDataBySymbol(symbol: string): Promise<StockData | null> {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return mockStockData.find((s) => s.symbol === symbol) || null
  },

  async updateStockData(symbol: string, data: Partial<StockData>): Promise<StockData | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const index = mockStockData.findIndex((s) => s.symbol === symbol)
    if (index === -1) {
      // Create new stock data entry
      const newStockData: StockData = {
        id: Math.max(...mockStockData.map((s) => s.id)) + 1,
        symbol,
        current_price: null,
        pe_ratio: null,
        latest_earnings: null,
        last_updated: new Date().toISOString(),
        ...data,
      }
      mockStockData.push(newStockData)
      return newStockData
    }

    mockStockData[index] = {
      ...mockStockData[index],
      ...data,
      last_updated: new Date().toISOString(),
    }
    return mockStockData[index]
  },
}

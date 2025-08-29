import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { StockDataService } from "@/lib/stock-api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symbols } = body

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({ success: false, error: "Symbols array is required" }, { status: 400 })
    }

    // Fetch fresh stock data
    const stockQuotes = await StockDataService.batchUpdateStockData(symbols)

    // Update database with fresh data
    const updatePromises = stockQuotes.map((quote) =>
      db.updateStockData(quote.symbol, {
        current_price: quote.current_price,
        pe_ratio: quote.pe_ratio || null,
        latest_earnings: quote.latest_earnings || null,
      }),
    )

    const updatedStocks = await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      data: {
        updated_count: updatedStocks.filter(Boolean).length,
        stocks: updatedStocks.filter(Boolean),
        last_updated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error updating stock data:", error)
    return NextResponse.json({ success: false, error: "Failed to update stock data" }, { status: 500 })
  }
}

// Auto-update endpoint for periodic refresh
export async function GET() {
  try {
    // Get all portfolio holdings to determine which stocks to update
    const holdings = await db.getPortfolioHoldings()
    const symbols = [...new Set(holdings.map((h) => h.stock_symbol))]

    if (symbols.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No stocks to update",
        data: { updated_count: 0, stocks: [] },
      })
    }

    // Fetch and update stock data
    const stockQuotes = await StockDataService.batchUpdateStockData(symbols)

    const updatePromises = stockQuotes.map((quote) =>
      db.updateStockData(quote.symbol, {
        current_price: quote.current_price,
        pe_ratio: quote.pe_ratio || null,
        latest_earnings: quote.latest_earnings || null,
      }),
    )

    const updatedStocks = await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      data: {
        updated_count: updatedStocks.filter(Boolean).length,
        stocks: updatedStocks.filter(Boolean),
        last_updated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error in auto-update:", error)
    return NextResponse.json({ success: false, error: "Failed to auto-update stock data" }, { status: 500 })
  }
}

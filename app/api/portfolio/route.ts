import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { calculatePortfolioRow, calculatePortfolioSummary, calculateSectorSummaries } from "@/lib/portfolio-utils"

export async function GET() {
  try {
    // Fetch portfolio holdings and stock data
    const [holdings, stockData] = await Promise.all([db.getPortfolioHoldings(), db.getStockData()])

    // Calculate total portfolio value for percentage calculations
    const totalInvestment = holdings.reduce((sum, h) => sum + h.purchase_price * h.quantity, 0)

    // Transform holdings into portfolio rows with calculations
    const portfolioRows = holdings.map((holding) => {
      const stock = stockData.find((s) => s.symbol === holding.stock_symbol)
      return calculatePortfolioRow(holding, stock || null, totalInvestment)
    })

    // Calculate summaries
    const portfolioSummary = calculatePortfolioSummary(portfolioRows)
    const sectorSummaries = calculateSectorSummaries(portfolioRows)

    return NextResponse.json({
      success: true,
      data: {
        holdings: portfolioRows,
        summary: portfolioSummary,
        sectors: sectorSummaries,
        last_updated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch portfolio data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stock_symbol, stock_name, purchase_price, quantity, sector, exchange_code } = body

    // Validate required fields
    if (!stock_symbol || !stock_name || !purchase_price || !quantity) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create new holding
    const newHolding = await db.createPortfolioHolding({
      stock_symbol: stock_symbol.toUpperCase(),
      stock_name,
      purchase_price: Number.parseFloat(purchase_price),
      quantity: Number.parseInt(quantity),
      sector: sector || "Other",
      exchange_code: exchange_code || "NSE",
    })

    return NextResponse.json({
      success: true,
      data: newHolding,
    })
  } catch (error) {
    console.error("Error creating portfolio holding:", error)
    return NextResponse.json({ success: false, error: "Failed to create portfolio holding" }, { status: 500 })
  }
}

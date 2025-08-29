import type { PortfolioHolding, StockData, PortfolioRow, SectorSummary, PortfolioSummary } from "./types"

export function calculatePortfolioRow(
  holding: PortfolioHolding,
  stockData: StockData | null,
  totalPortfolioValue: number,
): PortfolioRow {
  const investment = holding.purchase_price * holding.quantity
  const present_value = stockData?.current_price ? stockData.current_price * holding.quantity : null
  const gain_loss = present_value ? present_value - investment : null
  const portfolio_percentage = totalPortfolioValue > 0 ? (investment / totalPortfolioValue) * 100 : 0

  return {
    id: holding.id,
    particulars: holding.stock_name,
    stock_symbol: holding.stock_symbol,
    purchase_price: holding.purchase_price,
    quantity: holding.quantity,
    investment,
    portfolio_percentage,
    exchange_code: holding.exchange_code,
    current_price: stockData?.current_price || null,
    present_value,
    gain_loss,
    pe_ratio: stockData?.pe_ratio || null,
    latest_earnings: stockData?.latest_earnings || null,
    sector: holding.sector,
  }
}

export function calculateSectorSummaries(portfolioRows: PortfolioRow[]): SectorSummary[] {
  const sectorMap = new Map<string, SectorSummary>()

  portfolioRows.forEach((row) => {
    const existing = sectorMap.get(row.sector) || {
      sector: row.sector,
      total_investment: 0,
      total_present_value: 0,
      gain_loss: 0,
      holdings_count: 0,
    }

    existing.total_investment += row.investment
    existing.total_present_value += row.present_value || row.investment
    existing.gain_loss += row.gain_loss || 0
    existing.holdings_count += 1

    sectorMap.set(row.sector, existing)
  })

  return Array.from(sectorMap.values())
}

export function calculatePortfolioSummary(portfolioRows: PortfolioRow[]): PortfolioSummary {
  const total_investment = portfolioRows.reduce((sum, row) => sum + row.investment, 0)
  const total_present_value = portfolioRows.reduce((sum, row) => sum + (row.present_value || row.investment), 0)
  const total_gain_loss = total_present_value - total_investment
  const total_gain_loss_percentage = total_investment > 0 ? (total_gain_loss / total_investment) * 100 : 0

  return {
    total_investment,
    total_present_value,
    total_gain_loss,
    total_gain_loss_percentage,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(percentage: number): string {
  return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`
}

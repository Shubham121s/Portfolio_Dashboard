export interface PortfolioHolding {
  id: number
  stock_symbol: string
  stock_name: string
  purchase_price: number
  quantity: number
  sector: string
  exchange_code: string
  created_at: string
  updated_at: string
}

export interface StockData {
  id: number
  symbol: string
  current_price: number | null
  pe_ratio: number | null
  latest_earnings: number | null
  last_updated: string
}

export interface PortfolioRow {
  id: number
  particulars: string // stock_name
  stock_symbol: string
  purchase_price: number
  quantity: number
  investment: number // purchase_price * quantity
  portfolio_percentage: number
  exchange_code: string
  current_price: number | null
  present_value: number | null // current_price * quantity
  gain_loss: number | null // present_value - investment
  pe_ratio: number | null
  latest_earnings: number | null
  sector: string
}

export interface SectorSummary {
  sector: string
  total_investment: number
  total_present_value: number
  gain_loss: number
  holdings_count: number
}

export interface PortfolioSummary {
  total_investment: number
  total_present_value: number
  total_gain_loss: number
  total_gain_loss_percentage: number
}

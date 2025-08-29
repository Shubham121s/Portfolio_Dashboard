"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { formatCurrency } from "@/lib/portfolio-utils"
import type { PortfolioRow } from "@/lib/types"

interface MobilePortfolioCardProps {
  holding: PortfolioRow
}

export function MobilePortfolioCard({ holding }: MobilePortfolioCardProps) {
  const getGainLossColor = (gainLoss: number | null) => {
    if (gainLoss === null) return "text-muted-foreground"
    return gainLoss >= 0 ? "text-green-600" : "text-red-600"
  }

  const getGainLossIcon = (gainLoss: number | null) => {
    if (gainLoss === null) return null
    return gainLoss >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getGainLossBgColor = (gainLoss: number | null) => {
    if (gainLoss === null) return ""
    return gainLoss >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
  }

  const getSectorBadgeColor = (sector: string) => {
    const colorMap: Record<string, string> = {
      Technology: "bg-blue-100 text-blue-800",
      Financials: "bg-green-100 text-green-800",
      Energy: "bg-yellow-100 text-yellow-800",
      "Consumer Goods": "bg-purple-100 text-purple-800",
      Healthcare: "bg-red-100 text-red-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colorMap[sector] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card
      className={`${getGainLossBgColor(holding.gain_loss)} border-l-4 ${holding.gain_loss && holding.gain_loss >= 0 ? "border-l-green-500" : "border-l-red-500"}`}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm leading-tight">{holding.particulars}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{holding.stock_symbol}</span>
              <Badge className={`text-xs ${getSectorBadgeColor(holding.sector)}`}>{holding.sector}</Badge>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {holding.exchange_code}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Qty:</span>
            <span className="ml-1 font-medium">{holding.quantity.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Portfolio:</span>
            <span className="ml-1 font-medium">{holding.portfolio_percentage.toFixed(1)}%</span>
          </div>
        </div>

        {/* Price Information */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Purchase Price:</span>
            <span className="font-medium">{formatCurrency(holding.purchase_price)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Current Price:</span>
            <span className="font-medium">{holding.current_price ? formatCurrency(holding.current_price) : "--"}</span>
          </div>
        </div>

        {/* Investment & Value */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Investment:</span>
            <span className="font-semibold">{formatCurrency(holding.investment)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Present Value:</span>
            <span className="font-semibold">
              {holding.present_value ? formatCurrency(holding.present_value) : "--"}
            </span>
          </div>
        </div>

        {/* Gain/Loss */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm text-muted-foreground">Gain/Loss:</span>
          <div className="flex items-center gap-1">
            {getGainLossIcon(holding.gain_loss)}
            <span className={`font-semibold ${getGainLossColor(holding.gain_loss)}`}>
              {holding.gain_loss ? formatCurrency(holding.gain_loss) : "--"}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        {(holding.pe_ratio || holding.latest_earnings) && (
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground pt-2 border-t">
            <div>
              <span>P/E Ratio:</span>
              <span className="ml-1">{holding.pe_ratio ? holding.pe_ratio.toFixed(1) : "--"}</span>
            </div>
            <div>
              <span>Earnings:</span>
              <span className="ml-1">{holding.latest_earnings ? formatCurrency(holding.latest_earnings) : "--"}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, PieChart, Building2 } from "lucide-react"
import { formatCurrency, formatPercentage } from "@/lib/portfolio-utils"
import type { SectorSummary, PortfolioSummary } from "@/lib/types"

interface SectorSummaryProps {
  sectors: SectorSummary[]
  portfolioSummary: PortfolioSummary
  isLoading?: boolean
}

export function SectorSummaryComponent({ sectors, portfolioSummary, isLoading = false }: SectorSummaryProps) {
  const getGainLossColor = (gainLoss: number) => {
    return gainLoss >= 0 ? "text-green-600" : "text-red-600"
  }

  const getGainLossIcon = (gainLoss: number) => {
    return gainLoss >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getSectorColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-teal-500",
    ]
    return colors[index % colors.length]
  }

  const getSectorIcon = (sector: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Technology: <Building2 className="h-4 w-4" />,
      Financials: <Building2 className="h-4 w-4" />,
      Energy: <Building2 className="h-4 w-4" />,
      "Consumer Goods": <Building2 className="h-4 w-4" />,
      Healthcare: <Building2 className="h-4 w-4" />,
      Other: <Building2 className="h-4 w-4" />,
    }
    return iconMap[sector] || <Building2 className="h-4 w-4" />
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Sector Allocation
          </CardTitle>
          <CardDescription>Portfolio breakdown by sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sectors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Sector Allocation
          </CardTitle>
          <CardDescription>Portfolio breakdown by sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">No sector data available</div>
        </CardContent>
      </Card>
    )
  }

  // Sort sectors by investment amount (descending)
  const sortedSectors = [...sectors].sort((a, b) => b.total_investment - a.total_investment)

  return (
    /* Made sector summary responsive with better mobile layout */
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Sector Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Sector Allocation
          </CardTitle>
          <CardDescription>Portfolio breakdown by sector</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedSectors.map((sector, index) => {
            const percentage =
              portfolioSummary.total_investment > 0
                ? (sector.total_investment / portfolioSummary.total_investment) * 100
                : 0
            const gainLossPercentage =
              sector.total_investment > 0 ? (sector.gain_loss / sector.total_investment) * 100 : 0

            return (
              <div key={sector.sector} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSectorColor(index)}`}></div>
                    <span className="font-medium">{sector.sector}</span>
                    <Badge variant="secondary" className="text-xs">
                      {sector.holdings_count} {sector.holdings_count === 1 ? "stock" : "stocks"}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{percentage.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(sector.total_investment)}</div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                  <div className="text-muted-foreground">
                    Present Value: {formatCurrency(sector.total_present_value)}
                  </div>
                  <div className={`flex items-center gap-1 ${getGainLossColor(sector.gain_loss)}`}>
                    {getGainLossIcon(sector.gain_loss)}
                    <span className="font-medium">
                      {formatCurrency(sector.gain_loss)} ({formatPercentage(gainLossPercentage)})
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Sector Performance Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sector Performance</h3>
        <div className="space-y-3">
          {sortedSectors.map((sector, index) => {
            const gainLossPercentage =
              sector.total_investment > 0 ? (sector.gain_loss / sector.total_investment) * 100 : 0

            return (
              <Card key={sector.sector} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getSectorColor(index)}`}></div>
                      {getSectorIcon(sector.sector)}
                    </div>
                    <div>
                      <div className="font-medium">{sector.sector}</div>
                      <div className="text-sm text-muted-foreground">{sector.holdings_count} holdings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getGainLossColor(sector.gain_loss)}`}>
                      {formatPercentage(gainLossPercentage)}
                    </div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(sector.gain_loss)}</div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

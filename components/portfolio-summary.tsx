"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity } from "lucide-react"
import { formatCurrency, formatPercentage } from "@/lib/portfolio-utils"
import type { PortfolioSummary } from "@/lib/types"

interface PortfolioSummaryProps {
  summary: PortfolioSummary
  isLoading?: boolean
}

export function PortfolioSummaryCards({ summary, isLoading = false }: PortfolioSummaryProps) {
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

  const getGainLossBgColor = (gainLoss: number) => {
    return gainLoss >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-pulse bg-muted h-8 rounded"></div>
              <p className="text-xs text-muted-foreground mt-1">Loading data...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(summary.total_investment)}</div>
          <p className="text-xs text-muted-foreground">Initial investment amount</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Value</CardTitle>
          <PieChart className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{formatCurrency(summary.total_present_value)}</div>
          <p className="text-xs text-muted-foreground">Current portfolio value</p>
        </CardContent>
      </Card>

      <Card
        className={`border-l-4 ${summary.total_gain_loss >= 0 ? "border-l-green-500" : "border-l-red-500"} ${getGainLossBgColor(summary.total_gain_loss)}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
          {getGainLossIcon(summary.total_gain_loss)}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getGainLossColor(summary.total_gain_loss)}`}>
            {formatCurrency(summary.total_gain_loss)}
          </div>
          <p className="text-xs text-muted-foreground">Unrealized P&L</p>
        </CardContent>
      </Card>

      <Card
        className={`border-l-4 ${summary.total_gain_loss_percentage >= 0 ? "border-l-green-500" : "border-l-red-500"} ${getGainLossBgColor(summary.total_gain_loss_percentage)}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Return %</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getGainLossColor(summary.total_gain_loss_percentage)}`}>
            {formatPercentage(summary.total_gain_loss_percentage)}
          </div>
          <p className="text-xs text-muted-foreground">Overall return percentage</p>
        </CardContent>
      </Card>
    </div>
  )
}

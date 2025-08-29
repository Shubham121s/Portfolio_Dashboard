"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, ArrowUpDown, Grid3X3, List } from "lucide-react"
import { formatCurrency } from "@/lib/portfolio-utils"
import { MobilePortfolioCard } from "./mobile-portfolio-card"
import type { PortfolioRow } from "@/lib/types"

interface PortfolioTableProps {
  data: PortfolioRow[]
  isLoading?: boolean
  lastUpdated?: string
}

export function PortfolioTable({ data, isLoading = false, lastUpdated }: PortfolioTableProps) {
  const [sortField, setSortField] = useState<keyof PortfolioRow | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  const handleSort = (field: keyof PortfolioRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

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
    return gainLoss >= 0 ? "bg-green-50" : "bg-red-50"
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

  const getRowClassName = (row: PortfolioRow) => {
    let baseClass = "hover:bg-muted/50 transition-colors"
    if (isLoading) {
      baseClass += " animate-pulse"
    }
    // Add subtle background color based on gain/loss
    if (row.gain_loss !== null) {
      baseClass += row.gain_loss >= 0 ? " hover:bg-green-50/50" : " hover:bg-red-50/50"
    }
    return baseClass
  }

  const getSortIcon = (field: keyof PortfolioRow) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
    }
    return sortDirection === "asc" ? "↑" : "↓"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>
              Your stock holdings with real-time market data
              {lastUpdated && (
                <span className="block text-xs mt-1">Last updated: {new Date(lastUpdated).toLocaleString()}</span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Table</span>
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Cards</span>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "cards" ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : sortedData.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">No portfolio holdings found</div>
            ) : (
              sortedData.map((row) => <MobilePortfolioCard key={row.id} holding={row} />)
            )}
          </div>
        ) : (
          /* Enhanced table with better mobile scrolling */
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 min-w-[200px]"
                      onClick={() => handleSort("particulars")}
                    >
                      <div className="flex items-center gap-1">
                        Particulars
                        {getSortIcon("particulars")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right min-w-[120px]"
                      onClick={() => handleSort("purchase_price")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Purchase Price
                        {getSortIcon("purchase_price")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right min-w-[80px]"
                      onClick={() => handleSort("quantity")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Qty
                        {getSortIcon("quantity")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right min-w-[120px]"
                      onClick={() => handleSort("investment")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Investment
                        {getSortIcon("investment")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right min-w-[100px]"
                      onClick={() => handleSort("portfolio_percentage")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Portfolio (%)
                        {getSortIcon("portfolio_percentage")}
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[80px]">NSE/BSE</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right min-w-[100px]"
                      onClick={() => handleSort("current_price")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        CMP
                        {getSortIcon("current_price")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right min-w-[120px]"
                      onClick={() => handleSort("present_value")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Present Value
                        {getSortIcon("present_value")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right min-w-[120px]"
                      onClick={() => handleSort("gain_loss")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Gain/Loss
                        {getSortIcon("gain_loss")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right min-w-[100px]"
                      onClick={() => handleSort("pe_ratio")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        P/E Ratio
                        {getSortIcon("pe_ratio")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-right min-w-[120px]"
                      onClick={() => handleSort("latest_earnings")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Latest Earnings
                        {getSortIcon("latest_earnings")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        {isLoading ? "Loading portfolio data..." : "No portfolio holdings found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedData.map((row) => (
                      <TableRow key={row.id} className={getRowClassName(row)}>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div className="font-semibold">{row.particulars}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{row.stock_symbol}</span>
                              <Badge className={`text-xs ${getSectorBadgeColor(row.sector)}`}>{row.sector}</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(row.purchase_price)}</TableCell>
                        <TableCell className="text-right font-medium">{row.quantity.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(row.investment)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{row.portfolio_percentage.toFixed(1)}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.exchange_code}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {row.current_price ? (
                            <span className="font-medium">{formatCurrency(row.current_price)}</span>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.present_value ? (
                            <span className="font-medium">{formatCurrency(row.present_value)}</span>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </TableCell>
                        <TableCell className={`text-right ${getGainLossBgColor(row.gain_loss)} rounded-md`}>
                          <div className="flex items-center justify-end gap-1 p-1">
                            {getGainLossIcon(row.gain_loss)}
                            <span className={`font-medium ${getGainLossColor(row.gain_loss)}`}>
                              {row.gain_loss ? formatCurrency(row.gain_loss) : "--"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {row.pe_ratio ? (
                            <span>{row.pe_ratio.toFixed(1)}</span>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.latest_earnings ? (
                            <span>{formatCurrency(row.latest_earnings)}</span>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="block sm:hidden p-2 text-center text-xs text-muted-foreground border-t">
              Scroll horizontally to view all columns
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

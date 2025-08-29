"use client"

import { PortfolioTable } from "@/components/portfolio-table"
import { PortfolioSummaryCards } from "@/components/portfolio-summary"
import { SectorSummaryComponent } from "@/components/sector-summary"
import { RealtimeStatus } from "@/components/realtime-status"
import { NavigationHeader } from "@/components/navigation-header"
import { AddHoldingDialog } from "@/components/add-holding-dialog"
import { ExcelUploadDialog } from "@/components/excel-upload-dialog"
import { usePortfolioRealtime } from "@/hooks/use-portfolio-realtime"

export default function PortfolioDashboard() {
  const {
    portfolioData,
    isLoading,
    isAutoRefreshing,
    error,
    lastUpdated,
    nextUpdateIn,
    fetchPortfolioData,
    toggleAutoRefresh,
  } = usePortfolioRealtime({
    refreshInterval: 15000, // 15 seconds
    autoStart: true,
  })

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="p-4">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Portfolio Dashboard</h1>
              <p className="text-muted-foreground">Real-time insights into your investment portfolio</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Portfolio</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchPortfolioData}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>

            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />

      {/* Enhanced responsive layout with better mobile spacing and typography */}
      <div className="p-2 sm:p-4">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Portfolio Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Real-time insights into your investment portfolio
            </p>
          </div>


          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <AddHoldingDialog onHoldingAdded={fetchPortfolioData} />
              <ExcelUploadDialog onDataImported={fetchPortfolioData} />
            </div>
            <RealtimeStatus
              isAutoRefreshing={isAutoRefreshing}
              isLoading={isLoading}
              nextUpdateIn={nextUpdateIn}
              lastUpdated={lastUpdated}
              onToggleAutoRefresh={toggleAutoRefresh}
              onManualRefresh={fetchPortfolioData}
            />
          </div>

          {/* Portfolio Summary Cards */}
          <PortfolioSummaryCards
            summary={
              portfolioData?.summary || {
                total_investment: 0,
                total_present_value: 0,
                total_gain_loss: 0,
                total_gain_loss_percentage: 0,
              }
            }
            isLoading={isLoading}
          />

          {/* Portfolio Table */}
          <PortfolioTable
            data={portfolioData?.holdings || []}
            isLoading={isLoading}
            lastUpdated={portfolioData?.last_updated}
          />

          {/* Sector Summary */}
          <SectorSummaryComponent
            sectors={portfolioData?.sectors || []}
            portfolioSummary={
              portfolioData?.summary || {
                total_investment: 0,
                total_present_value: 0,
                total_gain_loss: 0,
                total_gain_loss_percentage: 0,
              }
            }
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

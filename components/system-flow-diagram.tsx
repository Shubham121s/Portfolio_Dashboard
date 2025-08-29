import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowDown, Database, Globe, Monitor, Server, Smartphone, RefreshCw } from "lucide-react"

export default function SystemFlowDiagram() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dynamic Portfolio Dashboard - System Architecture</h1>
        <p className="text-gray-600">Frontend ↔ Backend ↔ API Integration Flow</p>
      </div>

      {/* User Flow Section */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Monitor className="w-5 h-5" />
            User Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              "Dashboard Access",
              "Add Holdings",
              "Live Data Fetch",
              "Portfolio Display",
              "Real-time Updates",
              "Sector Analysis",
            ].map((step, index, array) => (
              <React.Fragment key={step}>
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                  {index + 1}. {step}
                </Badge>
                {index < array.length - 1 && <ArrowRight className="w-4 h-4 text-blue-500" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frontend */}
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Smartphone className="w-5 h-5" />
              Frontend (Next.js)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Components:</h4>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• Portfolio Table</li>
                <li>• Real-time Status</li>
                <li>• Sector Summary</li>
                <li>• Mobile Cards</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Features:</h4>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• Responsive Design</li>
                <li>• Real-time Updates</li>
                <li>• Visual Indicators</li>
                <li>• Sorting & Filtering</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Backend */}
        <Card className="border-2 border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Server className="w-5 h-5" />
              Backend (Node.js)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">API Routes:</h4>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• /api/portfolio</li>
                <li>• /api/portfolio/[id]</li>
                <li>• /api/stocks/update</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Services:</h4>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• Stock Data Fetching</li>
                <li>• Portfolio Calculations</li>
                <li>• Data Transformation</li>
                <li>• Error Handling</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* External APIs */}
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Globe className="w-5 h-5" />
              External APIs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Data Sources:</h4>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• Yahoo Finance (CMP)</li>
                <li>• Google Finance (P/E, Earnings)</li>
                <li>• NSE/BSE Data</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Features:</h4>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• Rate Limiting</li>
                <li>• Error Handling</li>
                <li>• Data Caching</li>
                <li>• Mock Simulation</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Flow */}
      <Card className="border-2 border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <RefreshCw className="w-5 h-5" />
            Real-time Data Flow (15-second intervals)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Monitor className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-sm">Frontend</h4>
              <p className="text-xs text-gray-600">Timer triggers update</p>
            </div>

            <ArrowRight className="w-6 h-6 text-indigo-500 hidden lg:block" />
            <ArrowDown className="w-6 h-6 text-indigo-500 lg:hidden" />

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <Server className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-sm">Backend API</h4>
              <p className="text-xs text-gray-600">Process request</p>
            </div>

            <ArrowRight className="w-6 h-6 text-indigo-500 hidden lg:block" />
            <ArrowDown className="w-6 h-6 text-indigo-500 lg:hidden" />

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-sm">External APIs</h4>
              <p className="text-xs text-gray-600">Fetch live data</p>
            </div>

            <ArrowRight className="w-6 h-6 text-indigo-500 hidden lg:block" />
            <ArrowDown className="w-6 h-6 text-indigo-500 lg:hidden" />

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-sm">Update UI</h4>
              <p className="text-xs text-gray-600">Display new data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Schema */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Database className="w-5 h-5" />
            Database Schema
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-3">Portfolio Holdings Table</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-xs space-y-1 font-mono">
                  <li>• id (Primary Key)</li>
                  <li>• stock_name (VARCHAR)</li>
                  <li>• purchase_price (DECIMAL)</li>
                  <li>• quantity (INTEGER)</li>
                  <li>• sector (VARCHAR)</li>
                  <li>• exchange_code (VARCHAR)</li>
                  <li>• created_at (TIMESTAMP)</li>
                </ul>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Live Stock Data</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-xs space-y-1 font-mono">
                  <li>• current_price (DECIMAL)</li>
                  <li>• pe_ratio (DECIMAL)</li>
                  <li>• latest_earnings (DECIMAL)</li>
                  <li>• last_updated (TIMESTAMP)</li>
                  <li>• price_change (DECIMAL)</li>
                  <li>• volume (INTEGER)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card className="border-2 border-emerald-200">
        <CardHeader className="bg-emerald-50">
          <CardTitle className="text-emerald-800">Key Features Implemented</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Real-time Updates (15s)",
              "Responsive Design",
              "Visual Gain/Loss Indicators",
              "Sector-wise Grouping",
              "Portfolio Performance Metrics",
              "Mobile-friendly Interface",
              "Sortable Data Tables",
              "Error Handling",
              "Loading States",
              "Auto-refresh Controls",
              "Color-coded Performance",
              "Professional UI/UX",
            ].map((feature) => (
              <Badge key={feature} variant="secondary" className="justify-center py-2">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

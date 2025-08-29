"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RefreshCw, Clock, Wifi, WifiOff } from "lucide-react"

interface RealtimeStatusProps {
  isAutoRefreshing: boolean
  isLoading: boolean
  nextUpdateIn: number
  lastUpdated: string | null
  onToggleAutoRefresh: () => void
  onManualRefresh: () => void
}

export function RealtimeStatus({
  isAutoRefreshing,
  isLoading,
  nextUpdateIn,
  lastUpdated,
  onToggleAutoRefresh,
  onManualRefresh,
}: RealtimeStatusProps) {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const updated = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`
    } else {
      return `${Math.floor(diffInSeconds / 3600)}h ago`
    }
  }

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Auto-refresh status */}
            <div className="flex items-center gap-2">
              {isAutoRefreshing ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-muted-foreground" />
              )}
              <Badge variant={isAutoRefreshing ? "default" : "secondary"}>{isAutoRefreshing ? "Live" : "Paused"}</Badge>
            </div>

            {/* Status information */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
              {/* Last updated */}
              {lastUpdated && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Updated {formatTimeAgo(lastUpdated)}</span>
                </div>
              )}

              {/* Next update countdown */}
              {isAutoRefreshing && nextUpdateIn > 0 && (
                <div className="flex items-center gap-2">
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Next update in {nextUpdateIn}s</span>
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onManualRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              variant={isAutoRefreshing ? "secondary" : "default"}
              size="sm"
              onClick={onToggleAutoRefresh}
              className="flex items-center gap-2"
            >
              {isAutoRefreshing ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span className="hidden sm:inline">Start</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

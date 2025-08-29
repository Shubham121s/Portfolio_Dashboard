"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { PortfolioRow, PortfolioSummary, SectorSummary } from "@/lib/types"

interface PortfolioData {
  holdings: PortfolioRow[]
  summary: PortfolioSummary
  sectors: SectorSummary[]
  last_updated: string
}

interface UsePortfolioRealtimeOptions {
  refreshInterval?: number // in milliseconds
  autoStart?: boolean
}

interface UsePortfolioRealtimeReturn {
  portfolioData: PortfolioData | null
  isLoading: boolean
  isAutoRefreshing: boolean
  error: string | null
  lastUpdated: string | null
  nextUpdateIn: number
  fetchPortfolioData: () => Promise<void>
  startAutoRefresh: () => void
  stopAutoRefresh: () => void
  toggleAutoRefresh: () => void
}

export function usePortfolioRealtime(options: UsePortfolioRealtimeOptions = {}): UsePortfolioRealtimeReturn {
  const { refreshInterval = 15000, autoStart = true } = options

  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextUpdateIn, setNextUpdateIn] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  const isComponentMounted = useRef(true)
  const portfolioDataRef = useRef<PortfolioData | null>(null)

  useEffect(() => {
    portfolioDataRef.current = portfolioData
  }, [portfolioData])

  const fetchPortfolioData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // First, update stock data if we have existing portfolio data
      if (portfolioDataRef.current) {
        const symbols = portfolioDataRef.current.holdings.map((h) => h.stock_symbol)
        if (symbols.length > 0) {
          await fetch("/api/stocks/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symbols }),
          })
        }
      }

      // Then fetch fresh portfolio data
      const response = await fetch("/api/portfolio")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        if (isComponentMounted.current) {
          setPortfolioData(result.data)
        }
      } else {
        throw new Error(result.error || "Unknown error occurred")
      }
    } catch (err) {
      if (isComponentMounted.current) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching portfolio data:", err)
      }
    } finally {
      if (isComponentMounted.current) {
        setIsLoading(false)
      }
    }
  }, []) // Empty dependency array since we use refs for dynamic values

  const startCountdown = useCallback(() => {
    setNextUpdateIn(refreshInterval / 1000)

    countdownRef.current = setInterval(() => {
      setNextUpdateIn((prev) => {
        if (prev <= 1) {
          return refreshInterval / 1000
        }
        return prev - 1
      })
    }, 1000)
  }, [refreshInterval])

  const stopCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    setNextUpdateIn(0)
  }, [])

  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) return // Already running

    setIsAutoRefreshing(true)
    startCountdown()

    intervalRef.current = setInterval(() => {
      fetchPortfolioData()
    }, refreshInterval)
  }, [fetchPortfolioData, refreshInterval, startCountdown])

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    stopCountdown()
    setIsAutoRefreshing(false)
  }, [stopCountdown])

  const toggleAutoRefresh = useCallback(() => {
    if (isAutoRefreshing) {
      stopAutoRefresh()
    } else {
      startAutoRefresh()
    }
  }, [isAutoRefreshing, startAutoRefresh, stopAutoRefresh])

  // Initial data fetch
  useEffect(() => {
    fetchPortfolioData()
  }, [fetchPortfolioData]) // Added fetchPortfolioData as dependency since it's stable now

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && portfolioData && !isAutoRefreshing) {
      startAutoRefresh()
    }
  }, [autoStart, portfolioData, isAutoRefreshing, startAutoRefresh])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMounted.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [])

  return {
    portfolioData,
    isLoading,
    isAutoRefreshing,
    error,
    lastUpdated: portfolioData?.last_updated || null,
    nextUpdateIn,
    fetchPortfolioData,
    startAutoRefresh,
    stopAutoRefresh,
    toggleAutoRefresh,
  }
}

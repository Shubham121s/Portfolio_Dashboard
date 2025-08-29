"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, GitBranch } from "lucide-react"

export function NavigationHeader() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Portfolio Dashboard</span>
            </div>
          </div>

          <nav className="flex items-center space-x-2">
            <Link href="/">
              {/* <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" className="text-sm">
                Dashboard
              </Button> */}
            </Link>
            <Link href="/system-flow">
              <Button
                variant={pathname === "/system-flow" ? "default" : "ghost"}
                size="sm"
                className="text-sm flex items-center gap-1"
              >
                {/* <GitBranch className="h-4 w-4" />
                System Flow
                <Badge variant="secondary" className="ml-1 text-xs">
                  Docs
                </Badge> */}
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}

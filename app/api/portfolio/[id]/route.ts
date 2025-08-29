import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid holding ID" }, { status: 400 })
    }

    const holding = await db.getPortfolioHolding(id)
    if (!holding) {
      return NextResponse.json({ success: false, error: "Holding not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: holding,
    })
  } catch (error) {
    console.error("Error fetching portfolio holding:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch portfolio holding" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid holding ID" }, { status: 400 })
    }

    const body = await request.json()
    const updates = { ...body }

    // Convert numeric fields
    if (updates.purchase_price) updates.purchase_price = Number.parseFloat(updates.purchase_price)
    if (updates.quantity) updates.quantity = Number.parseInt(updates.quantity)
    if (updates.stock_symbol) updates.stock_symbol = updates.stock_symbol.toUpperCase()

    const updatedHolding = await db.updatePortfolioHolding(id, updates)
    if (!updatedHolding) {
      return NextResponse.json({ success: false, error: "Holding not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedHolding,
    })
  } catch (error) {
    console.error("Error updating portfolio holding:", error)
    return NextResponse.json({ success: false, error: "Failed to update portfolio holding" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid holding ID" }, { status: 400 })
    }

    const deleted = await db.deletePortfolioHolding(id)
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Holding not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Holding deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting portfolio holding:", error)
    return NextResponse.json({ success: false, error: "Failed to delete portfolio holding" }, { status: 500 })
  }
}

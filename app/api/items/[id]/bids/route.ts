import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { broadcastUpdate } from "@/app/api/realtime/route"

// GET /api/items/[id]/bids - Get all bids for an item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bids = await prisma.bid.findMany({
      where: { itemId: id },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(bids)
  } catch (error) {
    console.error("Error fetching bids:", error)
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 })
  }
}

// POST /api/items/[id]/bids - Create new bid
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount } = body

    if (!amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const bidderName = user.username ? `@${user.username}` : user.emailAddresses[0]?.emailAddress || "Anonymous"

    // Get current item
    const item = await prisma.item.findUnique({
      where: { id }
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Check if auction has ended
    if (new Date(item.endsAt) < new Date()) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 })
    }

    // Validate bid amount
    const minIncrement = Math.max(Math.ceil(item.currentPrice * 0.01), 5)
    const minBid = item.currentPrice + minIncrement

    if (parseFloat(amount) < minBid) {
      return NextResponse.json(
        { error: `Bid must be at least ${minBid} SAR` },
        { status: 400 }
      )
    }

    // Create bid and update item in a transaction
    const [bid, updatedItem] = await prisma.$transaction([
      prisma.bid.create({
        data: {
          amount: parseFloat(amount),
          bidderName,
          itemId: id,
          userId: userId
        }
      }),
      prisma.item.update({
        where: { id },
        data: { currentPrice: parseFloat(amount) }
      })
    ])

    // Broadcast real-time update to all connected clients
    broadcastUpdate({
      type: "bid_placed",
      itemId: id,
      bid,
      item: updatedItem
    })

    return NextResponse.json(bid, { status: 201 })
  } catch (error) {
    console.error("Error creating bid:", error)
    return NextResponse.json({ error: "Failed to create bid" }, { status: 500 })
  }
}

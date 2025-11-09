import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: authUserId } = await auth()
    
    // Only allow users to see their own bids
    if (authUserId !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bids = await prisma.bid.findMany({
      where: {
        userId: params.userId
      },
      include: {
        item: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter out bids for hidden items
    const visibleBids = bids.filter(bid => !bid.item.hidden)

    return NextResponse.json(visibleBids)
  } catch (error) {
    console.error("Error fetching user bids:", error)
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 })
  }
}

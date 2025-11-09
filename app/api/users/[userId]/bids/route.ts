import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: authUserId } = await auth()
    const { userId } = await params
    
    console.log("[User Bids] Auth user:", authUserId, "Requested user:", userId)
    
    // Only allow users to see their own bids
    if (authUserId !== userId) {
      console.log("[User Bids] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bids = await prisma.bid.findMany({
      where: {
        userId: userId
      },
      include: {
        item: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log("[User Bids] Found", bids.length, "bids for user", userId)
    // Show all bids including those on hidden items (user's own profile)
    return NextResponse.json(bids)
  } catch (error) {
    console.error("Error fetching user bids:", error)
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 })
  }
}

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
    
    console.log("[User Listings] Auth user:", authUserId, "Requested user:", userId)
    
    // Only allow users to see their own listings
    if (authUserId !== userId) {
      console.log("[User Listings] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await prisma.item.findMany({
      where: {
        userId: userId
        // Show all items including hidden ones on user's own profile
      },
      include: {
        bids: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log("[User Listings] Found", items.length, "items for user", userId)
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching user listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

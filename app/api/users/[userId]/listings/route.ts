import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: authUserId } = await auth()
    
    // Only allow users to see their own listings
    if (authUserId !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await prisma.item.findMany({
      where: {
        userId: params.userId,
        hidden: false
      },
      include: {
        bids: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching user listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { generateUniqueShortId } from "@/lib/id-generator"

// GET /api/items - Get all active items
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      where: {
        endsAt: {
          gte: new Date()
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        _count: {
          select: { bids: true }
        }
      }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

// POST /api/items - Create new item
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/items - Starting")
    const { userId } = await auth()
    console.log("Auth userId:", userId)
    const user = await currentUser()
    console.log("Current user:", user?.username, user?.emailAddresses[0]?.emailAddress)
    
    if (!userId || !user) {
      console.log("Unauthorized - no userId or user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Received body:", JSON.stringify(body, null, 2))
    const { title, description, city, startingPrice, duration, imageUrl, images, thumbnails } = body

    if (!title || !city || !startingPrice || !duration) {
      console.log("Missing fields:", { title, city, startingPrice, duration })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const endsAt = new Date()
    endsAt.setHours(endsAt.getHours() + parseInt(duration))

    // Generate unique short ID
    const id = await generateUniqueShortId(async (id) => {
      const existing = await prisma.item.findUnique({ where: { id } })
      return !!existing
    })

    // Get phone from user's public metadata, default if not set
    const sellerPhone = (user.publicMetadata?.phone as string) || "966000000000"

    console.log("Creating item with phone:", sellerPhone)

    const item = await prisma.item.create({
      data: {
        id,
        title,
        description,
        city,
        startingPrice: parseFloat(startingPrice),
        currentPrice: parseFloat(startingPrice),
        sellerName: user.username ? `@${user.username}` : user.emailAddresses[0]?.emailAddress || "Anonymous",
        sellerPhone: sellerPhone,
        imageUrl: imageUrl || (images && images[0]) || null,
        images: images || [],
        thumbnails: thumbnails || [],
        endsAt,
        userId: userId
      }
    })

    console.log("Item created successfully:", item.id)
    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    console.error("Error creating item:", error)
    console.error("Error stack:", error.stack)
    console.error("Error message:", error.message)
    return NextResponse.json({ 
      error: "Failed to create item", 
      details: error.message 
    }, { status: 500 })
  }
}

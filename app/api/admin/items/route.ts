import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "your-secret-key-change-in-production"
)

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return false
  }

  try {
    const token = authHeader.substring(7)
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  try {
    console.log("[Admin API] Items endpoint called")
    
    // Verify admin
    const isAdmin = await verifyAdmin(request)
    console.log("[Admin API] Is admin:", isAdmin)
    
    if (!isAdmin) {
      console.log("[Admin API] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all items with bids
    console.log("[Admin API] Fetching items from database...")
    const items = await prisma.item.findMany({
      include: {
        bids: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log("[Admin API] Found", items.length, "items")
    return NextResponse.json(items)
  } catch (error) {
    console.error("[Admin API] Error fetching items:", error)
    return NextResponse.json({ error: "Failed to fetch items", details: String(error) }, { status: 500 })
  }
}

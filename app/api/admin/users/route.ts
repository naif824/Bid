import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { clerkClient } from "@clerk/nextjs/server"
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
    console.log("[Admin API] Users endpoint called")
    
    // Verify admin
    const isAdmin = await verifyAdmin(request)
    console.log("[Admin API] Is admin:", isAdmin)
    
    if (!isAdmin) {
      console.log("[Admin API] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all users from Clerk
    console.log("[Admin API] Fetching users from Clerk...")
    const clerk = await clerkClient()
    const { data: clerkUsers } = await clerk.users.getUserList()
    console.log("[Admin API] Found", clerkUsers.length, "users from Clerk")

    // Get listings and bids count for each user
    const usersWithStats = await Promise.all(
      clerkUsers.map(async (user) => {
        const listingsCount = await prisma.item.count({
          where: { userId: user.id }
        })

        const bidsCount = await prisma.bid.count({
          where: { userId: user.id }
        })

        return {
          id: user.id,
          username: user.username,
          email: user.emailAddresses[0]?.emailAddress || "",
          listingsCount,
          bidsCount
        }
      })
    )

    console.log("[Admin API] Returning", usersWithStats.length, "users with stats")
    return NextResponse.json(usersWithStats)
  } catch (error) {
    console.error("[Admin API] Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users", details: String(error) }, { status: 500 })
  }
}

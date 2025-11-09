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

export async function POST(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    // Verify admin
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { hidden } = await request.json()

    const item = await prisma.item.update({
      where: { id: params.itemId },
      data: { hidden }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error toggling hidden:", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

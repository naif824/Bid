import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 })
  }

  // Validate username format: 4-15 characters, letters, numbers, underscore only
  if (!/^[a-z0-9_]{4,15}$/.test(username)) {
    return NextResponse.json({ available: false, error: "Invalid format" })
  }

  try {
    // Check if username exists in Clerk via direct API
    const response = await fetch(`https://api.clerk.com/v1/users?username=${encodeURIComponent(username)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error("Clerk API error:", await response.text())
      return NextResponse.json({ error: "Failed to check username" }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ available: data.length === 0 })
  } catch (error) {
    console.error("Error checking username:", error)
    return NextResponse.json({ error: "Failed to check username" }, { status: 500 })
  }
}

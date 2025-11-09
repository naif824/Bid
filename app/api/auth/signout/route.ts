import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Sign out via Clerk API
    const response = await fetch(`https://api.clerk.com/v1/sessions/${userId}/end`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error("Clerk signout error:", await response.text())
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error signing out:", error)
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 })
  }
}

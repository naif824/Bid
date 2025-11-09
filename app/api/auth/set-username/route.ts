import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { username } = await request.json()

    if (!username || username.length < 4 || username.length > 15) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 })
    }

    // Validate username format
    if (!/^[a-z0-9_]{4,15}$/.test(username)) {
      return NextResponse.json({ error: "Invalid username format" }, { status: 400 })
    }

    // Check if username is already taken via direct API
    const checkResponse = await fetch(`https://api.clerk.com/v1/users?username=${encodeURIComponent(username)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!checkResponse.ok) {
      console.error("Clerk API error:", await checkResponse.text())
      return NextResponse.json({ error: "Failed to check username" }, { status: 500 })
    }

    const existingUsers = await checkResponse.json()
    if (existingUsers.length > 0 && existingUsers[0].id !== userId) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    // Update user's username in Clerk via direct API
    const updateResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error("Clerk API error:", errorText)
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        errorData = { message: errorText }
      }
      return NextResponse.json({ 
        error: errorData.errors?.[0]?.message || errorData.message || "Failed to set username" 
      }, { status: 500 })
    }

    const updatedUser = await updateResponse.json()
    console.log("Username updated successfully:", updatedUser.username)
    return NextResponse.json({ success: true, username: updatedUser.username })
  } catch (error: any) {
    console.error("Error setting username:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to set username" 
    }, { status: 500 })
  }
}

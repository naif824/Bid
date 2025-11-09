import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { phone } = await request.json()

    if (!phone || !/^966\d{9,10}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone format" }, { status: 400 })
    }

    // Update user's phone in Clerk public metadata via direct API
    const updateResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        public_metadata: {
          phone: phone
        }
      })
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error("Clerk API error:", errorText)
      return NextResponse.json({ 
        error: "Failed to save phone number" 
      }, { status: 500 })
    }

    const updatedUser = await updateResponse.json()
    console.log("Phone updated successfully:", updatedUser.public_metadata?.phone)
    return NextResponse.json({ success: true, phone: updatedUser.public_metadata?.phone })
  } catch (error: any) {
    console.error("Error setting phone:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to save phone number" 
    }, { status: 500 })
  }
}

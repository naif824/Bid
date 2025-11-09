import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, redirect_url } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_MOJOAUTH_API_KEY

    if (!apiKey || apiKey === "your-mojoauth-api-key-here") {
      return NextResponse.json(
        { error: "MojoAuth API key not configured" },
        { status: 500 }
      )
    }

    // Send magic link via MojoAuth API
    const response = await fetch("https://api.mojoauth.com/users/magiclink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey
      },
      body: JSON.stringify({
        email,
        redirect_url: "https://watch.ws/auth/verify",
        language: "en"
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("MojoAuth error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to send magic link" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error sending magic link:", error)
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { SignJWT } from "jose"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_MOJOAUTH_API_KEY

    if (!apiKey || apiKey === "your-mojoauth-api-key-here") {
      return NextResponse.json(
        { error: "MojoAuth API key not configured" },
        { status: 500 }
      )
    }

    // Verify token with MojoAuth
    const verifyResponse = await fetch(
      `https://api.mojoauth.com/token/verify?token=${token}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": apiKey
        }
      }
    )

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    const mojoData = await verifyResponse.json()
    const { email, identifier } = mojoData.user

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0], // Use email prefix as default name
          password: "" // No password needed for magic link
        }
      })
    }

    // Create session token
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
    const sessionToken = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret)

    // Set session cookie
    const finalResponse = NextResponse.json({ success: true, user })
    finalResponse.cookies.set("next-auth.session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/"
    })

    return finalResponse
  } catch (error) {
    console.error("Error verifying magic link:", error)
    return NextResponse.json(
      { error: "Failed to verify magic link" },
      { status: 500 }
    )
  }
}

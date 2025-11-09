import { NextResponse } from "next/server"
import { SignJWT } from "jose"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin"
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "your-secret-key-change-in-production"
)

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create JWT token
      const token = await new SignJWT({ admin: true })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET)

      return NextResponse.json({ token, success: true })
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    )
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    )
  }
}

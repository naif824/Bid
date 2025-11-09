import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const state_id = request.nextUrl.searchParams.get("state_id")

  if (!state_id) {
    return NextResponse.json({ error: "Missing state_id" }, { status: 400 })
  }

  try {
    const apiKey = process.env.MOJOAUTH_CLIENT_ID
    console.log("Using API Key:", apiKey?.substring(0, 10) + "...")
    console.log("Testing state_id:", state_id)

    const response = await fetch(
      `https://api.mojoauth.com/token/verify?state_id=${state_id}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": apiKey!,
          "Content-Type": "application/json"
        }
      }
    )

    const data = await response.json()
    
    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      data
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

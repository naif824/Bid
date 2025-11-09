"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState("")

  useEffect(() => {
    const handleCallback = async () => {
      const state_id = searchParams.get("state_id")

      if (!state_id) {
        setError("Invalid magic link - no state_id")
        return
      }

      console.log("Received state_id:", state_id)

      try {
        const result = await signIn("mojoauth", {
          state_id,
          redirect: false
        })

        console.log("Sign in result:", result)

        if (result?.ok) {
          // Wait a bit for session to be fully created
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Check if user needs to complete profile
          const sessionRes = await fetch("/api/auth/session")
          const session = await sessionRes.json()
          
          console.log("Session after sign in:", session)
          
          // If username starts with "user_", redirect to complete profile
          if (session?.user?.name?.startsWith("user_")) {
            console.log("New user detected, redirecting to complete profile")
            router.push("/auth/complete-profile")
          } else {
            console.log("Existing user, redirecting to home")
            router.push("/")
          }
        } else {
          setError(`Authentication failed: ${result?.error || "Unknown error"}`)
        }
      } catch (err) {
        console.error("Callback error:", err)
        setError(`Something went wrong: ${err instanceof Error ? err.message : "Unknown"}`)
      }
    }

    handleCallback()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Authentication Error</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Signing you in...</p>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}

"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, setActive } = useSignIn()
  const { signUp, setActive: setActiveSignUp } = useSignUp()
  const { user } = useUser()
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [error, setError] = useState("")

  useEffect(() => {
    const verify = async () => {
      const __clerk_status = searchParams.get("__clerk_status")
      const __clerk_created_session = searchParams.get("__clerk_created_session")
      
      if (__clerk_status === "verified" && __clerk_created_session) {
        try {
          // Attempt to set the session active
          if (signIn) {
            await setActive({ session: __clerk_created_session })
          } else if (signUp) {
            await setActiveSignUp({ session: __clerk_created_session })
          }
          
          setStatus("success")
          
          // Wait a moment for user object to load, then check username
          setTimeout(() => {
            // Redirect to complete profile if no username
            router.push("/auth/complete-profile")
          }, 500)
        } catch (err: any) {
          setStatus("error")
          setError(err.errors?.[0]?.message || "Failed to verify")
        }
      } else {
        setStatus("error")
        setError("Invalid verification link")
      }
    }

    verify()
  }, [searchParams, router, signIn, signUp, setActive, setActiveSignUp])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {status === "verifying" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h1 className="text-2xl font-bold">Verifying...</h1>
            <p className="text-muted-foreground">Please wait while we verify your email</p>
          </>
        )}
        
        {status === "success" && (
          <>
            <div className="mb-4 text-4xl">✅</div>
            <h1 className="text-2xl font-bold">Success!</h1>
            <p className="text-muted-foreground">Redirecting you now...</p>
          </>
        )}
        
        {status === "error" && (
          <>
            <div className="mb-4 text-4xl">❌</div>
            <h1 className="text-2xl font-bold">Verification Failed</h1>
            <p className="text-muted-foreground">{error}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}

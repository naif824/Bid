"use client"

import { useState } from "react"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, Sparkles } from "lucide-react"

export default function AuthPage() {
  const { signIn, setActive } = useSignIn()
  const { signUp, setActive: setActiveSignUp } = useSignUp()
  const router = useRouter()
  
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Try sign-up first (faster for new users)
      const signUpAttempt = await signUp?.create({
        emailAddress: email,
      })

      await signUpAttempt?.prepareEmailAddressVerification({
        strategy: "email_link",
        redirectUrl: `${window.location.origin}/auth/verify`,
      })

      setSent(true)
    } catch (err: any) {
      // If email already exists, try sign-in
      if (err.errors?.[0]?.code === "form_identifier_exists" || 
          err.errors?.[0]?.code === "form_param_format_invalid") {
        try {
          await signIn?.create({
            identifier: email,
            strategy: "email_link",
            redirectUrl: `${window.location.origin}/auth/verify`,
          })

          setSent(true)
        } catch (signInErr: any) {
          setError(signInErr.errors?.[0]?.message || "Failed to send magic link")
        }
      } else {
        setError(err.errors?.[0]?.message || "Failed to send magic link")
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription className="text-base">
              We sent a magic link to <strong className="text-foreground">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium">📧 Click the link to sign in</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The link will expire in 15 minutes. Check your spam folder if you don't see it.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSent(false)
                setEmail("")
              }}
            >
              Use a different email
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to Auction</CardTitle>
          <CardDescription className="text-base">
            Sign in with your email - no password needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoFocus
                className="h-11"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending magic link...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  Continue with email
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                ✨ Passwordless • 🔒 Secure • ⚡ Fast
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

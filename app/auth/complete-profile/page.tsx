"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Check, X, Phone } from "lucide-react"

export default function CompleteProfilePage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  
  // Redirect if user already has both username and phone
  useEffect(() => {
    if (isLoaded && user?.username && user?.publicMetadata?.phone) {
      router.push("/")
    }
  }, [isLoaded, user, router])

  const checkUsername = async (value: string) => {
    if (value.length < 4) {
      setAvailable(null)
      return
    }

    setChecking(true)
    try {
      const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(value)}`)
      const data = await response.json()
      setAvailable(data.available)
    } catch (err) {
      setAvailable(null)
    } finally {
      setChecking(false)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toLowerCase()
    
    // Remove @ if user types it
    value = value.replace(/^@/, "")
    
    // Only allow alphanumeric and underscore
    value = value.replace(/[^a-z0-9_]/g, "")
    
    setUsername(value)
    
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    // Debounce check
    if (value.length >= 4) {
      const timer = setTimeout(() => checkUsername(value), 500)
      setDebounceTimer(timer)
    } else {
      setAvailable(null)
    }
  }

  const normalizePhone = (input: string): string => {
    // Remove all non-digits
    let digits = input.replace(/\D/g, "")
    
    // Remove leading zero if present
    if (digits.startsWith("0")) {
      digits = digits.substring(1)
    }
    
    // Should be 9 or 10 digits
    if (digits.length < 9 || digits.length > 10) {
      throw new Error("Phone number must be 9 or 10 digits")
    }
    
    // Return with 966 prefix
    return `966${digits}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow digits, spaces, and dashes
    const cleaned = value.replace(/[^\d\s-]/g, "")
    setPhone(cleaned)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || username.length < 4 || username.length > 15) {
      setError("Username must be 4-15 characters")
      return
    }

    if (available === false) {
      setError("Username is not available")
      return
    }

    if (!phone) {
      setError("Phone number is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Normalize phone
      const normalizedPhone = normalizePhone(phone)

      // Set username first
      const usernameResponse = await fetch("/api/auth/set-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      })

      if (!usernameResponse.ok) {
        const data = await usernameResponse.json()
        setError(data.error || "Failed to set username")
        setLoading(false)
        return
      }

      // Then set phone
      const phoneResponse = await fetch("/api/auth/set-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone })
      })

      if (!phoneResponse.ok) {
        const data = await phoneResponse.json()
        setError(data.error || "Failed to save phone number")
        setLoading(false)
        return
      }

      // Redirect to homepage
      window.location.href = "/"
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Choose your username and add your phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  @
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={handleUsernameChange}
                  className="pl-7"
                  autoFocus
                />
                {checking && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!checking && available === true && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}
                {!checking && available === false && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                4-15 characters, letters, numbers, and underscores only
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <div className="flex items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                  +966
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="5XXXXXXXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={12}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter 9 or 10 digits (with or without leading 0)
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !available || !phone}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              You can change this later in settings
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

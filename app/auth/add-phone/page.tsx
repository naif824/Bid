"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Phone } from "lucide-react"

export default function AddPhonePage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Redirect if user already has phone
  useEffect(() => {
    if (isLoaded && user) {
      // Check if user already has phone in public metadata
      if (user.publicMetadata?.phone) {
        router.push("/")
      }
    }
  }, [isLoaded, user, router])

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
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone) {
      setError("Phone number is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const normalizedPhone = normalizePhone(phone)
      
      const response = await fetch("/api/auth/set-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone })
      })

      if (response.ok) {
        // Redirect to homepage
        window.location.href = "/"
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save phone number")
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || "Invalid phone number")
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.push("/")
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Phone Number</CardTitle>
          <CardDescription>
            Add your phone number to allow buyers to contact you via WhatsApp
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

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
                disabled={loading}
              >
                Skip
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    Continue
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { storage } from "@/lib/storage"
import type { Bid } from "@/lib/types"

interface BidFormProps {
  itemId: string
  currentPrice: number
  sellerId?: string
}

export function BidForm({ itemId, currentPrice, sellerId }: BidFormProps) {
  const { isSignedIn, user, isLoaded } = useUser()
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")

  const minIncrement = Math.max(Math.ceil(currentPrice * 0.01), 5)
  const minBid = currentPrice + minIncrement

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSignedIn) {
      return
    }
    
    setLoading(true)
    setError("")

    try {
      const bidAmount = Number.parseFloat(amount)

      if (bidAmount < minBid) {
        throw new Error(`Bid must be at least ${minBid} SAR`)
      }

      // Create bid - bidderName and userId will be set from session by API
      const newBid: any = {
        itemId: itemId,
        amount: bidAmount,
      }

      await storage.saveBid(newBid)

      // Dispatch event to refresh bid history
      window.dispatchEvent(new CustomEvent("bids-updated", { detail: { itemId } }))
      
      // Also refresh the item to update current price
      window.dispatchEvent(new Event("items-updated"))

      setAmount("")
      setError("")
    } catch (error: any) {
      setError(error.message || "Failed to place bid")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-4">Place a Bid</h3>
        <p className="text-sm text-muted-foreground mb-4">You must be signed in to place a bid</p>
        <Link href="/auth">
          <Button className="w-full">Sign In to Bid</Button>
        </Link>
      </div>
    )
  }

  // Check if user is the seller
  if (sellerId && user?.id === sellerId) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-4">Place a Bid</h3>
        <p className="text-sm text-muted-foreground">You cannot bid on your own listing</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">Place a Bid</h3>

      {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="amount">Bid Amount (SAR) *</Label>
        <Input
          id="amount"
          type="number"
          required
          min={minBid}
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={minBid.toString()}
        />
        <p className="text-xs text-muted-foreground">
          Minimum bid: {minBid.toFixed(0)} SAR (current + {minIncrement} SAR)
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Placing Bid...
          </>
        ) : (
          "Place Bid"
        )}
      </Button>
    </form>
  )
}

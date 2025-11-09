"use client"

import { useEffect, useState } from "react"
import type { Bid } from "@/lib/types"
import { User, Clock } from "lucide-react"
import { storage } from "@/lib/storage"

interface BidHistoryProps {
  itemId: string
  initialBids: Bid[]
}

export function BidHistory({ itemId, initialBids }: BidHistoryProps) {
  const [bids, setBids] = useState<Bid[]>(initialBids)

  useEffect(() => {
    const handleBidUpdate = async (e: CustomEvent) => {
      if (e.detail?.itemId === itemId) {
        const updatedBids = await storage.getBids(itemId)
        setBids(updatedBids.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      }
    }

    window.addEventListener("bids-updated", handleBidUpdate as EventListener)

    return () => {
      window.removeEventListener("bids-updated", handleBidUpdate as EventListener)
    }
  }, [itemId])

  if (bids.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">No bids yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {bids.map((bid, index) => (
        <div
          key={bid.id}
          className="flex items-center justify-between rounded-lg border p-4 transition-colors animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{bid.bidderName.startsWith('@') ? bid.bidderName : `@${bid.bidderName}`}</span>
                {index === 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Leading</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(bid.createdAt).toLocaleString("en-SA", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">
              {bid.amount.toFixed(0)} <span className="text-sm font-normal">SAR</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

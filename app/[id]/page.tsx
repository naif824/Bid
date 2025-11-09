"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { LiveItemView } from "@/components/live-item-view"
import { storage } from "@/lib/storage"
import type { Item, Bid } from "@/lib/types"

async function getItem(id: string): Promise<Item | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/items/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function getBids(itemId: string): Promise<Bid[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/items/${itemId}/bids`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default function ItemPage() {
  const params = useParams()
  const id = params.id as string
  const [item, setItem] = useState<Item | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const fetchedItem = await storage.getItem(id)
      const fetchedBids = await storage.getBids(id)
      const sortedBids = fetchedBids.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setItem(fetchedItem)
      setBids(sortedBids)
      setLoading(false)
    }
    
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
          <p className="text-muted-foreground">Item not found</p>
        </div>
      </div>
    )
  }

  const timeLeft = new Date(item.endsAt).getTime() - Date.now()
  const isEnded = timeLeft <= 0

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container max-w-4xl px-4 py-6">
        <LiveItemView initialItem={item} initialBids={bids} />
      </main>
    </div>
  )
}

function TimeRemaining({ endsAt }: { endsAt: string }) {
  const timeLeft = new Date(endsAt).getTime() - Date.now()
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

  if (timeLeft <= 0) return <span>Ended</span>

  return (
    <span>
      {days > 0 && `${days}d `}
      {hours > 0 && `${hours}h `}
      {minutes}m remaining
    </span>
  )
}

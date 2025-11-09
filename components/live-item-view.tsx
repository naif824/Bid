"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BidForm } from "@/components/bid-form"
import { BidHistory } from "@/components/bid-history"
import { ShareButton } from "@/components/share-button"
import { MapPin, User, Clock, MessageCircle } from "lucide-react"
import type { Item, Bid } from "@/lib/types"
import { storage } from "@/lib/storage"

interface LiveItemViewProps {
  initialItem: Item
  initialBids: Bid[]
}

export function LiveItemView({ initialItem, initialBids }: LiveItemViewProps) {
  const [item, setItem] = useState(initialItem)
  const [timeLeft, setTimeLeft] = useState(new Date(initialItem.endsAt).getTime() - Date.now())
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  // Get all images (use images array if available, fallback to imageUrl)
  const allImages = item.images && item.images.length > 0 ? item.images : (item.imageUrl ? [item.imageUrl] : [])
  const allThumbnails = item.thumbnails && item.thumbnails.length > 0 ? item.thumbnails : allImages

  useEffect(() => {
    const handleItemUpdate = async () => {
      const updatedItem = await storage.getItem(item.id)
      if (updatedItem) {
        setItem(updatedItem)
      }
    }

    window.addEventListener("items-updated", handleItemUpdate)

    // Update time left every second
    const timer = setInterval(() => {
      setTimeLeft(new Date(item.endsAt).getTime() - Date.now())
    }, 1000)

    return () => {
      window.removeEventListener("items-updated", handleItemUpdate)
      clearInterval(timer)
    }
  }, [item.id, item.endsAt])

  const isEnded = timeLeft <= 0
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Image Gallery Section */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
          {allImages.length > 0 ? (
            <Image 
              src={allImages[selectedImageIndex]} 
              alt={`${item.title} - Image ${selectedImageIndex + 1}`} 
              fill 
              className="object-cover" 
              priority 
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        
        {/* Thumbnail Grid */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {allThumbnails.map((thumb, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                  selectedImageIndex === index 
                    ? 'border-primary ring-2 ring-primary ring-offset-2' 
                    : 'border-transparent hover:border-muted-foreground/50'
                }`}
              >
                <Image 
                  src={thumb} 
                  alt={`Thumbnail ${index + 1}`} 
                  fill 
                  className="object-cover" 
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-2 flex items-start justify-between gap-4">
            <h1 className="text-balance text-2xl font-bold leading-tight">{item.title}</h1>
            <div className="flex shrink-0 items-center gap-2">
              <ShareButton title={item.title} currentPrice={item.currentPrice} itemId={item.id} />
              {isEnded && <Badge variant="secondary">Ended</Badge>}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {item.city}
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {item.sellerName.startsWith('@') ? item.sellerName : `@${item.sellerName}`}
            </div>
          </div>
        </div>

        {item.description && (
          <div>
            <h2 className="mb-2 font-semibold">Description</h2>
            <p className="text-pretty text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        )}

        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="mb-1 text-sm text-muted-foreground">Current Bid</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{item.currentPrice.toFixed(0)}</span>
            <span className="text-muted-foreground">SAR</span>
          </div>
          {!isEnded && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {days > 0 && `${days}d `}
                {hours > 0 && `${hours}h `}
                {minutes}m {seconds}s remaining
              </span>
            </div>
          )}
        </div>

        {/* WhatsApp Contact Button */}
        {item.sellerPhone && item.sellerPhone !== "966000000000" && (
          <a
            href={`https://wa.me/${item.sellerPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Seller on WhatsApp
            </Button>
          </a>
        )}

        {!isEnded && <BidForm itemId={item.id} currentPrice={item.currentPrice} sellerId={item.userId} />}
      </div>

      {/* Bid History - Full Width */}
      <div className="lg:col-span-2">
        <h2 className="mb-4 text-xl font-bold">Bid History</h2>
        <BidHistory itemId={item.id} initialBids={initialBids} />
      </div>
    </div>
  )
}

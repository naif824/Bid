import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"
import type { Item } from "@/lib/types"

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const timeLeft = new Date(item.endsAt).getTime() - Date.now()
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <Link href={`/${item.id}`}>
      <Card className="group overflow-hidden border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
        <div className="relative aspect-video w-full overflow-hidden bg-amber-50">
          {item.imageUrl ? (
            <Image 
              src={item.imageUrl || "/placeholder.svg"} 
              alt={item.title} 
              fill 
              className="object-cover transition-transform group-hover:scale-105" 
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-amber-600 text-sm">No image</span>
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="text-balance mb-3 font-bold text-lg leading-tight">{item.title}</h3>
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-amber-600" />
            {item.city}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-600">{item.currentPrice.toFixed(0)}</span>
            <span className="text-muted-foreground text-base">SAR</span>
          </div>
        </CardContent>
        <CardFooter className="border-t border-amber-100 bg-white/50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Clock className="h-4 w-4 text-amber-600" />
            {timeLeft > 0 ? (
              <span>
                {hoursLeft > 0 && `${hoursLeft}h `}
                {minutesLeft}m left
              </span>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Ended
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

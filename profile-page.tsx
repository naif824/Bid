"use client"

import { useEffect, useState, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, TrendingUp } from "lucide-react"
import type { Item, Bid } from "@/lib/types"

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [myListings, setMyListings] = useState<Item[]>([])
  const [myBids, setMyBids] = useState<(Bid & { item: Item })[]>([])
  const [loading, setLoading] = useState(true)

  const loadProfileData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    
    try {
      // Fetch user's listings
      const listingsRes = await fetch(`/api/users/${user.id}/listings`)
      if (listingsRes.ok) {
        const listings = await listingsRes.json()
        setMyListings(Array.isArray(listings) ? listings : [])
      } else {
        console.error('Failed to fetch listings:', listingsRes.status)
        setMyListings([])
      }

      // Fetch user's bids
      const bidsRes = await fetch(`/api/users/${user.id}/bids`)
      if (bidsRes.ok) {
        const bids = await bidsRes.json()
        setMyBids(Array.isArray(bids) ? bids : [])
      } else {
        console.error('Failed to fetch bids:', bidsRes.status)
        setMyBids([])
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
      setMyListings([])
      setMyBids([])
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      router.push('/auth')
      return
    }

    loadProfileData()
  }, [isLoaded, user, router, loadProfileData])

  const getTimeLeft = (endsAt: string) => {
    const timeLeft = new Date(endsAt).getTime() - Date.now()
    if (timeLeft <= 0) return "Ended"
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <SiteHeader />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="mb-4 text-6xl animate-pulse-subtle">⏰</div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <SiteHeader />

      <main className="container mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-3xl">
              {user?.username?.[0]?.toUpperCase() || '👤'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user?.username ? `@${user.username}` : 'My Profile'}
              </h1>
              <p className="text-muted-foreground">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-2 border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{myListings.length}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Bids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{myBids.length}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Auctions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {myListings.filter(item => new Date(item.endsAt) > new Date()).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-6">
            {myListings.length === 0 ? (
              <Card className="border-2 border-amber-100 p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-bold mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-4">Create your first auction!</p>
                <Link href="/create">
                  <button className="rounded-full bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-500">
                    Create Listing
                  </button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myListings.map((item) => (
                  <Link key={item.id} href={`/${item.id}`}>
                    <Card className="group border-2 border-amber-100 transition-all hover:shadow-lg hover:-translate-y-1">
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-amber-600" />
                          {item.city}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-amber-600">
                              {item.currentPrice.toFixed(0)}
                            </span>
                            <span className="text-muted-foreground">SAR</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 text-amber-600" />
                            {getTimeLeft(item.endsAt)}
                          </div>
                          <Badge variant="secondary">
                            {item.bids?.length || 0} bids
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bids" className="mt-6">
            {myBids.length === 0 ? (
              <Card className="border-2 border-amber-100 p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">No bids yet</h3>
                <p className="text-muted-foreground">Start bidding on items!</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {myBids.map((bid) => (
                  <Link key={bid.id} href={`/${bid.item.id}`}>
                    <Card className="border-2 border-amber-100 transition-all hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">{bid.item.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-amber-600" />
                                {bid.item.city}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-amber-600" />
                                {getTimeLeft(bid.item.endsAt)}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Your Bid</p>
                                <p className="text-xl font-bold text-amber-600">
                                  {bid.amount.toFixed(0)} SAR
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Current Price</p>
                                <p className="text-xl font-bold">
                                  {bid.item.currentPrice.toFixed(0)} SAR
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            {bid.amount >= bid.item.currentPrice ? (
                              <Badge className="bg-green-500">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Winning
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Outbid</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

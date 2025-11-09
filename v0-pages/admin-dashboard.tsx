"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, EyeOff, Trash2, Users, Package, TrendingUp } from "lucide-react"

interface User {
  id: string
  username: string | null
  email: string
  listingsCount: number
  bidsCount: number
}

interface ItemWithBids {
  id: string
  title: string
  sellerName: string
  currentPrice: number
  city: string
  createdAt: string
  endsAt: string
  hidden: boolean
  bids: Array<{
    id: string
    amount: number
    bidderName: string
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [items, setItems] = useState<ItemWithBids[]>([])
  const [stats, setStats] = useState({ users: 0, listings: 0, bids: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/mgt")
      return
    }

    loadDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("admin_token")
      let fetchedUsers: User[] = []
      let fetchedItems: ItemWithBids[] = []
      
      // Fetch users
      const usersRes = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!usersRes.ok) {
        console.error("Users API failed:", usersRes.status)
        if (usersRes.status === 401) {
          localStorage.removeItem("admin_token")
          router.push("/mgt")
          return
        }
      } else {
        const usersData = await usersRes.json()
        console.log("Users data:", usersData)
        fetchedUsers = Array.isArray(usersData) ? usersData : []
        setUsers(fetchedUsers)
      }

      // Fetch items
      const itemsRes = await fetch("/api/admin/items", {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!itemsRes.ok) {
        console.error("Items API failed:", itemsRes.status)
        if (itemsRes.status === 401) {
          localStorage.removeItem("admin_token")
          router.push("/mgt")
          return
        }
      } else {
        const itemsData = await itemsRes.json()
        console.log("Items data:", itemsData)
        fetchedItems = Array.isArray(itemsData) ? itemsData : []
        setItems(fetchedItems)
      }

      // Calculate stats using fetched data
      const totalBids = fetchedItems.reduce((sum: number, item: ItemWithBids) => sum + item.bids.length, 0)
      setStats({
        users: fetchedUsers.length,
        listings: fetchedItems.length,
        bids: totalBids
      })
    } catch (error) {
      console.error("Error loading dashboard:", error)
      // Don't redirect on network errors, only on auth errors
    } finally {
      setLoading(false)
    }
  }

  const handleToggleHidden = async (itemId: string, currentHidden: boolean) => {
    try {
      const token = localStorage.getItem("admin_token")
      await fetch(`/api/admin/items/${itemId}/toggle-hidden`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ hidden: !currentHidden })
      })
      
      // Reload data
      loadDashboardData()
    } catch (error) {
      console.error("Error toggling hidden:", error)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return
    }

    try {
      const token = localStorage.getItem("admin_token")
      await fetch(`/api/admin/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Reload data
      loadDashboardData()
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/mgt")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl animate-pulse-subtle">⏰</div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="border-b border-amber-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">⏰</span>
            <div>
              <h1 className="font-bold text-xl">watch.ws Admin</h1>
              <p className="text-muted-foreground text-sm">Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                View Site
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-amber-400"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-2 border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.users}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Package className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.listings}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.bids}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-6">
            <Card className="border-2 border-amber-100">
              <CardHeader>
                <CardTitle>All Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Bids</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <Link href={`/${item.id}`} className="hover:underline">
                            {item.title}
                          </Link>
                        </TableCell>
                        <TableCell>{item.sellerName}</TableCell>
                        <TableCell>{item.city}</TableCell>
                        <TableCell>{item.currentPrice.toFixed(0)} SAR</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.bids.length}</Badge>
                        </TableCell>
                        <TableCell>
                          {item.hidden ? (
                            <Badge variant="destructive">Hidden</Badge>
                          ) : (
                            <Badge className="bg-green-500">Visible</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleHidden(item.id, item.hidden)}
                            >
                              {item.hidden ? (
                                <><Eye className="h-4 w-4 mr-1" /> Show</>
                              ) : (
                                <><EyeOff className="h-4 w-4 mr-1" /> Hide</>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="border-2 border-amber-100">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Listings</TableHead>
                      <TableHead>Bids</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.username ? `@${user.username}` : "No username"}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.listingsCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.bidsCount}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

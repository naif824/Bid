"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { CreateItemForm } from "@/components/create-item-form"
import { SiteHeader } from "@/components/site-header"
import { Loader2 } from "lucide-react"

export default function CreatePage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && !user?.username) {
      router.push("/auth/complete-profile")
    }
  }, [isLoaded, user, router])

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user?.username) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container max-w-2xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-balance text-2xl font-bold">List an Item</h1>
          <p className="text-muted-foreground text-sm">Create your auction listing</p>
        </div>

        <CreateItemForm />
      </main>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useUser, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function SiteHeader() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-amber-100 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <span className="text-3xl">⏰</span>
          <span className="font-bold text-2xl">watch.ws</span>
        </Link>
        <div className="flex items-center gap-3">
          {isLoaded && user ? (
            <>
              <Link href="/create">
                <Button size="sm" className="gap-2 bg-amber-400 text-black hover:bg-amber-500">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">List Item</span>
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.username || 'Account'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.username ? `@${user.username}` : user.emailAddresses[0]?.emailAddress}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/auth">
              <Button size="sm" className="bg-amber-400 text-black hover:bg-amber-500">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
